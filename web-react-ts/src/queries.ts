import { gql } from "@apollo/client";

export const GET_ALL_PEOPLE = gql`
  query getAllPeople {
    people {
      id
      name
      age
    }
  }
`;
