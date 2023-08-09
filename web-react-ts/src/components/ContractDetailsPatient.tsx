interface Props {
  name: string;
  age: number;
  cancerStage: number;
  patientOSInfo: number;
  patientPFSInfo: number;
  startDate: string;
  productName: string;
  productOSInfo: number;
  productPFSInfo: number;
  medicinalProductName: string;
  basePrice: number;
  units: number;
  OSAfter: number;
  noOSBefore: number;
  PFSAfter: number;
  noPFSBefore: number;
}

function ContractDetailsPatient({
  name,
  age,
  cancerStage,
  patientOSInfo,
  patientPFSInfo,
  startDate,
  productName,
  productOSInfo,
  productPFSInfo,
  medicinalProductName,
  basePrice,
  units,
  OSAfter,
  noOSBefore,
  PFSAfter,
  noPFSBefore,
}: Props) {
  // Event prioritization
  let payablePercentage;

  if (patientPFSInfo < productPFSInfo) {
    // Progression occurred before 9 months, consider only OS options
    payablePercentage = patientOSInfo >= productOSInfo ? OSAfter : noOSBefore;
  } else if (patientOSInfo >= productOSInfo) {
    // OS occurred after 12  months
    payablePercentage = OSAfter;
  } else if (patientPFSInfo >= productPFSInfo) {
    // PFS occurred after productPFSInfo months
    payablePercentage = PFSAfter;
  } else {
    // Neither OS nor PFS occurred within their respective timeframes
    payablePercentage = noPFSBefore;
  }

  // Calculate payable amount
  const payableAmount = basePrice * payablePercentage;

  // Calculate refundable amount
  const refundableAmount = basePrice - payableAmount;

  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2">
          <div>Name:</div>
          <div>{name}</div>
        </div>
        <div className="flex space-x-2">
          <div>Age:</div>
          <div>{age}</div>
        </div>
        <div className="flex space-x-2">
          <div>Cancer stage:</div>
          <div>{cancerStage}</div>
        </div>
        <div className="flex space-x-2">
          <div>OS Info:</div>
          <div>{patientOSInfo}</div>
        </div>
        <div className="flex space-x-2">
          <div>PFS Info:</div>
          <div>{patientPFSInfo}</div>
        </div>
        <div className="flex space-x-2">
          <div>Start Date:</div>
          <div>{startDate.toLocaleString()}</div>
        </div>
        <div className="flex space-x-2">
          <div>Product name:</div>
          <div>{productName}</div>
        </div>
        <div className="flex space-x-2">
          <div>Product OS Info:</div>
          <div>{productOSInfo}</div>
        </div>
        <div className="flex space-x-2">
          <div>Product PFS Info:</div>
          <div>{productPFSInfo}</div>
        </div>
        <div className="flex space-x-2">
          <div>Medicinal product:</div>
          <div>{medicinalProductName}</div>
        </div>
        <div className="flex space-x-2">
          <div>Medicinal product units:</div>
          <div>{units}</div>
        </div>
        <div className="flex space-x-2">
          <div>Medicinal product base price: </div>
          <div>
            CHF
            {basePrice}
          </div>
        </div>
        <div className="flex space-x-2">
          <div>Payable amount: </div>
          <div>
            CHF
            {payableAmount}
          </div>
        </div>
        <div className="flex space-x-2">
          <div>Refundable amount: </div>
          <div>
            CHF
            {refundableAmount}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContractDetailsPatient;
