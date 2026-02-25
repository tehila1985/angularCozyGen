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
  phone: string;
  address: string;
}

export interface UserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  phone?: string;
  address?: string;
}

export interface UserUpdate {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  phone: string;
  address: string;
}
