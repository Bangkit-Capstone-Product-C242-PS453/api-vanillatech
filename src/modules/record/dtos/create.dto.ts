import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateRecordDto {
  @IsOptional()
  @IsNumber()
  id_user?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
