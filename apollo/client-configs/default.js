import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from '~/apollo/fragmentTypes.json';

export default () => {

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData
  });
  const cache = new InMemoryCache({ fragmentMatcher });
  const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: process.env.GRAPHQL_ENDPOINT,
  })
  const errorHandler = onError(({ networkError, graphQLErrors }) => {
    // ...
  });

  return {
    link: ApolloLink.from([errorHandler, httpLink]),
    cache,
    defaultHttpLink: false
  };
}