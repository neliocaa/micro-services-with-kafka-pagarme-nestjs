import {
  IsString,
  IsNumber,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsPositive,
  Length,
  MinLength,
  MaxLength,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

enum DocType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
  PASSPORT = 'passport',
}
enum personType {
  individual = 'individual',
  company = 'company',
}

class OrderItemDto {
  @IsString()
  pet_name: string;

  @IsString()
  pet_id: string;

  @IsString()
  service_id: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsNumber()
  @IsPositive()
  total: number;
}

class CustomerAddressDto {
  @IsString()
  line_1: string;

  @IsString()
  line_2: string;

  @IsString()
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

class CustomerPhoneDto {
  @IsString()
  @IsNumberString({ no_symbols: true })
  @MinLength(1)
  country_code: string;

  @IsString()
  @IsNumberString({ no_symbols: true })
  @MinLength(2)
  area_code: string;

  @IsString()
  @IsNumberString({ no_symbols: true })
  number: string;
}

class CustomerDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsEmail()
  @MaxLength(64)
  email: string;

  @IsString()
  @MaxLength(52)
  id: string;

  @IsString()
  doc: string;

  @IsEnum(DocType)
  doc_type: DocType;

  @IsEnum(personType)
  type: personType;

  @ValidateNested()
  @Type(() => CustomerAddressDto)
  address: CustomerAddressDto;

  @ValidateNested()
  @Type(() => CustomerPhoneDto)
  phone: CustomerPhoneDto;
}

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

class CardDto {
  @IsString()
  card_id: string;

  @ValidateNested()
  @Type(() => BillingAddressDto)
  billing_address: BillingAddressDto;
}

class BillingDto {
  @IsString()
  type: string;

  @IsNumber()
  @IsPositive()
  installments?: number;

  @ValidateNested()
  @Type(() => CardDto)
  card?: CardDto;
}

export class OrderDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  discount?: number;

  @IsNumber()
  shipping?: number;

  @IsDateString()
  created_at: string;

  @IsString()
  currency?: string;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested({ each: true })
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => BillingDto)
  billing: BillingDto;
}
