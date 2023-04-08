import { CustomerResponseDto } from "./customer-response.dto";

export class LoginResponseDto {
  customer: CustomerResponseDto;
  token: string;
}