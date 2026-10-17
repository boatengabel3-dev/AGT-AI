export type UserRole = 
  | 'farmer' 
  | 'supplier' 
  | 'fertilizer_dealer'
  | 'seed_dealer'
  | 'equipment_provider' 
  | 'financial_institution' 
  | 'field_agent' 
  | 'admin';

export type VerificationStatus = 
  | 'not_submitted' 
  | 'pending_verification' 
  | 'additional_info_required' 
  | 'partially_verified' 
  | 'verified' 
  | 'rejected';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  role: UserRole;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  region: string;
  district: string;
  community: string;
  ghanaCardNumber?: string;
  farmingExperienceYears: number;
  primaryCrops: string[];
  cooperativeName?: string;
  cooperativeMembershipId?: string;
  verificationStatus: VerificationStatus;
  profileCompleteness: number; // 0 to 100%
  dataSharingConsent: {
    shareWithBanks: boolean;
    shareWithSuppliers: boolean;
    shareWithFieldAgents: boolean;
    updatedAt: string;
  };
  totalLandAcres: number;
  farmsCount: number;
  updatedAt: string;
}

export interface FarmCoordinate {
  lat: number;
  lng: number;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  region: string;
  district: string;
  community: string;
  centerCoordinates: FarmCoordinate;
  boundaryPolygon: FarmCoordinate[];
  reportedAreaAcres: number;
  verifiedAreaAcres?: number;
  cropType: string;
  secondaryCrops?: string[];
  plantingSeason: string;
  soilType?: string;
  irrigationType: 'rainfed' | 'drip' | 'borehole' | 'river_canal' | 'none';
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  images?: string[];
  documents?: {
    id: string;
    title: string;
    documentType: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  createdAt: string;
}

export type ProductCategory = 
  | 'fertilizers' 
  | 'seeds' 
  | 'crop_protection' 
  | 'irrigation' 
  | 'tools' 
  | 'machinery' 
  | 'protective_equipment' 
  | 'storage_materials';

export interface Product {
  id: string;
  supplierId: string;
  supplierName: string;
  supplierVerified: boolean;
  title: string;
  category: ProductCategory;
  description: string;
  priceGHS: number;
  unit: string; // e.g. "50kg bag", "100m roll", "1L bottle"
  stockQuantity: number;
  specifications: Record<string, string>;
  regulatoryApprovalNumber?: string;
  isRegulatedApproved: boolean;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPriceGHS: number;
  quantity: number;
  unit: string;
  subtotalGHS: number;
}

export interface Order {
  id: string;
  farmerId: string;
  farmerName: string;
  items: OrderItem[];
  totalAmountGHS: number;
  paymentModel: 'direct_purchase' | 'loan_financed' | 'flexible_instalment' | 'agricultural_voucher';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  fulfilmentStatus: 'placed' | 'confirmed' | 'dispatched' | 'ready_for_pickup' | 'delivered';
  deliveryAddress: string;
  deliveryMethod: 'delivery' | 'pickup';
  trackingNumber?: string;
  createdAt: string;
  notes?: string;
}

export interface FinancingProduct {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionType: 'commercial_bank' | 'rural_bank' | 'microfinance' | 'development_partner';
  title: string;
  financingPurpose: string;
  minAmountGHS: number;
  maxAmountGHS: number;
  annualInterestRatePercent: number;
  tenureMonthsMin: number;
  tenureMonthsMax: number;
  gracePeriodMonths: number;
  eligibleCrops: string[];
  requiredDocuments: string[];
  eligibilityCriteria: string[];
  processingFeePercent: number;
  verificationRequired: boolean;
}

export type LoanApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'awaiting_review' 
  | 'additional_info_requested' 
  | 'under_institutional_assessment' 
  | 'approved' 
  | 'declined' 
  | 'withdrawn' 
  | 'financing_completed';

export interface LoanApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerRegion: string;
  financingProductId: string;
  financingProductTitle: string;
  institutionId: string;
  institutionName: string;
  requestedAmountGHS: number;
  approvedAmountGHS?: number;
  proposedTenureMonths: number;
  associatedFarmId: string;
  associatedFarmName: string;
  cropCycle: string;
  intendedActivity: string;
  status: LoanApplicationStatus;
  statusHistory: {
    status: LoanApplicationStatus;
    timestamp: string;
    note: string;
    updatedBy: string;
  }[];
  institutionalNotes?: string;
  disbursementDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentListing {
  id: string;
  providerId: string;
  providerName: string;
  providerPhone: string;
  providerVerified: boolean;
  title: string;
  category: 'tractor' | 'harvester' | 'plough' | 'sprayer' | 'irrigation_pump' | 'planter' | string;
  makeAndModel?: string;
  horsePower?: number;
  horsepower?: number;
  ratePerAcreGHS?: number;
  ratePerDayGHS?: number;
  dailyRateGHS?: number;
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  operationalRegion: string;
  operationalDistricts?: string[];
  availableFrom?: string;
  availableTo?: string;
  imageUrl: string;
  status?: 'available' | 'booked' | 'maintenance';
  availabilityStatus?: 'available' | 'booked' | 'maintenance' | 'in_service' | string;
  description?: string;
  completedJobsCount?: number;
  rating?: number;
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentTitle: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  providerId: string;
  providerName: string;
  farmId: string;
  farmName: string;
  acresToService: number;
  serviceStartDate: string;
  serviceEndDate: string;
  totalCostGHS: number;
  status: 'pending_provider_confirmation' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
  providerNote?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface CropDiagnosisResult {
  id: string;
  cropIdentified: string;
  scientificName?: string;
  condition: 'Healthy' | 'Pest Infestation' | 'Fungal Disease' | 'Bacterial Disease' | 'Viral Disease' | 'Nutrient Deficiency' | 'Environmental Stress';
  diagnosisTitle: string;
  severity: 'healthy' | 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number;
  summary: string;
  symptomsObserved: string[];
  potentialCauses: string[];
  immediateRemedies: {
    action: string;
    productCategory?: string;
    dosageOrApplication?: string;
    mofaApproved: boolean;
  }[];
  culturalAndPreventive: string[];
  safetyAndPPE: string[];
  recommendedCatalogItems?: {
    title: string;
    category: string;
    unitPriceGHS?: number;
    purpose: string;
  }[];
  scannedAt: string;
  modelUsed: string;
}

