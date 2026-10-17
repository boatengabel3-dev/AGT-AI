import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  User,
  FarmerProfile,
  Farm,
  Product,
  Order,
  FinancingProduct,
  LoanApplication,
  EquipmentListing,
  EquipmentBooking,
  NotificationItem,
  AuditLog,
} from '../types';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  farmerProfiles: FarmerProfile[];
  farms: Farm[];
  products: Product[];
  orders: Order[];
  financingProducts: FinancingProduct[];
  loanApplications: LoanApplication[];
  equipmentListings: EquipmentListing[];
  equipmentBookings: EquipmentBooking[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'agritrust_db.json');

// Initial seed password for all demo accounts: "AgriTrust2026!"
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('AgriTrust2026!', 10);

function getInitialDatabase(): DatabaseSchema {
  return {
    users: [
      {
        id: 'usr_farmer_1',
        fullName: 'Kwame Mensah',
        email: 'kwame.mensah@agritrust.gh',
        phone: '+233 24 456 7890',
        country: 'Ghana',
        role: 'farmer',
        isVerified: true,
        avatarUrl: '/src/assets/images/farmer_profile_avatar_1791938388060.jpg',
        createdAt: '2026-01-15T08:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_supplier_1',
        fullName: 'Ama Serwaa (AfriAgro Inputs Ltd)',
        email: 'agro.supplies@agritrust.gh',
        phone: '+233 20 891 2345',
        country: 'Ghana',
        role: 'supplier',
        isVerified: true,
        createdAt: '2026-01-10T09:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_equipment_1',
        fullName: 'Yaw Osei (Volta Mechanised Services)',
        email: 'volta.tractors@agritrust.gh',
        phone: '+233 27 123 4567',
        country: 'Ghana',
        role: 'equipment_provider',
        isVerified: true,
        createdAt: '2026-01-12T10:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_bank_1',
        fullName: 'Dr. Evelyn Addo (Agricultural Development Bank)',
        email: 'agri.bank@agritrust.gh',
        phone: '+233 30 221 0000',
        country: 'Ghana',
        role: 'financial_institution',
        isVerified: true,
        createdAt: '2026-01-05T11:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_agent_1',
        fullName: 'Kofi Boateng (Field Verification Officer)',
        email: 'agent.kofi@agritrust.gh',
        phone: '+233 55 987 6543',
        country: 'Ghana',
        role: 'field_agent',
        isVerified: true,
        createdAt: '2026-01-08T07:30:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_admin_1',
        fullName: 'Nana Akwasi (Operations Director)',
        email: 'admin@agritrust.gh',
        phone: '+233 24 000 1122',
        country: 'Ghana',
        role: 'admin',
        isVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_fert_1',
        fullName: 'Kofi Asare (AfriAgro Fertilizers Admin)',
        email: 'fertilizer.admin@agritrust.gh',
        phone: '+233 20 555 1234',
        country: 'Ghana',
        role: 'fertilizer_dealer',
        isVerified: true,
        createdAt: '2026-01-10T09:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
      {
        id: 'usr_seed_1',
        fullName: 'Abena Mansa (Heritage Seed Co. Admin)',
        email: 'seed.admin@agritrust.gh',
        phone: '+233 24 777 8899',
        country: 'Ghana',
        role: 'seed_dealer',
        isVerified: true,
        createdAt: '2026-01-11T09:00:00Z',
        passwordHash: DEFAULT_PASSWORD_HASH,
      },
    ],
    farmerProfiles: [
      {
        id: 'prof_farmer_1',
        userId: 'usr_farmer_1',
        fullName: 'Kwame Mensah',
        phone: '+233 24 456 7890',
        region: 'Bono Region',
        district: 'Sunyani Municipal',
        community: 'Fiapre',
        ghanaCardNumber: 'GHA-712893812-4',
        farmingExperienceYears: 12,
        primaryCrops: ['Maize', 'Soybeans', 'Cassava'],
        cooperativeName: 'Sunyani Farmers Cooperative Union',
        cooperativeMembershipId: 'SFCU-2022-094',
        verificationStatus: 'verified',
        profileCompleteness: 92,
        dataSharingConsent: {
          shareWithBanks: true,
          shareWithSuppliers: true,
          shareWithFieldAgents: true,
          updatedAt: '2026-01-16T10:00:00Z',
        },
        totalLandAcres: 18.5,
        farmsCount: 2,
        updatedAt: '2026-02-01T12:00:00Z',
      },
    ],
    farms: [
      {
        id: 'farm_01',
        farmerId: 'usr_farmer_1',
        farmerName: 'Kwame Mensah',
        farmName: 'Asuofia Golden Acre',
        region: 'Bono Region',
        district: 'Sunyani Municipal',
        community: 'Fiapre North',
        centerCoordinates: { lat: 7.3486, lng: -2.3342 },
        boundaryPolygon: [
          { lat: 7.3512, lng: -2.3365 },
          { lat: 7.3524, lng: -2.3312 },
          { lat: 7.3468, lng: -2.3308 },
          { lat: 7.3455, lng: -2.3358 },
        ],
        reportedAreaAcres: 12.0,
        verifiedAreaAcres: 11.8,
        cropType: 'Yellow Maize (Obatanpa Variety)',
        secondaryCrops: ['Soybean'],
        plantingSeason: 'Major Season 2026',
        soilType: 'Loamy Ferric Acrisol',
        irrigationType: 'rainfed',
        verificationStatus: 'verified',
        verificationNotes: 'GPS perimeter verified by Field Agent Kofi Boateng. Soil test completed.',
        verifiedAt: '2026-01-20T14:30:00Z',
        verifiedBy: 'usr_agent_1',
        createdAt: '2026-01-16T09:15:00Z',
      },
      {
        id: 'farm_02',
        farmerId: 'usr_farmer_1',
        farmerName: 'Kwame Mensah',
        farmName: 'Tanoso Valley Plot',
        region: 'Bono Region',
        district: 'Sunyani West',
        community: 'Tanoso',
        centerCoordinates: { lat: 7.2842, lng: -2.2514 },
        boundaryPolygon: [
          { lat: 7.2865, lng: -2.2535 },
          { lat: 7.2872, lng: -2.2492 },
          { lat: 7.2821, lng: -2.2488 },
          { lat: 7.2818, lng: -2.2529 },
        ],
        reportedAreaAcres: 6.5,
        cropType: 'Cassava (Bankye Hemaa)',
        plantingSeason: 'Year-round 2026',
        soilType: 'Sandy Loam',
        irrigationType: 'drip',
        verificationStatus: 'pending_verification',
        verificationNotes: 'Awaiting field agent ground-truth survey scheduled for next Tuesday.',
        createdAt: '2026-02-05T11:20:00Z',
      },
    ],
    products: [
      {
        id: 'prod_fert_01',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Bio-Harvest NPK 15-15-15 Balanced Crop Fertilizer',
        category: 'fertilizers',
        description: 'Certified premium blended granulated fertilizer for maize, vegetables, and cereal crops. Improves root depth and grain filling.',
        priceGHS: 380,
        unit: '50kg Bag',
        stockQuantity: 420,
        specifications: {
          nitrogen: '15%',
          phosphate: '15%',
          potassium: '15%',
          origin: 'Tema Industrial Area, Ghana',
        },
        regulatoryApprovalNumber: 'MoFA-PPRSD-F2025-089',
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Kumasi Central Depot & Sunyani Hub',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.8,
        reviewCount: 38,
      },
      {
        id: 'prod_seed_01',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Certified High-Yield Hybrid White Maize Seed (CSIR-CRI)',
        category: 'seeds',
        description: 'Drought-tolerant, certified foundation seed variety tested for Ghanaian sub-humid agro-ecologies with 95%+ germination rate.',
        priceGHS: 145,
        unit: '10kg Bag',
        stockQuantity: 280,
        specifications: {
          germinationRate: '96%',
          maturityDays: '105-110 days',
          yieldPotential: '6.5 MT/Ha',
        },
        regulatoryApprovalNumber: 'MoFA-GSID-S2024-114',
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Sunyani Agricultural Hub',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.9,
        reviewCount: 52,
      },
      {
        id: 'prod_irrig_01',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Eco-Flow 16mm Agricultural Drip Irrigation Tubing Kit',
        category: 'irrigation',
        description: 'UV-resistant precision drip irrigation line with pre-spaced pressure-compensating emitters at 30cm spacing. Complete with connectors.',
        priceGHS: 520,
        unit: '200m Roll',
        stockQuantity: 95,
        specifications: {
          emitterSpacing: '30 cm',
          flowRate: '1.6 L/hr',
          uvResistance: '5 Years Rated',
        },
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Accra Depot & Kumasi',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.7,
        reviewCount: 19,
      },
      {
        id: 'prod_protect_01',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Bio-Defend Emamectin Benzoate 5% WDG (Fall Armyworm Control)',
        category: 'crop_protection',
        description: 'MoFA-PPRSD certified water dispersible granule insecticide targeting Fall Armyworm (Spodoptera frugiperda), stem borers, and foliage caterpillars in maize and cereals.',
        priceGHS: 65,
        unit: '100g Sachet',
        stockQuantity: 340,
        specifications: {
          activeIngredient: 'Emamectin Benzoate 50g/kg',
          targetPests: 'Fall Armyworm, Leaf Folders, Stem Borers',
          preHarvestInterval: '7 Days',
          dosage: '15g per 15L Knapsack Sprayer',
        },
        regulatoryApprovalNumber: 'MoFA-PPRSD-INS-2025-042',
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Sunyani Hub & Techiman Depot',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.9,
        reviewCount: 44,
      },
      {
        id: 'prod_protect_02',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Nordox 75 WG Super Micronized Copper Fungicide',
        category: 'crop_protection',
        description: 'PPRSD approved high-retention copper fungicide for Cocoa Black Pod disease (Phytophthora), Tomato Early/Late Blight, and anthracnose.',
        priceGHS: 110,
        unit: '500g Pack',
        stockQuantity: 180,
        specifications: {
          activeIngredient: 'Cuprous Oxide 86% (eq. 75% metallic copper)',
          targetDiseases: 'Black Pod, Early Blight, Late Blight, Anthracnose',
          dosage: '50g per 15L Knapsack Sprayer',
        },
        regulatoryApprovalNumber: 'MoFA-PPRSD-FUNG-2024-81',
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Kumasi Central Depot & Sunyani Hub',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.8,
        reviewCount: 29,
      },
      {
        id: 'prod_protect_03',
        supplierId: 'usr_supplier_1',
        supplierName: 'AfriAgro Inputs Ltd',
        supplierVerified: true,
        title: 'Organic NeemShield Botanical Bio-Insecticide Extract',
        category: 'crop_protection',
        description: 'Cold-pressed natural Azadirachtin extract. Organic broad-spectrum biological repellent and growth disrupter for aphids, whiteflies, thrips, and mites.',
        priceGHS: 85,
        unit: '1L Bottle',
        stockQuantity: 215,
        specifications: {
          activeIngredient: 'Azadirachtin 0.3% EC',
          organicCertified: 'Yes (Organic Ghana Certified)',
          targetPests: 'Whiteflies, Aphids, Thrips, Spider Mites',
          dosage: '50ml per 15L Water',
        },
        regulatoryApprovalNumber: 'MoFA-PPRSD-BIO-2025-015',
        isRegulatedApproved: true,
        deliveryAvailable: true,
        pickupAvailable: true,
        location: 'Sunyani Agricultural Hub',
        imageUrl: '/src/assets/images/agricultural_inputs_display_1791938388813.jpg',
        rating: 4.7,
        reviewCount: 16,
      },
    ],
    orders: [
      {
        id: 'ord_1001',
        farmerId: 'usr_farmer_1',
        farmerName: 'Kwame Mensah',
        items: [
          {
            productId: 'prod_fert_01',
            productName: 'Bio-Harvest NPK 15-15-15 Balanced Crop Fertilizer',
            unitPriceGHS: 380,
            quantity: 4,
            unit: '50kg Bag',
            subtotalGHS: 1520,
          },
          {
            productId: 'prod_seed_01',
            productName: 'Certified High-Yield Hybrid White Maize Seed',
            unitPriceGHS: 145,
            quantity: 2,
            unit: '10kg Bag',
            subtotalGHS: 290,
          },
        ],
        totalAmountGHS: 1810,
        paymentModel: 'direct_purchase',
        paymentStatus: 'completed',
        fulfilmentStatus: 'dispatched',
        deliveryAddress: 'Fiapre Agricultural Junction, Sunyani',
        deliveryMethod: 'delivery',
        trackingNumber: 'GH-AGRI-TRK-8821',
        createdAt: '2026-02-10T11:40:00Z',
      },
    ],
    financingProducts: [
      {
        id: 'fin_adb_input_01',
        institutionId: 'usr_bank_1',
        institutionName: 'Agricultural Development Bank (ADB)',
        institutionType: 'commercial_bank',
        title: 'ADB Smallholder Seasonal Crop Input Credit',
        financingPurpose: 'Financing for certified seed, approved fertilizer, and land preparation services for cereal and legume farmers.',
        minAmountGHS: 2000,
        maxAmountGHS: 25000,
        annualInterestRatePercent: 18.5,
        tenureMonthsMin: 4,
        tenureMonthsMax: 9,
        gracePeriodMonths: 3,
        eligibleCrops: ['Maize', 'Soybean', 'Rice', 'Sorghum'],
        requiredDocuments: ['Ghana Card', 'Verified Farm GPS Polygon', 'Cooperative Endorsement'],
        eligibilityCriteria: [
          'Minimum 1 season documented farming record',
          'Registered and GPS-verified farm parcel on AgriTrust AI',
          'Cooperative membership or verified credit history',
        ],
        processingFeePercent: 1.5,
        verificationRequired: true,
      },
      {
        id: 'fin_rural_equip_02',
        institutionId: 'usr_bank_1',
        institutionName: 'Agricultural Development Bank (ADB)',
        institutionType: 'commercial_bank',
        title: 'AgriMechanise Machinery & Tractor Rental Advance',
        financingPurpose: 'Direct line of credit to finance mechanized ploughing, harrowing, and harvesting equipment services.',
        minAmountGHS: 1500,
        maxAmountGHS: 15000,
        annualInterestRatePercent: 17.0,
        tenureMonthsMin: 3,
        tenureMonthsMax: 6,
        gracePeriodMonths: 2,
        eligibleCrops: ['All commercial grain and tuber crops'],
        requiredDocuments: ['Ghana Card', 'Farm Ownership / Tenancy Agreement'],
        eligibilityCriteria: [
          'Farm size of 3 acres or greater',
          'Booking through verified AgriTrust equipment providers',
        ],
        processingFeePercent: 1.0,
        verificationRequired: true,
      },
    ],
    loanApplications: [
      {
        id: 'loan_app_2026_01',
        farmerId: 'usr_farmer_1',
        farmerName: 'Kwame Mensah',
        farmerPhone: '+233 24 456 7890',
        farmerRegion: 'Bono Region',
        financingProductId: 'fin_adb_input_01',
        financingProductTitle: 'ADB Smallholder Seasonal Crop Input Credit',
        institutionId: 'usr_bank_1',
        institutionName: 'Agricultural Development Bank (ADB)',
        requestedAmountGHS: 6500,
        approvedAmountGHS: 6500,
        proposedTenureMonths: 6,
        associatedFarmId: 'farm_01',
        associatedFarmName: 'Asuofia Golden Acre',
        cropCycle: 'Major Season Maize 2026',
        intendedActivity: 'Purchase 12 bags of NPK fertilizer, hybrid seeds, and mechanised planting.',
        status: 'under_institutional_assessment',
        statusHistory: [
          {
            status: 'submitted',
            timestamp: '2026-02-12T08:30:00Z',
            note: 'Application submitted with verified farm GPS data.',
            updatedBy: 'usr_farmer_1',
          },
          {
            status: 'awaiting_review',
            timestamp: '2026-02-12T09:00:00Z',
            note: 'Application queued for loan officer review.',
            updatedBy: 'System',
          },
          {
            status: 'under_institutional_assessment',
            timestamp: '2026-02-13T14:15:00Z',
            note: 'Farm boundary and soil profile validated. Under final credit committee assessment.',
            updatedBy: 'usr_bank_1',
          },
        ],
        createdAt: '2026-02-12T08:30:00Z',
        updatedAt: '2026-02-13T14:15:00Z',
      },
    ],
    equipmentListings: [
      {
        id: 'eq_01',
        providerId: 'usr_equipment_1',
        providerName: 'Volta Mechanised Services',
        providerPhone: '+233 27 123 4567',
        providerVerified: true,
        title: 'John Deere 5075E 75HP Tractor with 4-Disc Heavy Plough',
        category: 'tractor',
        makeAndModel: 'John Deere 5075E 4WD',
        horsePower: 75,
        ratePerAcreGHS: 180,
        ratePerDayGHS: 1400,
        operatorIncluded: true,
        fuelIncluded: false,
        operationalRegion: 'Bono, Ahafo & Ashanti Regions',
        availableFrom: '2026-02-01',
        availableTo: '2026-11-30',
        imageUrl: '/src/assets/images/farm_tractor_equipment_1791938387801.jpg',
        status: 'available',
      },
      {
        id: 'eq_02',
        providerId: 'usr_equipment_1',
        providerName: 'Volta Mechanised Services',
        providerPhone: '+233 27 123 4567',
        providerVerified: true,
        title: 'Massey Ferguson 260 60HP Disc Harrow & Ridger',
        category: 'plough',
        makeAndModel: 'Massey Ferguson MF-260',
        horsePower: 60,
        ratePerAcreGHS: 140,
        ratePerDayGHS: 1100,
        operatorIncluded: true,
        fuelIncluded: false,
        operationalRegion: 'Bono Region (Sunyani, Berekum, Dormaa)',
        availableFrom: '2026-02-15',
        availableTo: '2026-12-15',
        imageUrl: '/src/assets/images/farm_tractor_equipment_1791938387801.jpg',
        status: 'available',
      },
    ],
    equipmentBookings: [
      {
        id: 'bk_901',
        equipmentId: 'eq_01',
        equipmentTitle: 'John Deere 5075E 75HP Tractor with 4-Disc Heavy Plough',
        farmerId: 'usr_farmer_1',
        farmerName: 'Kwame Mensah',
        farmerPhone: '+233 24 456 7890',
        providerId: 'usr_equipment_1',
        providerName: 'Volta Mechanised Services',
        farmId: 'farm_01',
        farmName: 'Asuofia Golden Acre',
        acresToService: 12,
        serviceStartDate: '2026-02-25',
        serviceEndDate: '2026-02-26',
        totalCostGHS: 2160,
        status: 'confirmed',
        providerNote: 'Operator Emmanuel will arrive with the John Deere tractor at 06:30 AM.',
        createdAt: '2026-02-14T10:00:00Z',
      },
    ],
    notifications: [
      {
        id: 'notif_01',
        userId: 'usr_farmer_1',
        title: 'Farm Verification Complete',
        message: 'Your farm "Asuofia Golden Acre" has been verified by Field Agent Kofi Boateng.',
        type: 'success',
        read: false,
        link: '/farms',
        createdAt: '2026-01-20T14:35:00Z',
      },
      {
        id: 'notif_02',
        userId: 'usr_farmer_1',
        title: 'Loan Review in Progress',
        message: 'Agricultural Development Bank (ADB) has commenced credit assessment for your Seasonal Crop Input Credit application.',
        type: 'info',
        read: false,
        link: '/financing',
        createdAt: '2026-02-13T14:20:00Z',
      },
      {
        id: 'notif_03',
        userId: 'usr_farmer_1',
        title: 'Equipment Booking Confirmed',
        message: 'Volta Mechanised Services confirmed your tractor booking for February 25, 2026.',
        type: 'success',
        read: true,
        link: '/equipment',
        createdAt: '2026-02-14T10:05:00Z',
      },
    ],
    auditLogs: [
      {
        id: 'log_01',
        actorId: 'usr_agent_1',
        actorName: 'Kofi Boateng',
        actorRole: 'field_agent',
        action: 'VERIFIED_FARM_POLYGON',
        resourceType: 'Farm',
        resourceId: 'farm_01',
        details: 'Verified boundary coordinates for Asuofia Golden Acre. Area confirmed at 11.8 acres.',
        timestamp: '2026-01-20T14:30:00Z',
      },
      {
        id: 'log_02',
        actorId: 'usr_farmer_1',
        actorName: 'Kwame Mensah',
        actorRole: 'farmer',
        action: 'SUBMITTED_LOAN_APPLICATION',
        resourceType: 'LoanApplication',
        resourceId: 'loan_app_2026_01',
        details: 'Submitted GHS 6,500 input credit application for Major Season Maize.',
        timestamp: '2026-02-12T08:30:00Z',
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const loaded: DatabaseSchema = JSON.parse(raw);
        // Ensure any new seed administrator accounts are present
        const initial = getInitialDatabase();
        let changed = false;
        for (const seedUser of initial.users) {
          if (!loaded.users.some((u) => u.email.toLowerCase() === seedUser.email.toLowerCase())) {
            loaded.users.push(seedUser);
            changed = true;
          }
        }
        if (changed) {
          this.saveData(loaded);
        }
        return loaded;
      }
    } catch (err) {
      console.warn('Could not load persistent database file, seeding default data.', err);
    }
    const initial = getInitialDatabase();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file', err);
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // --- Users & Auth ---
  findUserByEmail(email: string) {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'> & { passwordHash: string }) {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user = {
      ...userData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.persist();
    return user;
  }

  getAllUsers() {
    return this.data.users.map(({ passwordHash, ...safeUser }) => safeUser);
  }

  updateUserVerification(userId: string, isVerified: boolean) {
    const user = this.data.users.find((u) => u.id === userId);
    if (user) {
      user.isVerified = isVerified;
      this.persist();
    }
    return user;
  }

  // --- Farmer Profiles ---
  getFarmerProfile(userId: string) {
    return this.data.farmerProfiles.find((p) => p.userId === userId);
  }

  upsertFarmerProfile(profile: Partial<FarmerProfile> & { userId: string; fullName: string }) {
    const existingIndex = this.data.farmerProfiles.findIndex((p) => p.userId === profile.userId);
    const now = new Date().toISOString();
    if (existingIndex >= 0) {
      this.data.farmerProfiles[existingIndex] = {
        ...this.data.farmerProfiles[existingIndex],
        ...profile,
        updatedAt: now,
      };
      this.persist();
      return this.data.farmerProfiles[existingIndex];
    } else {
      const newProfile: FarmerProfile = {
        id: `prof_${Date.now()}`,
        userId: profile.userId,
        fullName: profile.fullName,
        phone: profile.phone || '',
        region: profile.region || 'Bono Region',
        district: profile.district || '',
        community: profile.community || '',
        farmingExperienceYears: profile.farmingExperienceYears || 1,
        primaryCrops: profile.primaryCrops || ['Maize'],
        cooperativeName: profile.cooperativeName,
        cooperativeMembershipId: profile.cooperativeMembershipId,
        verificationStatus: 'not_submitted',
        profileCompleteness: 60,
        dataSharingConsent: {
          shareWithBanks: true,
          shareWithSuppliers: true,
          shareWithFieldAgents: true,
          updatedAt: now,
        },
        totalLandAcres: profile.totalLandAcres || 0,
        farmsCount: 0,
        updatedAt: now,
      };
      this.data.farmerProfiles.push(newProfile);
      this.persist();
      return newProfile;
    }
  }

  // --- Farms ---
  getFarms(farmerId?: string) {
    if (farmerId) {
      return this.data.farms.filter((f) => f.farmerId === farmerId);
    }
    return this.data.farms;
  }

  getFarmById(farmId: string) {
    return this.data.farms.find((f) => f.id === farmId);
  }

  createFarm(farmData: Omit<Farm, 'id' | 'createdAt'>) {
    const id = `farm_${Date.now()}`;
    const farm: Farm = {
      ...farmData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.farms.push(farm);
    
    // Update farmer profile farm count & total acreage
    const profile = this.data.farmerProfiles.find((p) => p.userId === farm.farmerId);
    if (profile) {
      profile.farmsCount = this.data.farms.filter((f) => f.farmerId === farm.farmerId).length;
      profile.totalLandAcres += farm.reportedAreaAcres;
    }

    this.persist();
    return farm;
  }

  updateFarmVerification(
    farmId: string, 
    status: Farm['verificationStatus'], 
    notes: string, 
    verifiedBy: string,
    verifiedAreaAcres?: number
  ) {
    const farm = this.data.farms.find((f) => f.id === farmId);
    if (farm) {
      farm.verificationStatus = status;
      farm.verificationNotes = notes;
      farm.verifiedBy = verifiedBy;
      farm.verifiedAt = new Date().toISOString();
      if (verifiedAreaAcres !== undefined) {
        farm.verifiedAreaAcres = verifiedAreaAcres;
      }
      this.persist();
    }
    return farm;
  }

  // --- Products ---
  getProducts(category?: string, search?: string) {
    let list = this.data.products;
    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }

  getProductById(id: string) {
    return this.data.products.find((p) => p.id === id);
  }

  createProduct(productData: Omit<Product, 'id'>) {
    const id = `prod_${Date.now()}`;
    const product: Product = { ...productData, id };
    this.data.products.push(product);
    this.persist();
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.data.products[idx] = { ...this.data.products[idx], ...updates };
      this.persist();
      return this.data.products[idx];
    }
    return null;
  }

  deleteProduct(id: string) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const removed = this.data.products.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  // --- Orders ---
  getOrders(farmerId?: string, supplierId?: string) {
    let list = this.data.orders;
    if (farmerId) list = list.filter((o) => o.farmerId === farmerId);
    return list;
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>) {
    const id = `ord_${Date.now()}`;
    const order: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
    };
    this.data.orders.push(order);
    this.persist();
    return order;
  }

  updateOrderStatus(orderId: string, fulfilmentStatus: Order['fulfilmentStatus'], paymentStatus?: Order['paymentStatus']) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (order) {
      order.fulfilmentStatus = fulfilmentStatus;
      if (paymentStatus) order.paymentStatus = paymentStatus;
      this.persist();
    }
    return order;
  }

  // --- Financing Products & Loan Applications ---
  getFinancingProducts() {
    return this.data.financingProducts;
  }

  createFinancingProduct(data: Omit<FinancingProduct, 'id'>) {
    const id = `fin_${Date.now()}`;
    const product: FinancingProduct = { ...data, id };
    this.data.financingProducts.push(product);
    this.persist();
    return product;
  }

  updateFinancingProduct(id: string, updates: Partial<FinancingProduct>) {
    const idx = this.data.financingProducts.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.data.financingProducts[idx] = { ...this.data.financingProducts[idx], ...updates };
      this.persist();
      return this.data.financingProducts[idx];
    }
    return null;
  }

  deleteFinancingProduct(id: string) {
    const idx = this.data.financingProducts.findIndex((f) => f.id === id);
    if (idx !== -1) {
      const removed = this.data.financingProducts.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  getLoanApplications(farmerId?: string, institutionId?: string) {
    let list = this.data.loanApplications;
    if (farmerId) list = list.filter((a) => a.farmerId === farmerId);
    if (institutionId) list = list.filter((a) => a.institutionId === institutionId);
    return list;
  }

  getLoanApplicationById(id: string) {
    return this.data.loanApplications.find((a) => a.id === id);
  }

  createLoanApplication(appData: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'status'>) {
    const id = `loan_app_${Date.now()}`;
    const now = new Date().toISOString();
    const app: LoanApplication = {
      ...appData,
      id,
      status: 'submitted',
      statusHistory: [
        {
          status: 'submitted',
          timestamp: now,
          note: 'Application formally submitted for institutional review.',
          updatedBy: appData.farmerName,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.data.loanApplications.push(app);
    this.persist();
    return app;
  }

  updateLoanApplicationStatus(
    id: string, 
    status: LoanApplication['status'], 
    note: string, 
    updatedBy: string,
    approvedAmountGHS?: number
  ) {
    const app = this.data.loanApplications.find((a) => a.id === id);
    if (app) {
      app.status = status;
      app.updatedAt = new Date().toISOString();
      if (approvedAmountGHS !== undefined) {
        app.approvedAmountGHS = approvedAmountGHS;
      }
      app.statusHistory.push({
        status,
        timestamp: app.updatedAt,
        note,
        updatedBy,
      });
      this.persist();
    }
    return app;
  }

  // --- Equipment & Bookings ---
  getEquipmentListings(region?: string, category?: string) {
    let list = this.data.equipmentListings;
    if (category && category !== 'all') {
      list = list.filter((eq) => eq.category === category);
    }
    if (region && region !== 'all') {
      list = list.filter((eq) => eq.operationalRegion.toLowerCase().includes(region.toLowerCase()));
    }
    return list;
  }

  createEquipmentListing(eqData: Omit<EquipmentListing, 'id'>) {
    const id = `eq_${Date.now()}`;
    const listing: EquipmentListing = { ...eqData, id };
    this.data.equipmentListings.push(listing);
    this.persist();
    return listing;
  }

  updateEquipmentListing(id: string, updates: Partial<EquipmentListing>) {
    const idx = this.data.equipmentListings.findIndex((e) => e.id === id);
    if (idx !== -1) {
      this.data.equipmentListings[idx] = { ...this.data.equipmentListings[idx], ...updates };
      this.persist();
      return this.data.equipmentListings[idx];
    }
    return null;
  }

  deleteEquipmentListing(id: string) {
    const idx = this.data.equipmentListings.findIndex((e) => e.id === id);
    if (idx !== -1) {
      const removed = this.data.equipmentListings.splice(idx, 1)[0];
      this.persist();
      return removed;
    }
    return null;
  }

  getBookings(farmerId?: string, providerId?: string) {
    let list = this.data.equipmentBookings;
    if (farmerId) list = list.filter((b) => b.farmerId === farmerId);
    if (providerId) list = list.filter((b) => b.providerId === providerId);
    return list;
  }

  createEquipmentBooking(bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'status'>) {
    const id = `bk_${Date.now()}`;
    const booking: EquipmentBooking = {
      ...bookingData,
      id,
      status: 'pending_provider_confirmation',
      createdAt: new Date().toISOString(),
    };
    this.data.equipmentBookings.push(booking);
    this.persist();
    return booking;
  }

  updateBookingStatus(id: string, status: EquipmentBooking['status'], providerNote?: string) {
    const booking = this.data.equipmentBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      if (providerNote) booking.providerNote = providerNote;
      this.persist();
    }
    return booking;
  }

  // --- Notifications ---
  getNotifications(userId: string) {
    return this.data.notifications.filter((n) => n.userId === userId);
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    const item: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(item);
    this.persist();
    return item;
  }

  markNotificationAsRead(id: string) {
    const item = this.data.notifications.find((n) => n.id === id);
    if (item) {
      item.read = true;
      this.persist();
    }
    return item;
  }

  // --- Audit Logs ---
  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const entry: AuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(entry);
    this.persist();
    return entry;
  }

  getAuditLogs() {
    return this.data.auditLogs;
  }
}

export const db = new Database();
