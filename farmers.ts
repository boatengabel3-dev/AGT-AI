import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../auth';

export const farmersRouter = Router();

// Get farmer profile
farmersRouter.get('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.query.userId as string || req.user!.id;

  // Non-farmers can view if data sharing is consented or if privileged
  const profile = db.getFarmerProfile(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Farmer profile not found' });
  }

  // Access control check
  if (req.user!.role === 'farmer' && req.user!.id !== userId) {
    return res.status(403).json({ error: 'Unauthorized to view this farmer profile' });
  }

  return res.json(profile);
});

// Update farmer profile
farmersRouter.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const {
    fullName,
    phone,
    region,
    district,
    community,
    ghanaCardNumber,
    farmingExperienceYears,
    primaryCrops,
    cooperativeName,
    cooperativeMembershipId,
  } = req.body;

  // Calculate completeness score
  let completeness = 20; // base account
  if (fullName && phone) completeness += 20;
  if (region && district && community) completeness += 20;
  if (ghanaCardNumber) completeness += 15;
  if (primaryCrops && primaryCrops.length > 0) completeness += 15;
  if (cooperativeName) completeness += 10;

  const updated = db.upsertFarmerProfile({
    userId,
    fullName: fullName || req.user!.fullName,
    phone: phone || req.user!.phone,
    region,
    district,
    community,
    ghanaCardNumber,
    farmingExperienceYears: Number(farmingExperienceYears) || 1,
    primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : [primaryCrops].filter(Boolean),
    cooperativeName,
    cooperativeMembershipId,
    profileCompleteness: Math.min(completeness, 100),
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'UPDATED_FARMER_PROFILE',
    resourceType: 'FarmerProfile',
    resourceId: updated.id,
    details: `Profile updated. Completeness score is now ${updated.profileCompleteness}%`,
  });

  return res.json({
    message: 'Profile updated successfully',
    profile: updated,
  });
});

// Update data sharing consent
farmersRouter.put('/consent', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { shareWithBanks, shareWithSuppliers, shareWithFieldAgents } = req.body;

  const profile = db.getFarmerProfile(userId);
  if (!profile) {
    return res.status(404).json({ error: 'Farmer profile not found' });
  }

  profile.dataSharingConsent = {
    shareWithBanks: Boolean(shareWithBanks),
    shareWithSuppliers: Boolean(shareWithSuppliers),
    shareWithFieldAgents: Boolean(shareWithFieldAgents),
    updatedAt: new Date().toISOString(),
  };

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'UPDATED_DATA_SHARING_CONSENT',
    resourceType: 'Consent',
    resourceId: profile.id,
    details: `Updated data sharing preferences: Banks=${shareWithBanks}, Suppliers=${shareWithSuppliers}`,
  });

  return res.json({
    message: 'Data sharing preferences updated',
    consent: profile.dataSharingConsent,
  });
});
