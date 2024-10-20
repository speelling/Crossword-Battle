const userTypeDefs = `#graphql
  type Query {
    me: User
  }

  type Mutation {
    Register(args: UsernamePasswordInput!): RegisterResponse!
    Login(args: LoginInput!): RegisterResponse!
    Logout: Boolean
  }



  input LoginInput {
    email: String!
    password: String!
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
    games: [Game!]!
  }
`;

export default userTypeDefs;
