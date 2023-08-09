import { ChangeEvent, FormEvent, useState } from "react";
import { GET_BRANDED_PRODUCTS, GET_PATIENTS } from "../queries";
import { APIBrandedProducts, APIPatients } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_PATIENTS } from "../mutations";

function PatientForm() {
  const {
    loading: getBrandedProductsLoading,
    error: getBrandedProductsError,
    data: getBrandedProductsData,
  } = useQuery<APIBrandedProducts>(GET_BRANDED_PRODUCTS);

  const {
    loading: getPatientsLoading,
    error: getPatientsError,
    data: getPatientsData,
    refetch: refetchPatients,
  } = useQuery<APIPatients>(GET_PATIENTS);

  const [
    createPatient,
    { loading: createPatientLoading, error: createPatientError },
  ] = useMutation(CREATE_PATIENTS, {
    onCompleted: () => {
      // Refetch patient data query
      refetchPatients();
    },
  });

  const [formData, setFormData] = useState({
    name: "",
    age: null,
    cancerStage: null,
    osInfo: null,
    pfsInfo: null,
    selectedProductID: "",
    startDate: "",
  });

  if (getPatientsLoading) return <p>Loading...</p>;
  if (getPatientsError) return <p>Error: {getPatientsError.message}</p>;
  if (!getPatientsData) return <p>Something went wrong</p>;

  if (getBrandedProductsLoading) return <p>Loading...</p>;
  if (getBrandedProductsError)
    return <p>Error: {getBrandedProductsError.message}</p>;
  if (!getBrandedProductsData) return <p>Something went wrong</p>;

  const brandedProducts = getBrandedProductsData.brandedProducts;

  const patients = getPatientsData.patients;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(formData);

    if (
      formData.name &&
      formData.age !== null &&
      formData.cancerStage !== null &&
      formData.osInfo !== null &&
      formData.pfsInfo !== null &&
      formData.startDate
    ) {
      try {
        const result = await createPatient({
          variables: {
            input: {
              id: uuidv4(),
              age: parseInt(formData.age),
              cancerStage: 0,
              name: formData.name,
              osInfo: parseInt(formData.osInfo),
              pfsInfo: parseInt(formData.pfsInfo),
              treatments: {
                create: {
                  id: uuidv4(),
                  startDate: formData.startDate,
                  brandedProducts: {
                    connect: { where: { id: formData.selectedProductID } },
                  },
                },
              },
            },
          },
        });

        console.log("Patient has been created:", result.data);

        // Reset the form fields after successful submission
        setFormData({
          name: "",
          age: null,
          cancerStage: null,
          osInfo: null,
          pfsInfo: null,
          selectedProductID: "",
          startDate: "",
        });
      } catch (error) {
        console.error("Error creating patient:", error);
      }
    } else {
      alert("Please fill in all fields before submitting.");
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className=" border rounded p-10 shadow-sm bg-slate-100">
        <form className="w-1/3 mx-auto flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Patient Name:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="age"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Age:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="number"
              min={1}
              id="age"
              name="age"
              value={formData.age === null ? "" : formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="cancerStage"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cancer Stage:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="number"
              min={0}
              id="cancerStage"
              name="cancerStage"
              value={formData.cancerStage === null ? "" : formData.cancerStage}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="osInfo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              OS Info (months):
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="number"
              min={1}
              id="osInfo"
              name="osInfo"
              value={formData.osInfo === null ? "" : formData.osInfo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="pfsInfo"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              PFS Info (months):
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="number"
              min={1}
              id="pfsInfo"
              name="pfsInfo"
              value={formData.pfsInfo === null ? "" : formData.pfsInfo}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label
              htmlFor="selectedProductID"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Product:
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
              id="selectedProductID"
              name="selectedProductID"
              value={formData.selectedProductID}
              onChange={handleSelectChange}
            >
              <option value="">Select a product</option>
              {brandedProducts.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="startDate"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Starting Date:
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mt-6"
            type="submit"
            disabled={createPatientLoading}
          >
            {createPatientLoading ? "Creating..." : "Create Patient"}
          </button>
          {createPatientError && <p>Error: {createPatientError.message}</p>}
        </form>
      </div>
      <div className="flex space-x-6 items-center justify-center">
        {patients.map((patient) => (
          <div key={patient.id} className="border rounded-lg shadow-sm p-6">
            <div className="flex space-x-2">
              <div className="font-semibold">ID:</div>
              <div>{patient.id}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Name:</div>
              <div>{patient.name}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Age:</div>
              <div>{patient.age}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">Cancer Stage:</div>
              <div>{patient.cancerStage}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">OS Info:</div>
              <div>{patient.osInfo}</div>
            </div>
            <div className="flex space-x-2">
              <div className="font-semibold">PFS Info:</div>
              <div>{patient.pfsInfo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientForm;
