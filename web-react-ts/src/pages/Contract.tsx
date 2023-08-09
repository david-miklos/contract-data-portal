import { ChangeEvent, FormEvent, useState } from "react";
import {
  APIBrandedProducts,
  APIContracts,
  APIMedicinalProducts,
  APIPackSizes,
  CreateContractResult,
} from "../interfaces";
import {
  CREATE_CONTRACTS,
  GET_BRANDED_PRODUCTS,
  GET_CONTRACTS,
  GET_MEDICINAL_PRODUCTS,
  GET_PACK_SIZES,
  MATCH_PATIENTS,
} from "../queries";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { Link, useLocation } from "react-router-dom";

function Contract() {
  const {
    loading: getBrandedProductsLoading,
    error: getBrandedProductsError,
    data: getBrandedProductsData,
  } = useQuery<APIBrandedProducts>(GET_BRANDED_PRODUCTS);

  const {
    loading: getContractsLoading,
    error: getContractsError,
    data: getContractsData,
    refetch: refetchContracts,
  } = useQuery<APIContracts>(GET_CONTRACTS);

  const [
    getMedicinalProducts,
    { data: getMedicinalProductsData },
  ] = useLazyQuery<APIMedicinalProducts>(GET_MEDICINAL_PRODUCTS);

  const [getPackSizes, { data: getPackSizesData }] = useLazyQuery<APIPackSizes>(
    GET_PACK_SIZES
  );

  const [createContract] = useMutation<CreateContractResult>(CREATE_CONTRACTS, {
    onCompleted: () => {
      // Refetch contracts query
      refetchContracts();
    },
  });

  const [matchPatients] = useMutation(MATCH_PATIENTS, {
    onCompleted: () => {
      console.log("Patients were matched");
    },
  });

  const location = useLocation();

  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [cancerStages, setCancerStages] = useState<number[]>([]);

  const [party1, setParty1] = useState("");
  const [party2, setParty2] = useState("");
  const [duration, setDuration] = useState<number | null>(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  const [osAfter, setOsAfter] = useState<string>("");
  const [noOsBefore, setNoOsBefore] = useState<string>("");
  const [pfsAfter, setPfsAfter] = useState<string>("");
  const [noPfsBefore, setNoPfsBefore] = useState<string>("");

  const [selectedProductID, setSelectedProductID] = useState("");
  const [selectedMedicinalProductID, setSelectedMedicinalProductID] = useState(
    ""
  );
  const [selectedPackSizeID, setSelectedPackSizeID] = useState("");

  if (getBrandedProductsLoading) return <p>Loading...</p>;
  if (getBrandedProductsError)
    return <p>Error: {getBrandedProductsError.message}</p>;
  if (!getBrandedProductsData) return <p>Something went wrong</p>;

  const brandedProducts = getBrandedProductsData.brandedProducts;
  const medicinalProducts = getMedicinalProductsData?.medicinalProducts;
  const packSizes = getPackSizesData?.packSizes;

  if (getContractsLoading) return <p>Loading...</p>;
  if (getContractsError) return <p>Error: {getContractsError.message}</p>;
  if (!getContractsData) return <p>Something went wrong</p>;

  const contracts = getContractsData.contracts;

  const handleParty1InputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedParty1 = event.target.value;
    setParty1(selectedParty1);
  };

  const handleParty2InputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedParty2 = event.target.value;
    setParty2(selectedParty2);
  };

  const handleMaxAgeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedMaxAge = parseInt(event.target.value);
    setMaxAge(selectedMaxAge);
  };

  const handleDurationInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedDuration = parseInt(event.target.value);
    setDuration(selectedDuration);
  };

  const handlePackSizeSelectChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPackSizeID = event.target.value;
    setSelectedPackSizeID(selectedPackSizeID);
  };

  const handleOsAfterInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOsAfterPercentage = event.target.value;
    setOsAfter(selectedOsAfterPercentage);
  };
  const handleNoOsBeforeInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedNoOsBeforePercentage = event.target.value;
    setNoOsBefore(selectedNoOsBeforePercentage);
  };
  const handlePfsAfterInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedPfsAfterPercentage = event.target.value;
    setPfsAfter(selectedPfsAfterPercentage);
  };
  const handleNoPfsBeforeInputChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedNoPfsBeforePercentage = event.target.value;
    setNoPfsBefore(selectedNoPfsBeforePercentage);
  };

  const handleStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setStart(newValue);
    generateCancerStagesArray(newValue, end);
  };

  const handleEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setEnd(newValue);
    generateCancerStagesArray(start, newValue);
  };

  const generateCancerStagesArray = (start: number, end: number) => {
    const newStages = Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
    setCancerStages(newStages);
  };

  const handleProductSelectChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProductID = event.target.value;
    setSelectedProductID(selectedProductID);
    try {
      const result = await getMedicinalProducts({
        variables: {
          where: {
            brandedProducts: {
              id: selectedProductID,
            },
          },
          options: {
            sort: {
              id: "ASC",
            },
          },
        },
      });
      console.log("MedicalProducts returned:", result.data);
    } catch (error) {
      console.error("Error getting MedicalProduct:", error);
    }
  };

  const handleMedicinalProductSelectChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedMedicinalProductID = event.target.value;
    setSelectedMedicinalProductID(selectedMedicinalProductID);
    try {
      const result = await getPackSizes({
        variables: {
          where: {
            medicinalProducts: {
              id: selectedMedicinalProductID,
            },
          },
          options: {
            sort: {
              id: "ASC",
            },
          },
        },
      });
      console.log("MedicalProducts returned:", result.data);
    } catch (error) {
      console.error("Error getting MedicalProduct:", error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      party1 &&
      party2 &&
      selectedProductID &&
      selectedMedicinalProductID &&
      selectedPackSizeID &&
      duration !== null &&
      maxAge !== null &&
      start !== null &&
      end !== null &&
      osAfter &&
      noOsBefore &&
      pfsAfter &&
      noPfsBefore
    ) {
      try {
        const createContractResult = await createContract({
          variables: {
            input: {
              id: uuidv4(),
              duration: duration,
              parties: {
                create: [
                  {
                    id: uuidv4(),
                    name: party1,
                  },
                  {
                    id: uuidv4(),
                    name: party2,
                  },
                ],
              },
              enrolmentCriteria: {
                create: {
                  id: uuidv4(),
                  maxAge: maxAge,
                  cancerStages: cancerStages,
                },
              },
              pricings: {
                create: {
                  OSAfter: parseFloat(osAfter),
                  PFSAfter: parseFloat(pfsAfter),
                  id: uuidv4(),
                  noOSBefore: parseFloat(noOsBefore),
                  noPFSBefore: parseFloat(noPfsBefore),
                },
              },
            },
          },
        });

        console.log("Contract has been created:", createContractResult.data);
        // Reset the form fields after successful submission
        setParty1("");
        setParty2("");
        setSelectedProductID("");
        setSelectedMedicinalProductID("");
        setSelectedPackSizeID("");
        setDuration(null);
        setMaxAge(null);
        setStart(0);
        setEnd(0);
        setCancerStages([]);
        setOsAfter("");
        setNoOsBefore("");
        setPfsAfter("");
        setNoPfsBefore("");

        try {
          const matchPatientsResults = await matchPatients({
            variables: {
              where: {
                id: createContractResult.data?.createContracts.contracts[0].id,
              },
              connect: {
                patients: {
                  where: {
                    age_LT:
                      createContractResult.data?.createContracts.contracts[0]
                        .enrolmentCriteria[0].maxAge,
                    cancerStage_IN:
                      createContractResult.data?.createContracts.contracts[0]
                        .enrolmentCriteria[0].cancerStages,
                  },
                },
              },
            },
          });
          console.log("Patients have been matched:", matchPatientsResults.data);
        } catch (error) {
          console.error("Error matching patients:", error);
        }
      } catch (error) {
        console.error("Error creating contract:", error);
      }
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };

  return (
    <>
      <div>
        <div>
          <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
            <div>
              <p>Parties</p>
              <div className="flex space-x-4">
                <label htmlFor="party1">Party1:</label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="party1"
                  name="party1"
                  value={party1}
                  onChange={handleParty1InputChange}
                />
              </div>
              <div className="flex space-x-4">
                <label htmlFor="party2">Party2:</label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="party2"
                  name="party2"
                  value={party2}
                  onChange={handleParty2InputChange}
                />
              </div>
            </div>
            <div>
              <p>Product</p>
              <div className="flex space-x-4">
                <label htmlFor="selectedProductID">Product:</label>
                <select
                  className="border border-slate-700 rounded-mg"
                  id="selectedProductID"
                  name="selectedProductID"
                  value={selectedProductID}
                  onChange={handleProductSelectChange}
                >
                  <option value="">Select a product</option>
                  {brandedProducts.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProductID && medicinalProducts && (
                <div className="flex space-x-4">
                  <label htmlFor="selectedProductID">Medical Product:</label>
                  <select
                    className="border border-slate-700 rounded-mg"
                    id="selectedMedicalProductID"
                    name="selectedMedicalProductID"
                    value={selectedMedicinalProductID}
                    onChange={handleMedicinalProductSelectChange}
                  >
                    <option value="">Select a medical product</option>
                    {medicinalProducts.map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {selectedMedicinalProductID && packSizes && (
                <div className="flex space-x-4">
                  <label htmlFor="selectedProductID">Pack sizes:</label>
                  <select
                    className="border border-slate-700 rounded-mg"
                    id="selectedPackSizeID"
                    name="selectedPackSizeID"
                    value={selectedPackSizeID}
                    onChange={handlePackSizeSelectChange}
                  >
                    <option value="">Select pack size:</option>
                    {packSizes.map(({ id, units }) => (
                      <option className="flex space-x-3" key={id} value={id}>
                        {units}
                      </option>
                    ))}
                  </select>
                  <div>
                    CHF
                    {
                      packSizes.find(
                        (packSize) => packSize.id === selectedPackSizeID
                      )?.basePrice
                    }
                  </div>
                </div>
              )}
            </div>
            <div>
              <p>Duration</p>
              <div className="flex space-x-4">
                <label htmlFor="duration">Duration (months):</label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="number"
                  min={1}
                  id="duration"
                  name="duration"
                  value={duration === null ? "" : duration}
                  onChange={handleDurationInputChange}
                />
              </div>
            </div>
            <div>
              <p>Enrolment criteria</p>
              <div className="flex space-x-4">
                <label htmlFor="maxAge">Max age:</label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="number"
                  min={1}
                  id="maxAge"
                  name="maxAge"
                  value={maxAge === null ? "" : maxAge}
                  onChange={handleMaxAgeInputChange}
                />
              </div>
              <div className="flex space-x-4">
                <label>
                  From:
                  <input
                    type="number"
                    min={0}
                    id="start"
                    name="start"
                    value={start}
                    onChange={handleStartChange}
                  />
                </label>
                <label>
                  To:
                  <input
                    type="number"
                    min={start + 1}
                    id="end"
                    name="end"
                    value={end}
                    onChange={handleEndChange}
                  />
                </label>
              </div>
            </div>
            <div>
              <p>Pricing</p>
              <div className="flex space-x-4">
                <label htmlFor="osAfter">
                  OS After{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="osAfter"
                  name="osAfter"
                  value={osAfter}
                  onChange={handleOsAfterInputChange}
                />
              </div>
              <div className="flex space-x-4">
                <label htmlFor="noOsBefore">
                  No OS Before{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="noOsBefore"
                  name="noOsBefore"
                  value={noOsBefore}
                  onChange={handleNoOsBeforeInputChange}
                />
              </div>
              <div className="flex space-x-4">
                <label htmlFor="pfsAfter">
                  PFS After{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="pfsAfter"
                  name="pfsAfter"
                  value={pfsAfter}
                  onChange={handlePfsAfterInputChange}
                />
              </div>
              <div className="flex space-x-4">
                <label htmlFor="noPfsBefore">
                  No PFS Before{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="border border-slate-700 rounded-mg"
                  type="text"
                  id="noPfsBefore"
                  name="noPfsBefore"
                  value={noPfsBefore}
                  onChange={handleNoPfsBeforeInputChange}
                />
              </div>
            </div>

            <button
              className="bg-slate-700 text-slate-100"
              type="submit"
              disabled={false}
            >
              Create contract
            </button>
            {/* {createPatientError && <p>Error: {createPatientError.message}</p>} */}
          </form>
        </div>
        <div className="flex space-x-6">
          {contracts.map((contract) => (
            <div key={contract.id}>
              <div>{contract.id}</div>
              <div>{contract.parties[0].name}</div>
              <div>{contract.parties[1].name}</div>

              <Link to={`${location.pathname}/details/${contract.id}`}>
                Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Contract;
