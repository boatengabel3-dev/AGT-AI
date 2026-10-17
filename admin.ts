import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../auth';

export const adminRouter = Router();

// Platform Overview Metrics
adminRouter.get('/overview', requireAuth, requireRoles(['admin']), (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getAllUsers();
  const farms = db.getFarms();
  const orders = db.getOrders();
  const loans = db.getLoanApplications();
  const equipment = db.getEquipmentListings();
  const bookings = db.getBookings();

  const metrics = {
    totalUsers: users.length,
    usersByRole: {
      farmer: users.filter((u) => u.role === 'farmer').length,
      supplier: users.filter((u) => u.role === 'supplier').length,
      equipment_provider: users.filter((u) => u.role === 'equipment_provider').length,
      financial_institution: users.filter((u) => u.role === 'financial_institution').length,
      field_agent: users.filter((u) => u.role === 'field_agent').length,
      admin: users.filter((u) => u.role === 'admin').length,
    },
    totalFarms: farms.length,
    verifiedFarmsCount: farms.filter((f) => f.verificationStatus === 'verified').length,
    pendingFarmsCount: farms.filter((f) => f.verificationStatus === 'pending_verification').length,
    totalOrders: orders.length,
    totalOrderVolumeGHS: orders.reduce((acc, o) => acc + o.totalAmountGHS, 0),
    totalLoanApplications: loans.length,
    totalLoanRequestedGHS: loans.reduce((acc, l) => acc + l.requestedAmountGHS, 0),
    totalEquipmentListings: equipment.length,
    totalBookings: bookings.length,
  };

  return res.json(metrics);
});

// List all users
adminRouter.get('/users', requireAuth, requireRoles(['admin']), (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getAllUsers();
  return res.json(users);
});

// Update user verification
adminRouter.put('/users/:id/verify', requireAuth, requireRoles(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const user = db.updateUserVerification(id, Boolean(isVerified));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'ADMIN_UPDATED_USER_VERIFICATION',
    resourceType: 'User',
    resourceId: user.id,
    details: `Updated verification status of ${user.fullName} (${user.email}) to ${isVerified}`,
  });

  return res.json({
    message: 'User verification status updated',
    user,
  });
});

// View system audit logs
adminRouter.get('/audit-logs', requireAuth, requireRoles(['admin']), (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.getAuditLogs();
  return res.json(logs);
});
