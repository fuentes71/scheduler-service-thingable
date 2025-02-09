import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  Min,
  ValidateNested
} from 'class-validator';

class IntervalDTO {
  @IsInt({ message: 'O campo hours deve ser um inteiro.' })
  @Min(0, { message: 'O campo de hours deve ser um valor positivo.' })
  hours: number;

  @IsInt({ message: 'O campo minutes deve ser um inteiro.' })
  @Min(0, { message: 'O campo de minutes deve ser um valor positivo.' })
  minutes: number;

  @IsInt({ message: 'O campo seconds deve ser um inteiro.' })
  @Min(0, { message: 'O campo de seconds deve ser um valor positivo.' })
  seconds: number;
}

export class CronJobDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'O campo days_week deve conter pelo menos um dia da semana.' })
  @IsIn(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], { each: true })
  daysWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  @IsObject()
  @ValidateNested()
  @Type(() => IntervalDTO)
  interval: IntervalDTO;
}
