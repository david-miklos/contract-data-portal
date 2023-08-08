const { toGraphQLTypeDefs } = require("@neo4j/introspector");
const fs = require("fs");
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "password")
);

const sessionFactory = function () {
  return driver.session({ defaultAccessMode: neo4j.session.READ });
};

// We create an async function here until "top-level await" has landed
// so we can use async/await
async function main() {
  const typeDefs = await toGraphQLTypeDefs(sessionFactory);
  fs.writeFileSync("schema.graphql", typeDefs);
  await driver.close();
}
main();
