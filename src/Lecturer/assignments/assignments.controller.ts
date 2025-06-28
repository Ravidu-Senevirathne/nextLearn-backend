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
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadInterceptor } from '../../common/interceptors/file-upload.interceptor';
import { fileStorageConfig } from '../../common/config/file-storage.config';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) { }


  @Post()
  @UseInterceptors(FilesInterceptor('attachments')) // Expect `attachments` in multipart form
  async create(
    @Body() createAssignmentDto: CreateAssignmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.assignmentsService.createWithFiles(createAssignmentDto, files);
  }


  @Get()
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.assignmentsService.findByCourseId(courseId);
    }
    return this.assignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assignmentsService.remove(id);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, fileStorageConfig))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createAssignmentDto: CreateAssignmentDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Set file paths
    const filePaths = files.map(file => `/uploads/${file.filename}`);
    createAssignmentDto.attachments = filePaths;

    return this.assignmentsService.create(createAssignmentDto);
  }

}