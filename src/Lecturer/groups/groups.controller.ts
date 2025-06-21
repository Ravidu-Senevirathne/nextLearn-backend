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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student groups' })
  @ApiResponse({ status: 200, description: 'List of groups' })
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.groupsService.findByCourseId(courseId);
    }
    return this.groupsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get group statistics' })
  @ApiResponse({ status: 200, description: 'Group statistics' })
  getStats() {
    return this.groupsService.getGroupStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group details' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, description: 'Group updated' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 204, description: 'Group deleted' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add members to group' })
  @ApiResponse({ status: 200, description: 'Members added' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  addMembers(
    @Param('id') id: string,
    @Body() { userIds }: { userIds: string[] },
  ) {
    return this.groupsService.addMembers(id, userIds);
  }

  @Delete(':id/members')
  @ApiOperation({ summary: 'Remove members from group' })
  @ApiResponse({ status: 200, description: 'Members removed' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  removeMembers(
    @Param('id') id: string,
    @Body() { userIds }: { userIds: string[] },
  ) {
    return this.groupsService.removeMembers(id, userIds);
  }
}