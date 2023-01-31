import { Expose } from 'class-transformer';

export class AuthResultDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;
}
