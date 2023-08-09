import { gql } from "@apollo/client";

export const CREATE_PATIENTS = gql`
  mutation createPatients($input: [PatientCreateInput!]!) {
    createPatients(input: $input) {
      patients {
        id
        name
        age
        cancerStage
        osInfo
        pfsInfo
      }
    }
  }
`;

export const CREATE_CONTRACTS = gql`
  mutation createContracts($input: [ContractCreateInput!]!) {
    createContracts(input: $input) {
      contracts {
        id
        duration
        parties {
          id
          name
        }
        enrolmentCriteria {
          id
          cancerStages
          maxAge
        }
        pricings {
          id
          OSAfter
          PFSAfter
          noOSBefore
          noPFSBefore
        }
      }
    }
  }
`;

export const MATCH_PATIENTS = gql`
  mutation matchPatitents(
    $where: ContractWhere
    $connect: ContractConnectInput
  ) {
    updateContracts(where: $where, connect: $connect) {
      contracts {
        id
        parties {
          id
        }
        enrolmentCriteria {
          maxAge
          cancerStages
        }
        patients {
          id
          age
          cancerStage
          name
        }
      }
    }
  }
`;
