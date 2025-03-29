import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
