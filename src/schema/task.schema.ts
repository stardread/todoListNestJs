import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;
export type TaskStatus = 'done' | 'inProgress' | 'todo';

@Schema({ collection: 'task' })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
