import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Task, TaskStatus } from '../schema/task.schema';
import { mockTasks } from './tasks.mock';

describe('TasksService', () => {
  let service: TasksService;

  const mockTask: Task = mockTasks[0];

  // Mock of mongoose Model
  const mockModel = {
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    // reset mocks before each test
    mockModel.find.mockReset();
    mockModel.findById.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Task'),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('getTasks', () => {
    it('retourne la liste sans filtre quand status est undefined', async () => {
      const execMock = jest.fn().mockResolvedValue(mockTasks);
      mockModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getTasks(undefined);

      expect(mockModel.find).toHaveBeenCalledWith();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('retourne la liste filtrée quand status est fourni', async () => {
      const status = 'done' as unknown as TaskStatus;
      const filtered = mockTasks.filter((t) => t.status === status);

      const execMock = jest.fn().mockResolvedValue(filtered);
      mockModel.find.mockReturnValue({ exec: execMock });

      const result = await service.getTasks(status);

      expect(mockModel.find).toHaveBeenCalledWith({ status });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(filtered);
    });

    it('lève HttpException 404 si aucune tâche trouvée', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      mockModel.find.mockReturnValue({ exec: execMock });

      try {
        await service.getTasks(undefined);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((err as HttpException).message).toBe('No task found');
      }
    });

    it("lève HttpException 500 en cas d'erreur DB", async () => {
      const execMock = jest.fn().mockRejectedValue(new Error('db error'));
      mockModel.find.mockReturnValue({ exec: execMock });

      try {
        await service.getTasks(undefined);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect((err as HttpException).message).toBe(
          'Could not fetch todo list',
        );
      }
    });
  });

  describe('getTask', () => {
    it('retourne la tâche quand elle existe', async () => {
      const execMock = jest.fn().mockResolvedValue(mockTask);
      const leanMock = jest.fn().mockReturnValue({ exec: execMock });
      mockModel.findById.mockReturnValue({ lean: leanMock });

      const result = await service.getTask('1');

      expect(mockModel.findById).toHaveBeenCalledWith('1');
      expect(leanMock).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockTask);
    });

    it("lève HttpException 404 si la tâche n'existe pas", async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      const leanMock = jest.fn().mockReturnValue({ exec: execMock });
      mockModel.findById.mockReturnValue({ lean: leanMock });

      try {
        await service.getTask('999');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect((err as HttpException).message).toBe(
          'Todo item with id 999 not found',
        );
      }
    });

    it("lève HttpException 500 en cas d'erreur DB", async () => {
      const execMock = jest.fn().mockRejectedValue(new Error('db error'));
      const leanMock = jest.fn().mockReturnValue({ exec: execMock });
      mockModel.findById.mockReturnValue({ lean: leanMock });
      try {
        await service.getTask('1');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect((err as HttpException).getStatus()).toBe(
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
        expect((err as HttpException).message).toBe(
          'Could not fetch todo item with id 1',
        );
      }
    });
  });
});
