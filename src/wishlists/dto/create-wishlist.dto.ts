import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsInt,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  itemsId?: number[];
}
