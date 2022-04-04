const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

// import our typeDefs and resolvers for GraphQL
const { typeDefs, resolvers } = require('./schemas');

const { ApolloServer } = require('apollo-server-express');

const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;


// Apollo server used to integrate GraphQL with our express server.
const startServer = async () => {
  const server = new ApolloServer({
    // define the type definitions (queries and mutations) and resolvers
    // of the apollo server
    typeDefs, 
    resolvers, 
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // integrate this new apollo server into the app (express).
  // so we can now make requests and use graphQL.
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// The next set of functionality we created was a wildcard GET route for the 
// server. In other words, if we make a GET request to any location on the 
// server that doesn't have an explicit route defined, respond with the production-ready 
// React front-end code.
// FOR DEPLOY ONLY
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// this was user for REST API
// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
