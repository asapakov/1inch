import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    example: 'Alikhan',
    description: 'User name',
    nullable: false,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 1,
    description: 'User id',
    nullable: false,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
