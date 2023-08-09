export interface BrandedProduct {
  id: string;
  name: string;
  osInfo: number;
  pfsInfo: number;
}

export interface MedicinalProduct {
  id: string;
  name: string;
}

export interface PackSize {
  id: string;
  basePrice: number;
  units: number;
}

export interface APIBrandedProducts {
  brandedProducts: BrandedProduct[];
}

export interface APIMedicinalProducts {
  medicinalProducts: MedicinalProduct[];
}

export interface APIPackSizes {
  packSizes: PackSize[];
}

export interface OS_Info {
  duration: number;
  id: string;
}

export interface PFS_Info {
  duration: number;
  id: string;
}

export interface Treatment {
  id: string;
  startDate: Date;
}

export interface EnrolmentCriteria {
  cancerStages: number[];
  id: string;
  maxAge: number;
}

export interface Party {
  id: string;
  name: string;
}

export interface Pricing {
  id: string;
  OSAfter: number;
  PFSAfter: number;
  noOSBefore: number;
  noPFSBefore: number;
}

export interface Contract {
  duration: number;
  enrolmentCriteria: EnrolmentCriteria[];
  id: string;
  parties: Party[];
  pricings: Pricing[];
}

export interface APIContracts {
  contracts: Contract[];
}

export interface CreateContractResult {
  createContracts: {
    contracts: Contract[];
  };
}

export interface Patient {
  age: number;
  cancerStage: number;
  osInfo: number;
  pfsInfo: number;
  id: string;
  name: string;
  treatments: Treatment[];
}

export interface APIPatients {
  patients: Patient[];
}
