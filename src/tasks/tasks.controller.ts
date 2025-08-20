import { Controller, Get, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from 'src/schema/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  @Get()
  async getTasks(@Query('status') status: TaskStatus): Promise<Task[]> {
    return this.TasksService.getTasks(status);
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<Task | null> {
    return this.TasksService.getTask(id);
  }
}
