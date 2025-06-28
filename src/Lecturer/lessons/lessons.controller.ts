import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('documentFile', {
      storage: diskStorage({
        destination: './uploads/lessons',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = extname(file.originalname);
          callback(null, `${uniqueSuffix}${extension}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (req.body.contentType !== 'document') {
          return callback(null, true);
        }
        
        // Check if the file type is allowed for documents
        const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx'];
        const ext = extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
          return callback(null, true);
        }
        
        return callback(new Error('Only PDF, DOC, DOCX, PPT, or PPTX files are allowed'), false);
      },
    }),
  )
  create(
    @Body() createLessonDto: CreateLessonDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // If this is a document-type lesson, add the file path to the DTO
    if (createLessonDto.contentType === 'document' && file) {
      const filePath = file.path;
      return this.lessonsService.create({
        ...createLessonDto,
        contentUrl: filePath, // Store the file path in the contentUrl field
      });
    }
    
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.lessonsService.findByCourseId(courseId);
    }
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}