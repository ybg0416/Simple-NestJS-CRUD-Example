import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @IsNotEmpty({ message: 'Email cannot be null' })
  @IsEmail()
  @Length(2, 64, { message: 'Email not be less than 2 characters' })
  @ApiProperty({
    description: '사용자 이메일',
    example: 'test@naver.com',
    nullable: false,
  })
  email: string;

  @Length(2, 32, { message: 'Name not be less than 2 characters' })
  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  name: string;

  @Length(11, 13, { message: 'Phone not be less than 11 characters' })
  @ApiProperty({ description: '사용자 전화번호', example: '010-1234-5678' })
  phone: string;
}
