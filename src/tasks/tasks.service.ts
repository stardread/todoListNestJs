import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskStatus } from '../schema/task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async getTasks(status: TaskStatus | undefined): Promise<Task[]> {
    console.log('Fetching todo list from the database');
    let tasks: Task[] = [];
    try {
      if (status) {
        tasks = await this.taskModel.find({ status: status }).exec();
      } else {
        tasks = await this.taskModel.find().exec();
      }
    } catch (error) {
      console.error('Error fetching todo list:', error);
      throw new HttpException(
        'Could not fetch todo list',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!tasks.length) {
      throw new HttpException('No task found', HttpStatus.NOT_FOUND);
    }
    return tasks;
  }

  async getTask(id: string): Promise<Task | null> {
    console.log(`Fetching todo item with id: ${id}`);
    let res: Task | null;
    try {
      res = await this.taskModel.findById(id).lean().exec();
    } catch (error) {
      console.error(`Error fetching todo item with id ${id}:`, error);
      throw new HttpException(
        `Could not fetch todo item with id ${id}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!res) {
      throw new HttpException(
        `Todo item with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return res;
  }
}
