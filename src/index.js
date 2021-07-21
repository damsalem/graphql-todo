import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
/* import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  gql,
  concat,
} from "@apollo/client"; 

const httpLink = new HttpLink({
  uri: "https://learn-graphql-todo.hasura.app/v1/graphql",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      "x-hasura-admin-secret":
        "yugZrYZBI98WXdRr4B2wiK7svuPB1kKevZdl2SUPzbjqNuMOD6zVWkpYQcQxE5oP",
    },
  });

  return forward(operation);
}); 

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
}); */
/* const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://learn-graphql-todo.hasura.app/v1/graphql",
    headers: {
      "x-hasura-admin-secret":
        "yugZrYZBI98WXdRr4B2wiK7svuPB1kKevZdl2SUPzbjqNuMOD6zVWkpYQcQxE5oP",
    },
  }),
}); */

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://learn-graphql-todo.hasura.app/v1/graphql",
  headers: {
    "x-hasura-admin-secret":
      "yugZrYZBI98WXdRr4B2wiK7svuPB1kKevZdl2SUPzbjqNuMOD6zVWkpYQcQxE5oP",
  },
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
