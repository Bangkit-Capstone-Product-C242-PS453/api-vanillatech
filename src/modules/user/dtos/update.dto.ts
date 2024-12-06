import { IsOptional, IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    phone?: string;
}
