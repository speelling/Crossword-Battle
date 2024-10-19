import { gql } from "@apollo/client";

// USER
export const REGISTER_MUTATION = gql`
  mutation Register($args: UsernamePasswordInput!) {
    Register(args: $args) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($args: LoginInput!) {
    Login(args: $args) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    Logout
  }
`;  

// GAME 

export const CREATE_GAME = gql`
  mutation CreateGame {
  createGame 
}
`;
