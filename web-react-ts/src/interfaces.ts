export interface BrandedProduct {
  id: string;
  name: string;
}

export interface APIBrandedProducts {
  brandedProducts: BrandedProduct[];
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

export interface Patient {
  age: number;
  cancerStage: number;
  osInfos: OS_Info[];
  pfsInfos: PFS_Info[];
  id: string;
  name: string;
  stage: number;
  treatments: Treatment[];
}

export interface APIPatients {
  patients: Patient[];
}
