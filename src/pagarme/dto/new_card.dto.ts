import {
  IsNotEmpty,
  IsString,
  IsNumberString,
  IsNumber,
  ValidateNested,
  Length,
  MaxLength,
  MinLength,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

class BillingAddressDto {
  @IsString()
  line_1: string;

  @IsString()
  line_2: string;

  @IsNumberString({ no_symbols: true })
  zip_code: string;

  @IsString()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsString()
  @Length(2, 2)
  country: string;
}

export class NewCardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(13)
  @MaxLength(19)
  number: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  holder_name: string;

  @IsNotEmpty()
  @IsString()
  holder_document: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  exp_month: number;

  @IsNotEmpty()
  @IsNumber()
  exp_year: number;

  @IsNotEmpty()
  @IsNumberString()
  cvv: number;

  //brand: string;

  @ValidateNested()
  @Type(() => BillingAddressDto)
  billing_address: BillingAddressDto;

  @IsString()
  customer_id?: string;
}
