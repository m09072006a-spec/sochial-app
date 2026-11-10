
export interface SignUpDataType {
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
    gender: "male" | "female" | "null";

    
  password: string;
  rePassword: string;
}