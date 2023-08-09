import { ChangeEvent, FormEvent, useState } from "react";
import {
  CREATE_PATIENTS,
  GET_BRANDED_PRODUCTS,
  GET_PATIENTS,
} from "../queries";
import { APIBrandedProducts, APIPatients } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";

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
      <div>
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <label htmlFor="name">Patient Name:</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="age">Age:</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="number"
              min={1}
              id="age"
              name="age"
              value={formData.age === null ? "" : formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="cancerStage">Cancer Stage:</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="number"
              min={0}
              id="cancerStage"
              name="cancerStage"
              value={formData.cancerStage === null ? "" : formData.cancerStage}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="osInfo">OS Info (months):</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="number"
              min={1}
              id="osInfo"
              name="osInfo"
              value={formData.osInfo === null ? "" : formData.osInfo}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="pfsInfo">PFS Info (months):</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="number"
              min={1}
              id="pfsInfo"
              name="pfsInfo"
              value={formData.pfsInfo === null ? "" : formData.pfsInfo}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex space-x-4">
            <label htmlFor="selectedProductID">Product:</label>
            <select
              className="border border-slate-700 rounded-mg"
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
          <div className="flex space-x-4">
            <label htmlFor="startDate">Starting Date:</label>
            <input
              className="border border-slate-700 rounded-mg"
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <button
            className="bg-slate-700 text-slate-100"
            type="submit"
            disabled={createPatientLoading}
          >
            {createPatientLoading ? "Creating..." : "Create Patient"}
          </button>
          {createPatientError && <p>Error: {createPatientError.message}</p>}
        </form>
      </div>
      <div className="flex space-x-6">
        {patients.map((patient) => (
          <div key={patient.id}>
            <div className="flex space-x-2">
              <div>ID:</div>
              <div>{patient.id}</div>
            </div>
            <div className="flex space-x-2">
              <div>Name:</div>
              <div>{patient.name}</div>
            </div>
            <div className="flex space-x-2">
              <div>Age:</div>
              <div>{patient.age}</div>
            </div>
            <div className="flex space-x-2">
              <div>Cancer Stage:</div>
              <div>{patient.cancerStage}</div>
            </div>
            <div className="flex space-x-2">
              <div>OS Info:</div>
              <div>{patient.osInfo}</div>
            </div>
            <div className="flex space-x-2">
              <div>PFS Info:</div>
              <div>{patient.pfsInfo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PatientForm;
