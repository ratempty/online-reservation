import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ShowDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  title: string;

  @IsNumber()
  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  price: number;

  @IsString()
  @IsNotEmpty({ message: '정보를 입력해주세요.' })
  info: string;

  @IsString()
  @IsNotEmpty({ message: '위치를 입력해주세요.' })
  space: string;

  @IsDateString()
  @IsNotEmpty({ message: '날짜를 입력해주세요.' })
  dateTime: string;
}
