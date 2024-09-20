import { gql } from "@apollo/client";

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
  mutation Login($args: UsernamePasswordInput!) {
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