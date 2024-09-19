const userTypeDefs = `#graphql
  type Query {
  getRedisValue(key: String!): String
}

type Mutation {
  setRedisValue(key: String!, value: String!): String
}
`;

export default userTypeDefs;
