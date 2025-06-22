import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCourseDto: any,
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    // Parse the JSON strings back into arrays
    const parsedDto: CreateCourseDto = {
      ...createCourseDto,
      topics: JSON.parse(createCourseDto.topics),
      features: JSON.parse(createCourseDto.features),
      requirements: JSON.parse(createCourseDto.requirements)
    };
    
    // Add file handling logic here
    
    return this.coursesService.create(parsedDto, req.user);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
