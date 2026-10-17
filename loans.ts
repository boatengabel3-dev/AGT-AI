import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRoles, AuthenticatedRequest } from '../auth';

export const loansRouter = Router();

// Discover available financing products
loansRouter.get('/products', (_req, res) => {
  const products = db.getFinancingProducts();
  return res.json(products);
});

// List applications
loansRouter.get('/applications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'farmer') {
    const apps = db.getLoanApplications(req.user!.id);
    return res.json(apps);
  }
  if (req.user!.role === 'financial_institution') {
    const apps = db.getLoanApplications(undefined, req.user!.id);
    return res.json(apps);
  }
  // Admin sees all
  const apps = db.getLoanApplications();
  return res.json(apps);
});

// Submit loan application
loansRouter.post('/applications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const {
    financingProductId,
    requestedAmountGHS,
    proposedTenureMonths,
    associatedFarmId,
    cropCycle,
    intendedActivity,
  } = req.body;

  if (!financingProductId || !requestedAmountGHS || !associatedFarmId) {
    return res.status(400).json({
      error: 'Financing product, requested amount, and associated farm are required',
    });
  }

  const finProduct = db.getFinancingProducts().find((p) => p.id === financingProductId);
  if (!finProduct) {
    return res.status(404).json({ error: 'Financing product not found' });
  }

  const farm = db.getFarmById(associatedFarmId);
  if (!farm) {
    return res.status(404).json({ error: 'Selected farm not found' });
  }

  const app = db.createLoanApplication({
    farmerId: req.user!.id,
    farmerName: req.user!.fullName,
    farmerPhone: req.user!.phone,
    farmerRegion: farm.region,
    financingProductId: finProduct.id,
    financingProductTitle: finProduct.title,
    institutionId: finProduct.institutionId,
    institutionName: finProduct.institutionName,
    requestedAmountGHS: Number(requestedAmountGHS),
    proposedTenureMonths: Number(proposedTenureMonths) || 6,
    associatedFarmId: farm.id,
    associatedFarmName: farm.farmName,
    cropCycle: cropCycle || 'Current Farming Season 2026',
    intendedActivity: intendedActivity || 'Agricultural inputs and mechanized land preparation',
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'SUBMITTED_LOAN_APPLICATION',
    resourceType: 'LoanApplication',
    resourceId: app.id,
    details: `Applied for GHS ${app.requestedAmountGHS.toLocaleString()} at ${finProduct.institutionName} for ${farm.farmName}`,
  });

  db.addNotification({
    userId: req.user!.id,
    title: 'Loan Application Submitted',
    message: `Your application #${app.id} for ${finProduct.title} has been transmitted to ${finProduct.institutionName}.`,
    type: 'info',
    link: '/financing',
  });

  return res.status(201).json({
    message: 'Loan application submitted successfully',
    application: app,
  });
});

// Institutional decision on application
loansRouter.put('/:id/decision', requireAuth, requireRoles(['financial_institution', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, note, approvedAmountGHS } = req.body;

  const validStatuses = [
    'under_institutional_assessment',
    'additional_info_requested',
    'approved',
    'declined',
    'financing_completed',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status: ${status}` });
  }

  const app = db.updateLoanApplicationStatus(
    id,
    status,
    note || `Decision recorded by ${req.user!.fullName}`,
    req.user!.fullName,
    approvedAmountGHS !== undefined ? Number(approvedAmountGHS) : undefined
  );

  if (!app) {
    return res.status(404).json({ error: 'Loan application not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'LOAN_DECISION_UPDATED',
    resourceType: 'LoanApplication',
    resourceId: app.id,
    details: `Institutional decision updated to ${status}. Note: ${note}`,
  });

  db.addNotification({
    userId: app.farmerId,
    title: 'Loan Application Update',
    message: `Your financing application for ${app.financingProductTitle} has been updated to "${status}".`,
    type: status === 'approved' ? 'success' : status === 'declined' ? 'alert' : 'info',
    link: '/financing',
  });

  return res.json({
    message: 'Application decision updated',
    application: app,
  });
});

// Create new financing product (Bank Officer, Admin)
loansRouter.post('/products', requireAuth, requireRoles(['financial_institution', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    financingPurpose,
    minAmountGHS,
    maxAmountGHS,
    annualInterestRatePercent,
    tenureMonthsMin,
    tenureMonthsMax,
    gracePeriodMonths,
    eligibleCrops,
    requiredDocuments,
    eligibilityCriteria,
    processingFeePercent,
  } = req.body;

  if (!title || !maxAmountGHS || !annualInterestRatePercent) {
    return res.status(400).json({ error: 'Title, max amount, and interest rate are required' });
  }

  const product = db.createFinancingProduct({
    institutionId: req.user!.id,
    institutionName: req.user!.fullName.includes('Bank') ? req.user!.fullName : 'Agricultural Development Bank (ADB)',
    institutionType: 'commercial_bank',
    title,
    financingPurpose: financingPurpose || 'Agricultural seasonal production and inputs credit.',
    minAmountGHS: Number(minAmountGHS) || 1000,
    maxAmountGHS: Number(maxAmountGHS),
    annualInterestRatePercent: Number(annualInterestRatePercent),
    tenureMonthsMin: Number(tenureMonthsMin) || 3,
    tenureMonthsMax: Number(tenureMonthsMax) || 12,
    gracePeriodMonths: Number(gracePeriodMonths) || 1,
    eligibleCrops: eligibleCrops || ['Maize', 'Soybean', 'Rice', 'Cassava'],
    requiredDocuments: requiredDocuments || ['Ghana Card', 'Verified Farm GPS Polygon'],
    eligibilityCriteria: eligibilityCriteria || ['AgriTrust verified farm parcel', 'Registered cooperative member'],
    processingFeePercent: processingFeePercent !== undefined ? Number(processingFeePercent) : 1.5,
    verificationRequired: true,
  });

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'CREATED_FINANCING_PRODUCT',
    resourceType: 'FinancingProduct',
    resourceId: product.id,
    details: `Created financing product: ${product.title} (Rate: ${product.annualInterestRatePercent}%, Max GHS ${product.maxAmountGHS})`,
  });

  return res.status(201).json({ message: 'Financing product created successfully', product });
});

// Update financing product
loansRouter.put('/products/:id', requireAuth, requireRoles(['financial_institution', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.minAmountGHS !== undefined) updates.minAmountGHS = Number(updates.minAmountGHS);
  if (updates.maxAmountGHS !== undefined) updates.maxAmountGHS = Number(updates.maxAmountGHS);
  if (updates.annualInterestRatePercent !== undefined) updates.annualInterestRatePercent = Number(updates.annualInterestRatePercent);
  if (updates.tenureMonthsMin !== undefined) updates.tenureMonthsMin = Number(updates.tenureMonthsMin);
  if (updates.tenureMonthsMax !== undefined) updates.tenureMonthsMax = Number(updates.tenureMonthsMax);

  const updated = db.updateFinancingProduct(id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Financing product not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'UPDATED_FINANCING_PRODUCT',
    resourceType: 'FinancingProduct',
    resourceId: updated.id,
    details: `Updated loan product ${updated.title}: rate ${updated.annualInterestRatePercent}%, max GHS ${updated.maxAmountGHS}`,
  });

  return res.json({ message: 'Financing product updated successfully', product: updated });
});

// Delete financing product
loansRouter.delete('/products/:id', requireAuth, requireRoles(['financial_institution', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const removed = db.deleteFinancingProduct(id);
  if (!removed) {
    return res.status(404).json({ error: 'Financing product not found' });
  }

  db.addAuditLog({
    actorId: req.user!.id,
    actorName: req.user!.fullName,
    actorRole: req.user!.role,
    action: 'DELETED_FINANCING_PRODUCT',
    resourceType: 'FinancingProduct',
    resourceId: id,
    details: `Deleted financing program: ${removed.title}`,
  });

  return res.json({ message: 'Financing product removed successfully' });
});
