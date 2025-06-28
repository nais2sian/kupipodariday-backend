import {
  IsEmail,
  IsString,
  Length,
  MinLength,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  about?: string;
}
