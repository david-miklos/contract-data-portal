import { useParams } from "react-router-dom";
import { GET_CONTRACT } from "../queries";
import { APIContracts } from "../interfaces";
import { useQuery } from "@apollo/client";
import ContractDetailsPatient from "../components/ContractDetailsPatient";

function ContractDetails() {
  const { id } = useParams();
  const {
    loading: getContractLoading,
    error: getContractError,
    data: getContractData,
  } = useQuery<APIContracts>(GET_CONTRACT, {
    variables: {
      where: {
        id: id,
      },
    },
  });

  if (getContractLoading) return <p>Loading...</p>;
  if (getContractError) return <p>Error: {getContractError.message}</p>;
  if (!getContractData) return <p>Something went wrong</p>;

  const contract = getContractData.contracts[0];
  const pricing = contract.pricings[0];
  const patients = contract.patients;

  return (
    <div>
      <h1> Details</h1>
      <h2>{id}</h2>
      <h3>Enrolment criteria</h3>
      <div className="flex space-x-2">
        <div>Max Age:</div>
        <div>{contract.enrolmentCriteria[0].maxAge}</div>
      </div>
      <div className="flex space-x-2">
        <div>Stages:</div>
        <div className="flex space-x-2">
          {contract.enrolmentCriteria[0].cancerStages.map((value) => (
            <div key={value}>{value}</div>
          ))}
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <div className="mb-4">Patients:</div>
        <div className="flex space-x-20">
          {patients.map((patient) => (
            <div key={patient.id}>
              <ContractDetailsPatient
                name={patient.name}
                age={patient.age}
                cancerStage={patient.cancerStage}
                patientOSInfo={patient.osInfo}
                patientPFSInfo={patient.pfsInfo}
                startDate={patient.treatments[0].startDate.toLocaleString()}
                productName={patient.treatments[0].brandedProducts[0].name}
                medicinalProductName={
                  patient.treatments[0].brandedProducts[0].name
                }
                productOSInfo={patient.treatments[0].brandedProducts[0].osInfo}
                productPFSInfo={
                  patient.treatments[0].brandedProducts[0].pfsInfo
                }
                basePrice={
                  patient.treatments[0].brandedProducts[0].medicinalProducts[0]
                    .packSizes[0].basePrice
                }
                units={
                  patient.treatments[0].brandedProducts[0].medicinalProducts[0]
                    .packSizes[0].units
                }
                OSAfter={pricing.OSAfter}
                noOSBefore={pricing.noOSBefore}
                PFSAfter={pricing.PFSAfter}
                noPFSBefore={pricing.noPFSBefore}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContractDetails;
