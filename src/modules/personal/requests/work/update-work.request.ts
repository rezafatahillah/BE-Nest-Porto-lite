import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateWorkRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  companyName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  position: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  supervisor: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Tanggal mulai pekerjaan (YYYY-MM-DD)',
  })
  start: Date;

  @ValidateIf((o) => !o.stillWorking)
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    type: String,
    format: 'date',
    description: 'Tanggal selesai pekerjaan (YYYY-MM-DD)',
  })
  end: Date;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    type: Boolean,
    description: 'Apakah masih bekerja di perusahaan ini',
  })
  stillWorking?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  salary: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  jobdesk: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  reason: string;
}
