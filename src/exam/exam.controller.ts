import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ExamsService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'List of exams' })
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.examsService.findByCourseId(courseId);
    }
    return this.examsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam details' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam' })
  @ApiResponse({ status: 200, description: 'Exam updated' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete exam' })
  @ApiResponse({ status: 204, description: 'Exam deleted' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish exam' })
  @ApiResponse({ status: 200, description: 'Exam published' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  publish(@Param('id') id: string) {
    return this.examsService.changeStatus(id, 'published');
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish exam' })
  @ApiResponse({ status: 200, description: 'Exam unpublished' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  unpublish(@Param('id') id: string) {
    return this.examsService.changeStatus(id, 'draft');
  }

  @Get(':id/total-marks')
  @ApiOperation({ summary: 'Calculate total marks for exam' })
  @ApiResponse({ status: 200, description: 'Total marks calculated' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  getTotalMarks(@Param('id') id: string) {
    return this.examsService.calculateTotalMarks(id);
  }
}