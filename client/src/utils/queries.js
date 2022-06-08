import { gql } from '@apollo/client';
// Apollo Client (@apollo/client) is an all-in-one dependency that enables us to connect to a GraphQL API server and execute queries or mutations using their own special form of React Hooks.


// GraphQL (graphql) is a dependency much like MySQL2 was for Sequelize. We don't use it directly, but it needs to be present so that the GraphQL syntax used with Apollo Client can be understood.
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;
