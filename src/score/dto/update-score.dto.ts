import { Allow, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateScoreDto {
  @IsNumber({}, { message: 'score_id phải là số' })
  @IsNotEmpty({ message: 'score_id không được để trống' })
  score_id: number;

  @IsNumber({}, { message: 'Điểm chuyên cần phải là kiểu số' })
  @Min(0, { message: 'Điểm chuyên cần phải lớn hơn hoặc bằng 0' })
  @Max(10, { message: 'Điểm chuyên cần phải nhỏ hơn hoặc bằng 10' })
  attendance_score: number;

  @IsNumber({}, { message: 'Điểm giữa kì phải là kiểu số' })
  @Min(0, { message: 'Điểm giữa kì phải lớn hơn hoặc bằng 0' })
  @Max(10, { message: 'Điểm giữa kì phải nhỏ hơn hoặc bằng 10' })
  midterm_score: number;

  @IsNumber({}, { message: 'Điểm cuối kì phải là kiểu số' })
  @Min(0, { message: 'Điểm cuối kì phải lớn hơn hoặc bằng 0' })
  @Max(10, { message: 'Điểm cuối kì phải nhỏ hơn hoặc bằng 10' })
  final_score: number;
}
