import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({ uri: "https://rickandmortyapi.com/graphql" }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          characters: {
            keyArgs: false,
            merge(existing = { results: [], info: {} }, incoming) {
              return {
                ...incoming,
                results: [...(existing.results || []), ...incoming.results],
                info: incoming.info,
              };
            },
          },
        },
      },
    },
  }),
});
