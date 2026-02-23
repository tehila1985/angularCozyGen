export interface User {
  userId?: number;
  name: string;
  email: string;
}

export interface UserLogin {
  email: string;
  passwordHash: string;
}

export interface UserRegister {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
}

export interface UserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}
