import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  @MinLength(3, { message: 'name must be at least 3 characters long' })
  name: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'role must be a string' })
  @IsOptional()
  role: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsString({ message: 'avatar must be a string' })
  @IsOptional()
  avatar: string;
}
