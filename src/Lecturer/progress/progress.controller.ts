import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProgressStatisticsQueryDto } from './dto/progress-statistics.dto';

@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new progress record' })
  @ApiResponse({ status: 201, description: 'Progress record created successfully' })
  create(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(createProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all progress records' })
  @ApiResponse({ status: 200, description: 'List of progress records' })
  findAll() {
    return this.progressService.findAll();
  }

  @Get('overview')
  @ApiOperation({ summary: 'Get overview statistics' })
  @ApiResponse({ status: 200, description: 'Overview statistics' })
  getOverviewStatistics(@Query() query: ProgressStatisticsQueryDto) {
    return this.progressService.getOverviewStatistics(query.timeFrame, query.courseId);
  }

  @Get('weekly-progress')
  @ApiOperation({ summary: 'Get weekly progress data' })
  @ApiResponse({ status: 200, description: 'Weekly progress data' })
  getWeeklyProgress(@Query() query: ProgressStatisticsQueryDto) {
    return this.progressService.getWeeklyProgress(query.weeks, query.courseId);
  }

  @Get('grade-distribution')
  @ApiOperation({ summary: 'Get grade distribution' })
  @ApiResponse({ status: 200, description: 'Grade distribution data' })
  getGradeDistribution(@Query('courseId') courseId?: string) {
    return this.progressService.getGradeDistribution(courseId);
  }

  @Get('course-progress')
  @ApiOperation({ summary: 'Get course progress data' })
  @ApiResponse({ status: 200, description: 'Course progress data' })
  getCourseProgress() {
    return this.progressService.getCourseProgress();
  }

  @Get('engagement')
  @ApiOperation({ summary: 'Get student engagement data' })
  @ApiResponse({ status: 200, description: 'Engagement data' })
  getEngagementData(@Query('timeFrame') timeFrame?: string) {
    return this.progressService.getEngagementData(timeFrame);
  }

  @Get('time-spent')
  @ApiOperation({ summary: 'Get time spent data' })
  @ApiResponse({ status: 200, description: 'Time spent data' })
  getTimeSpentData(@Query('timeFrame') timeFrame?: string) {
    return this.progressService.getTimeSpentData(timeFrame);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get progress by ID' })
  @ApiResponse({ status: 200, description: 'Progress details' })
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update progress' })
  @ApiResponse({ status: 200, description: 'Progress updated' })
  update(@Param('id') id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.update(id, updateProgressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete progress' })
  @ApiResponse({ status: 200, description: 'Progress deleted' })
  remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }
}
