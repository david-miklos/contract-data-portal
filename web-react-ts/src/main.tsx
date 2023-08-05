import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";

const uri =
  import.meta.env.VITE_REACT_APP_GRAPHQL_URI || "http://localhost:4001/graphql";
const cache = new InMemoryCache();

const client = new ApolloClient({
  uri,
  cache,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
