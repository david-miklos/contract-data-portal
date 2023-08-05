import { useQuery } from "@apollo/client";
import { GET_ALL_PEOPLE } from "./queries";
import { People } from "./interfaces";

function App() {
  const { loading, error, data } = useQuery<People>(GET_ALL_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Something went wrong</p>;

  const people = data.people;
  return (
    <>
      <h1 className="text-red-500">hiii</h1>
      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
