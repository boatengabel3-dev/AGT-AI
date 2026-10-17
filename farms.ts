import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../auth';

export const farmsRouter = Router();

// List farms
farmsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'farmer') {
    const userFarms = db.getFarms(req.user!.id);
    return res.json(userFarms);
  }
  // Field agents, financial institutions, admins can view all farms
  const allFarms = db.getFarms();
  return res.json(allFarms);
});

// Get farm by ID
farmsRouter.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const farm = db.getFarmById(req.params.id);
  if (!farm) {
    return res.status(404).json({ error: 'Farm not found' });
  }

  // If farmer, must be owner
  if (req.user!.role === 'farmer' && farm.farmerId !== req.user!.id) {
    return res.status(403).json({ error: 'Unauthorized to view this farm' });
  }

  return res.json(farm);
});

// Register new farm
farmsRouter.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    farmName,
    region,
    district,
    community,
    centerCoordinates,
    boundaryPolygon,
    reportedAreaAcres,
    cropType,
    secondaryCrops,
    plantingSeason,
    soilType,
    irrigationType = 'rainfed',
  } = req.body;

  if (!farmName || !region || !cropType || !reportedAreaAcres) {
    return res.status(400).json({ error: 'Farm name, region, crop type, and acreage are required' });
  }

  // Provide fallback default coordinates if not mapped by user yet (e.g. Sunyani area)
  const center = centerCoordinates || { lat: 7.3399, lng: -2.3268 };
  const boundary = Array.isArray(boundaryPolygon) && boundaryPolygon.length >= 3
    ? boundaryPolygon
    : [
        { lat: center.lat + 0.003, lng: center.lng - 0.002 },
        { lat: center.lat + 0.003, lng: center.lng + 0.002 },
        { lat: center.lat - 0.003, lng: center.lng + 0.002 },
        { lat: center.lat - 0.003, lng: center.lng - 0.002 },
      ];

  const farm = db.createFarm({
    farmerId: req.user!.id,
    farmerName: req.user!.fullName,
    farmName,
    region,
    district: district || 'District not specified',
    community: community || 'Community not specified',
    centerCoordinates: center,
    boundaryPolygon: boundary,
    reportedAreaAcres: Number(reportedAreaAcres),
    cropType,
    secondaryCrops: secondaryCrops || [],
    plantingSeason: plantingSeason || 'Current Season 2026',
    soilType: soilType || 'Loamy agricultural soil',
    irrigationType,
    verificationStatus: 'pending_verification',
    verificationNotes: 'Farm registered. Awaiting ground verification by AgriTrust field agent.',
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'REGISTERED_NEW_FARM',
    resourceType: 'Farm',
    resourceId: farm.id,
    details: `Registered farm ${farm.farmName} (${farm.reportedAreaAcres} acres) in ${farm.region}`,
  });

  db.addNotification({
    userId: req.user!.id,
    title: 'Farm Registration Submitted',
    message: `Your farm "${farm.farmName}" has been registered and is queued for verification.`,
    type: 'info',
    link: '/farms',
  });

  return res.status(201).json({
    message: 'Farm registered successfully',
    farm,
  });
});

// Verify farm (field agent or admin)
farmsRouter.put('/:id/verify', requireAuth, requireRoles(['field_agent', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, verifiedAreaAcres } = req.body;

  const farm = db.updateFarmVerification(
    id,
    status || 'verified',
    notes || 'Ground survey and GPS boundaries validated',
    req.user!.id,
    verifiedAreaAcres !== undefined ? Number(verifiedAreaAcres) : undefined
  );

  if (!farm) {
    return res.status(404).json({ error: 'Farm not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'VERIFIED_FARM',
    resourceType: 'Farm',
    resourceId: farm.id,
    details: `Updated farm verification status to ${status}. Notes: ${notes}`,
  });

  db.addNotification({
    userId: farm.farmerId,
    title: 'Farm Verification Update',
    message: `Your farm "${farm.farmName}" verification status is now "${status}".`,
    type: status === 'verified' ? 'success' : 'warning',
    link: '/farms',
  });

  return res.json({
    message: 'Farm verification updated',
    farm,
  });
});
