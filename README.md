# Contract management application

## Data model

![image](https://github.com/david-miklos/contract-data-portal/assets/48122593/c4e9c672-a479-4885-9af7-522eda417bde)

## Patient page

![image](https://github.com/david-miklos/contract-data-portal/assets/48122593/3a71ca98-f528-4fd2-bcc6-f645e3ac00c7)

## Contract page

![image](https://github.com/david-miklos/contract-data-portal/assets/48122593/276bb93c-1991-47fc-842b-cf7aa6e7a837)

## Contract details page

![image](https://github.com/david-miklos/contract-data-portal/assets/48122593/675d6694-858d-4880-bce8-c0597c7bd2bb)

## Contract part features:

- There is a screen to create a contract.
- The contract is created if all data is entered and there is a list of contracts visible.
- If a patient fulfills the enrollment criteria, they are considered matched to a contract.
- There is a contract status page with amount payable per month.
- Base prices and percentages could be manually input – numbers below are simply the default values.

## Data collection part features:

- Simple form to create a patient with all needed information.
- Possibility to enter treatment information for patient (treatment start and product)
- Possibility to enter patient OS and PFS information.
- List of all patients and entered information per patient.

## A contract has following logical features:

- **Contract parties:** A contract has two contract parties.
- **Product:** The parties are agreeing on a value driven agreement for 1 Branded Product (ABC), which has 2 Medicinal Product ("ABC vial 10mg/ml", "ABC vial 20mg/ml") that each come in 3 pack sizes: 10, 20 and 30 units;

The product is a breast cancer treatment product and promises an Overall Survival (OS) for the 12 months subsequent to the treatment start date and Progression Free Survival (PFS) for the 9 months subsequent to the treatment start date.

- **Duration:** The treatment duration is 1 month.
- **Enrollment:** The enrollment criteria is a Patient with a cancer Stages 0 to 3, age under 55.
- **Pricing:**
  - Base prices:
    - ABC vial 10mg/ml
      - 10 Units: CHF 1'000
      - 20 Units: CHF 1'800
      - 30 Units: CHF 2'500
    - ABC vial 20mg/ml
      - 10 Units: CHF 1'500
      - 20 Units: CHF 2'700
      - 30 Units: CHF 4'100
  - Per patient:

1. OS after 12 months: 75% of the base price is paid
2. No OS before 12 months: 30% of the base price is paid
3. PFS after 9 months: 85% of the base price is paid
4. No PFS before 9 months: 40% of the base price is paid

## Supporting information:

- Units from the pack cannot be administered separately, so it`s always one of six possible packages
- Progression free survival (PFS) for x months – patient is alive within x months while his disease is not progressing
- Overall survival (OS) for x months – patient is alive within x months (it doesn't matter whether disease progresses or not)
- The earliest event defines the condition:
  if progression happened – only OS options are considered (pricing per patient 1-2);
  if no progression happened – only PFS options are considered (pricing per patient 3-4);
- Everything, that is not payable is refunded, meaning that if applied price rate is 60%:
  Payable = Base price \* 60%
  Refundable = Base price \* (100%-60%)
