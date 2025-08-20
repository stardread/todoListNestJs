import { Task, TaskStatus } from '../schema/task.schema';

export const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'A',
    status: 'todo' as unknown as TaskStatus,
    description: 'Task A',
  } as Task,
  {
    _id: '2',
    title: 'B',
    status: 'done' as unknown as TaskStatus,
    description: 'Task B',
  } as Task,
];
