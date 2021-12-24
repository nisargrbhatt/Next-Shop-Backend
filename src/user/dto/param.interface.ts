export interface createUserData {
  email: string;
  name: string;
  password: string;
  contact_no: string;
  role: string;
}

export interface oAuthCallData {
  id: string;
  email: string;
  role: string;
  name: string;
  email_verified: boolean;
}
