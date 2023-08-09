import { ChangeEvent, FormEvent, useState } from "react";
import {
  APIBrandedProducts,
  APIContracts,
  APIMedicinalProducts,
  APIPackSizes,
  CreateContractResult,
} from "../interfaces";
import {
  GET_BRANDED_PRODUCTS,
  GET_CONTRACTS,
  GET_MEDICINAL_PRODUCTS,
  GET_PACK_SIZES,
} from "../queries";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { Link, useLocation } from "react-router-dom";
import { CREATE_CONTRACTS, MATCH_PATIENTS } from "../mutations";

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

  const [
    createContract,
    { loading: createContractLoading },
  ] = useMutation<CreateContractResult>(CREATE_CONTRACTS, {
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
      <div className="flex flex-col space-y-6">
        <div className=" border rounded p-10 shadow-sm bg-slate-100">
          <form className="w-1/3 mx-auto flex flex-col" onSubmit={handleSubmit}>
            <div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="party1"
                >
                  Party1:
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="party1"
                  name="party1"
                  value={party1}
                  onChange={handleParty1InputChange}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="party2"
                >
                  Party2:
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="party2"
                  name="party2"
                  value={party2}
                  onChange={handleParty2InputChange}
                />
              </div>
            </div>
            <div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="selectedProductID"
                >
                  Product:
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
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
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="selectedProductID"
                  >
                    Medical Product:
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
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
                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="selectedProductID"
                  >
                    Pack sizes:
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
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
                  <div className="flex justify-center items-center mt-3">
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
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="duration"
                >
                  Duration (months):
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
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
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="maxAge"
                >
                  Max age:
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="number"
                  min={1}
                  id="maxAge"
                  name="maxAge"
                  value={maxAge === null ? "" : maxAge}
                  onChange={handleMaxAgeInputChange}
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  From:
                  <input
                    type="number"
                    min={0}
                    id="start"
                    name="start"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={start}
                    onChange={handleStartChange}
                  />
                </label>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  To:
                  <input
                    type="number"
                    min={start + 1}
                    id="end"
                    name="end"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    value={end}
                    onChange={handleEndChange}
                  />
                </label>
              </div>
            </div>
            <div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="osAfter"
                >
                  OS After{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="osAfter"
                  name="osAfter"
                  value={osAfter}
                  onChange={handleOsAfterInputChange}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="noOsBefore"
                >
                  No OS Before{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="noOsBefore"
                  name="noOsBefore"
                  value={noOsBefore}
                  onChange={handleNoOsBeforeInputChange}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="pfsAfter"
                >
                  PFS After{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="pfsAfter"
                  name="pfsAfter"
                  value={pfsAfter}
                  onChange={handlePfsAfterInputChange}
                />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  htmlFor="noPfsBefore"
                >
                  No PFS Before{" "}
                  {
                    brandedProducts.find(
                      (product) => product.id === selectedProductID
                    )?.osInfo
                  }{" "}
                  (months):
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  type="text"
                  id="noPfsBefore"
                  name="noPfsBefore"
                  value={noPfsBefore}
                  onChange={handleNoPfsBeforeInputChange}
                />
              </div>
            </div>

            <button
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-6"
              type="submit"
              disabled={false}
            >
              {createContractLoading ? "Creating..." : "Create Contract"}
            </button>
          </form>
        </div>
        <div className="flex space-x-6 items-center justify-center">
          {contracts.map((contract) => (
            <div key={contract.id} className="border rounded-lg shadow-sm p-6">
              <div className="flex space-x-2">
                <div className="font-semibold">ID:</div>
                <div>{contract.id}</div>
              </div>
              <div className="flex space-x-2">
                <div className="font-semibold">Party1:</div>
                <div>{contract.parties[0].name}</div>
              </div>
              <div className="flex space-x-2">
                <div className="font-semibold">Party2: </div>
                <div>{contract.parties[1].name}</div>
              </div>
              <Link
                to={`${location.pathname}/details/${contract.id}`}
                className="font-medium text-slate-400 underline hover:no-underline mt-1 flex justify-end"
              >
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
