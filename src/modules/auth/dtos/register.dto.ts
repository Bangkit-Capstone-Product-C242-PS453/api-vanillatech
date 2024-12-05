import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;
}
