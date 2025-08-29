import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from '../schema/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  @Get()
  async getTasks(@Query('status') status?: TaskStatus): Promise<Task[]> {
    return this.TasksService.getTasks(status);
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<Task | null> {
    return this.TasksService.getTask(id);
  }

  @Patch(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() todo: Task,
  ): Promise<Task | null> {
    return this.TasksService.updateTask(id, todo);
  }
}
