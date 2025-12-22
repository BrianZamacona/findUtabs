export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthUser extends User {
  token: string;
  type: string;
}
