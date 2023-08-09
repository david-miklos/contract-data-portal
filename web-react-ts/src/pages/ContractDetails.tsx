import { useParams } from "react-router-dom";

function ContractDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1> Details</h1>
      <p>{id}</p>
    </div>
  );
}

export default ContractDetails;
