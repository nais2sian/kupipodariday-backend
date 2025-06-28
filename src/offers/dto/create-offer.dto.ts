import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateOfferDto {
  @IsInt()
  @Min(1)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean = false;

  @IsInt()
  @Min(1)
  itemId: number;
}
