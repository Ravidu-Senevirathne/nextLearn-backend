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
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiResponse({ status: 201, description: 'Grade created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Student, Assignment, or Course not found' })
  create(@Body() createGradeDto: CreateGradeDto) {
    return this.gradesService.create(createGradeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all grades with optional filters' })
  @ApiResponse({ status: 200, description: 'List of grades' })
  findAll(
    @Query('search') search?: string,
    @Query('courseId') courseId?: string,
    @Query('assignmentId') assignmentId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.gradesService.findAll(
      search,
      courseId,
      assignmentId,
      +page,
      +limit,
    );
  }

  @Get('export')
  @ApiOperation({ summary: 'Export grades' })
  @ApiResponse({ status: 200, description: 'Grades exported' })
  exportGrades(@Query('courseId') courseId?: string) {
    return this.gradesService.exportGrades(courseId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get grades by student' })
  @ApiResponse({ status: 200, description: 'Student grades' })
  getGradesByStudent(@Param('studentId') studentId: string) {
    return this.gradesService.getGradesByStudent(studentId);
  }

  @Get('course/:courseId')
  @ApiOperation({ summary: 'Get grades by course' })
  @ApiResponse({ status: 200, description: 'Course grades' })
  getGradesByCourse(@Param('courseId') courseId: string) {
    return this.gradesService.getGradesByCourse(courseId);
  }

  @Get('assignment/:assignmentId')
  @ApiOperation({ summary: 'Get grades by assignment' })
  @ApiResponse({ status: 200, description: 'Assignment grades' })
  getGradesByAssignment(@Param('assignmentId') assignmentId: string) {
    return this.gradesService.getGradesByAssignment(assignmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  @ApiResponse({ status: 200, description: 'Grade details' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  findOne(@Param('id') id: string) {
    return this.gradesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update grade' })
  @ApiResponse({ status: 200, description: 'Grade updated' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  update(@Param('id') id: string, @Body() updateGradeDto: UpdateGradeDto) {
    return this.gradesService.update(id, updateGradeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete grade' })
  @ApiResponse({ status: 204, description: 'Grade deleted' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  remove(@Param('id') id: string) {
    return this.gradesService.remove(id);
  }
}