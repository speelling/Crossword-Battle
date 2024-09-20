import { UsernamePasswordInput } from "../types/UserTypes";

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes("@")) {
      return [
        {
          field: "email",
          message: "invalid email",
        },
      ];
    }
  
    if (options.username.length <= 3) {
      return [
        {
          field: "username",
          message: "length must be greater than 2",
        },
      ];
    }
    if (options.username.includes("@")) {
      return [
        {
          field: "username",
          message: "cant use @",
        },
      ];
    }
    if (options.password.length <= 3) {
      return [
        {
          field: "password",
          message: "length must be greater than 2",
        },
      ];
    }
    return null;
  };