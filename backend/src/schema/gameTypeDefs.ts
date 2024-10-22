const gameTypeDefs = `#graphql


scalar JSON            
scalar DateTime      


type Mutation {
  createGame: String!
}


type Game {
  id: ID!
  gameState: JSON!
  users: [User!]!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  winner: User        
}

type UserGame {
  id: ID!
  username: String!
  email: String!
}


type Profile {
  username: String!
  games: [Game!]!
}

type Query {
  profile: Profile!
}



`;

export default gameTypeDefs;
