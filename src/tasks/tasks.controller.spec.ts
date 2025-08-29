import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TaskStatus } from '../schema/task.schema';
import { mockTasks } from './tasks.mock';
describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getTasks: jest.fn(),
            getTask: jest.fn(),
            updateTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get(TasksService);
  });

  describe('GET /tasks', () => {
    it('retourne la liste sans filtre quand status est undefined', async () => {
      const getTasksSpy = jest
        .spyOn(service, 'getTasks')
        .mockResolvedValue(mockTasks);

      const result = await controller.getTasks(undefined);

      expect(getTasksSpy).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockTasks);
    });

    it('passe le status au service et renvoie le résultat', async () => {
      const status = 'done' as unknown as TaskStatus;
      const filtered = mockTasks.filter((t) => t.status === status);
      const getTasksSpy = jest
        .spyOn(service, 'getTasks')
        .mockResolvedValue(filtered);

      const result = await controller.getTasks(status);

      expect(getTasksSpy).toHaveBeenCalledWith(status);
      expect(result).toEqual(filtered);
    });

    it('gère une liste vide', async () => {
      service.getTasks.mockResolvedValue([]);
      const result = await controller.getTasks(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('GET /tasks/:id', () => {
    it('retourne une tâche quand elle existe', async () => {
      const task = mockTasks[0];
      const getTaskSpy = jest.spyOn(service, 'getTask').mockResolvedValue(task);
      const result = await controller.getTask('1');

      expect(getTaskSpy).toHaveBeenCalledWith('1');
      expect(result).toEqual(task);
    });

    it('retourne null quand la tâche est absente', async () => {
      const getTaskSpy = jest.spyOn(service, 'getTask').mockResolvedValue(null);

      const result = await controller.getTask('999');

      expect(getTaskSpy).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('PUT /tasks/:id', () => {
    const task = mockTasks[0];
    it('retourne la tâche quand elle existe', async () => {
      const updateTaskSpy = jest
        .spyOn(service, 'updateTask')
        .mockResolvedValue(task);
      const result = await controller.updateTask('1', task);

      expect(updateTaskSpy).toHaveBeenCalledWith('1', task);
      expect(result).toEqual(task);
    });

    it('retourne null quand la tâche est absente', async () => {
      const updateTaskSpy = jest
        .spyOn(service, 'updateTask')
        .mockResolvedValue(null);

      const result = await controller.updateTask('999', task);

      expect(updateTaskSpy).toHaveBeenCalledWith('999', task);
      expect(result).toBeNull();
    });
  });
});
