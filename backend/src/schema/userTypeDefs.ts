const userTypeDefs = `#graphql
  type Query {
    getRedisValue(key: String!): String
  }

  type Mutation {
    Register(args: UsernamePasswordInput!): RegisterResponse!
  }

  input UsernamePasswordInput {
    username: String!
    email: String!
    password: String!
  }

  type RegisterResponse {
    user: User
    errors: [FieldError]
  }

  type FieldError {
    field: String!
    message: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
  }
`;

export default userTypeDefs;
