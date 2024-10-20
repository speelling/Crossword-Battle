const gameTypeDefs = `#graphql


scalar JSON            
scalar DateTime      


type Mutation {
  createGame: String!
}


type Game {
  id: ID!
  gameState: JSON!
  status: String!
  createdAt: DateTime!
  updatedAt: DateTime!
  winner: User        
}

type User {
  id: ID!
  username: String!
  email: String!
  games: [Game!]! 
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
