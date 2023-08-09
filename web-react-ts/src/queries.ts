import { gql } from "@apollo/client";

export const GET_BRANDED_PRODUCTS = gql`
  query getAllBrandedProducts {
    brandedProducts {
      id
      name
    }
  }
`;

export const CREATE_PATIENTS = gql`
  mutation createPatients($input: [PatientCreateInput!]!) {
    createPatients(input: $input) {
      patients {
        id
        name
        age
        cancerStage
        treatments {
          id
          startDate
        }
        osInfos {
          id
          duration
        }
        pfsInfos {
          id
          duration
        }
      }
    }
  }
`;

export const GET_CONTRACTS = gql`
  query GetContracts($where: ContractWhere) {
    contracts(where: $where) {
      id
      enrolmentCriteria {
        maxAge
        cancerStages
      }
    }
  }
`;

export const GET_PATIENTS = gql`
  query getAllPatients {
    patients {
      id
      name
      age
      cancerStage
      treatments {
        id
        startDate
        brandedProducts {
          name
        }
      }
      osInfos {
        id
        duration
      }
      pfsInfos {
        id
        duration
      }
    }
  }
`;
