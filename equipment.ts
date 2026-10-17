import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const equipmentRouter = Router();

// Browse equipment listings
equipmentRouter.get('/listings', (req, res) => {
  const { region, category } = req.query;
  const listings = db.getEquipmentListings(region as string, category as string);
  return res.json(listings);
});

// Book equipment
equipmentRouter.post('/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    equipmentId,
    farmId,
    acresToService,
    serviceStartDate,
    serviceEndDate,
  } = req.body;

  if (!equipmentId || !farmId || !acresToService || !serviceStartDate) {
    return res.status(400).json({
      error: 'Equipment, farm, acreage, and service start date are required',
    });
  }

  const equipment = db.getEquipmentListings().find((eq) => eq.id === equipmentId);
  if (!equipment) {
    return res.status(404).json({ error: 'Equipment not found' });
  }

  const farm = db.getFarmById(farmId);
  if (!farm) {
    return res.status(404).json({ error: 'Selected farm not found' });
  }

  const acres = Number(acresToService);
  const rate = equipment.ratePerAcreGHS || 150;
  const totalCostGHS = acres * rate;

  const booking = db.createEquipmentBooking({
    equipmentId: equipment.id,
    equipmentTitle: equipment.title,
    farmerId: req.user!.id,
    farmerName: req.user!.fullName,
    farmerPhone: req.user!.phone,
    providerId: equipment.providerId,
    providerName: equipment.providerName,
    farmId: farm.id,
    farmName: farm.farmName,
    acresToService: acres,
    serviceStartDate,
    serviceEndDate: serviceEndDate || serviceStartDate,
    totalCostGHS,
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'BOOKED_EQUIPMENT',
    resourceType: 'EquipmentBooking',
    resourceId: booking.id,
    details: `Booked ${equipment.title} for ${acres} acres on farm ${farm.farmName} (Total: GHS ${totalCostGHS})`,
  });

  db.addNotification({
    userId: req.user!.id,
    title: 'Equipment Booking Request Sent',
    message: `Your booking request #${booking.id} for ${equipment.title} has been transmitted to ${equipment.providerName}.`,
    type: 'info',
    link: '/equipment',
  });

  return res.status(201).json({
    message: 'Booking request created successfully',
    booking,
  });
});

// List bookings
equipmentRouter.get('/bookings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'farmer') {
    const bookings = db.getBookings(req.user!.id);
    return res.json(bookings);
  }
  if (req.user!.role === 'equipment_provider') {
    const bookings = db.getBookings(undefined, req.user!.id);
    return res.json(bookings);
  }
  const bookings = db.getBookings();
  return res.json(bookings);
});

// Provider response to booking
equipmentRouter.put('/bookings/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, providerNote } = req.body;

  const validStatuses = ['confirmed', 'in_progress', 'completed', 'declined', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}` });
  }

  const booking = db.updateBookingStatus(id, status, providerNote);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'EQUIPMENT_BOOKING_STATUS_UPDATED',
    resourceType: 'EquipmentBooking',
    resourceId: booking.id,
    details: `Updated booking status to ${status}. Note: ${providerNote || 'N/A'}`,
  });

  db.addNotification({
    userId: booking.farmerId,
    title: 'Equipment Booking Update',
    message: `Booking #${booking.id} for ${booking.equipmentTitle} is now "${status}". Note: ${providerNote || 'Confirmed by provider'}`,
    type: status === 'confirmed' ? 'success' : status === 'declined' ? 'alert' : 'info',
    link: '/equipment',
  });

  return res.json({
    message: 'Booking status updated',
    booking,
  });
});

// Create new equipment listing (Machinery Admin, Equipment Provider, Admin)
equipmentRouter.post('/listings', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    category,
    description,
    ratePerAcreGHS,
    dailyRateGHS,
    horsepower,
    operatorIncluded,
    fuelIncluded,
    availabilityStatus,
    operationalRegion,
    operationalDistricts,
    imageUrl,
  } = req.body;

  if (!title || !category || !ratePerAcreGHS) {
    return res.status(400).json({ error: 'Title, category, and rate per acre are required' });
  }

  const listing = db.createEquipmentListing({
    providerId: req.user!.id,
    providerName: req.user!.fullName,
    providerPhone: req.user!.phone,
    providerVerified: true,
    title,
    category,
    description: description || '',
    ratePerAcreGHS: Number(ratePerAcreGHS),
    dailyRateGHS: dailyRateGHS ? Number(dailyRateGHS) : undefined,
    horsepower: horsepower ? Number(horsepower) : undefined,
    operatorIncluded: operatorIncluded !== false,
    fuelIncluded: fuelIncluded === true,
    availabilityStatus: availabilityStatus || 'available',
    operationalRegion: operationalRegion || 'Bono Region',
    operationalDistricts: operationalDistricts || ['Sunyani Municipal', 'Sunyani West', 'Berekum'],
    imageUrl: imageUrl || '/src/assets/images/farm_tractor_equipment_1791938387801.jpg',
    rating: 5.0,
    completedJobsCount: 0,
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'CREATED_EQUIPMENT_LISTING',
    resourceType: 'EquipmentListing',
    resourceId: listing.id,
    details: `Added new machinery listing: ${listing.title} at GHS ${listing.ratePerAcreGHS}/acre`,
  });

  return res.status(201).json({ message: 'Equipment listing created successfully', listing });
});

// Update equipment listing
equipmentRouter.put('/listings/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.ratePerAcreGHS !== undefined) updates.ratePerAcreGHS = Number(updates.ratePerAcreGHS);
  if (updates.dailyRateGHS !== undefined) updates.dailyRateGHS = Number(updates.dailyRateGHS);
  if (updates.horsepower !== undefined) updates.horsepower = Number(updates.horsepower);

  const updated = db.updateEquipmentListing(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Equipment listing not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'UPDATED_EQUIPMENT_LISTING',
    resourceType: 'EquipmentListing',
    resourceId: updated.id,
    details: `Updated listing ${updated.title}: GHS ${updated.ratePerAcreGHS}/acre, status: ${updated.availabilityStatus}`,
  });

  return res.json({ message: 'Equipment listing updated successfully', listing: updated });
});

// Delete equipment listing
equipmentRouter.delete('/listings/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const removed = db.deleteEquipmentListing(id);
  if (!removed) {
    return res.status(404).json({ error: 'Equipment listing not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'DELETED_EQUIPMENT_LISTING',
    resourceType: 'EquipmentListing',
    resourceId: id,
    details: `Deleted equipment: ${removed.title}`,
  });

  return res.json({ message: 'Equipment listing removed successfully' });
});
