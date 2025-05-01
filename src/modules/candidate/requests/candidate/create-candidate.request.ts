import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListItem } from 'src/cores/interfaces';
import { IsExists } from 'src/middlewares/validators';

export class CreateCandidateRequest {

  @IsOptional()
  @IsString()
  @ApiProperty()
  id?: string;

  @IsOptional()
  @IsNumber()
  @IsExists('StgFile', 'id')
  @ApiProperty()
  pictureId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  gender?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  birthPlace?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  religion?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  marital?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  otherReligion?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  hobby?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  summary?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  city?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  postal?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  addressDomicile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  cityDomicile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  postalDomicile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ktp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  kk?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  paspor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  simA?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  simB?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  simC?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bpjsKesehatan?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bpjsKetenagakerjaan?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  npwp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  statusPtkp?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bankName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accountNo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  accountName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  workTerm?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  expectedSalary?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  otherFacility?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  availability?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  interest?: ListItem[];

  @IsOptional()
  @IsString()
  @ApiProperty()
  reason?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  strengths?: ListItem[];

  @IsOptional()
  @IsArray()
  @ApiProperty()
  weaknesses?: ListItem[];

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  weight?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  height?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  hospitalized?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  psychologicalTest?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  carOwnership?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  carBrand?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  carModel?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  carYear?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bikeOwnership?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bikeBrand?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  bikeModel?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  bikeYear?: number;
}
