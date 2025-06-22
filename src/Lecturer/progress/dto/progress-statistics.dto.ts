import { IsIn, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ProgressStatisticsQueryDto {
    @IsOptional()
    @IsIn(['This Week', 'This Month', 'Last 3 Months', 'This Year', 'All Time'])
    timeFrame?: string = 'This Month';

    @IsOptional()
    @IsUUID()
    courseId?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    weeks?: number = 8;
}
