import { gql } from "@apollo/client";

export const GET_BRANDED_PRODUCTS = gql`
  query getAllBrandedProducts {
    brandedProducts {
      id
      name
      osInfo
      pfsInfo
    }
  }
`;

export const GET_CONTRACT = gql`
  query GetContract($where: ContractWhere) {
    contracts(where: $where) {
      id
      duration
      enrolmentCriteria {
        cancerStages
        id
        maxAge
      }
      parties {
        id
        name
      }
      pricings {
        OSAfter
        PFSAfter
        id
        noOSBefore
        noPFSBefore
      }
      patients {
        id
        name
        age
        cancerStage
        osInfo
        pfsInfo
        treatments {
          id
          startDate
          brandedProducts {
            id
            name
            osInfo
            pfsInfo
            medicinalProducts {
              id
              name
              packSizes {
                id
                basePrice
                units
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CONTRACTS = gql`
  query GetContracts {
    contracts {
      id
      parties {
        id
        name
      }
    }
  }
`;

export const GET_PATIENTS = gql`
  query GetAllPatients {
    patients {
      id
      name
      age
      cancerStage
      osInfo
      pfsInfo
    }
  }
`;

export const GET_PATIENT = gql`
  query GetPatient($where: PatientWhere) {
    patient(where: $where) {
      id
      name
      age
      cancerStage
      osInfo
      pfsInfo
      treatments {
        id
        startDate
        brandedProducts {
          id
          name
          osInfo
          pfsInfo
          medicinalProducts {
            id
            name
            packSizes {
              id
              basePrice
              units
            }
          }
        }
      }
    }
  }
`;

export const GET_MEDICINAL_PRODUCTS = gql`
  query GetMedicinalProducts(
    $where: MedicinalProductWhere
    $options: MedicinalProductOptions
  ) {
    medicinalProducts(where: $where, options: $options) {
      id
      name
    }
  }
`;

export const GET_PACK_SIZES = gql`
  query GetPackSizes($where: PackSizeWhere, $options: PackSizeOptions) {
    packSizes(where: $where, options: $options) {
      id
      units
      basePrice
    }
  }
`;
