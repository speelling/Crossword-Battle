import { gql } from "@apollo/client";




export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
    }
  }
`;


export const PROFILE_QUERY = gql`
  query Profile {
  profile {
    games {
      createdAt
      gameState
      id
      status
      updatedAt
      winner {
        username
        id
      }
    }
    username
  }
}
`;