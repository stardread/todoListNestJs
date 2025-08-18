import { Controller, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from 'src/schema/task.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  @Get()
  async getTasks(): Promise<Task[]> {
    return this.TasksService.getTasks();
  }

  @Get(':id')
  async getTask(@Param('id') id: string): Promise<Task | null> {
    return this.TasksService.getTask(id);
  }
}
