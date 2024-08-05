import { IsString, IsBoolean, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class GetTodoDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    shortDesc?: string;

    @IsOptional()
    @IsString()
    fullDesc?: string;

    @IsDateString()
    date: string;

    @IsBoolean()
    status: boolean;
}