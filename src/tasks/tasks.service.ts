import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }
    
    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]>{
        return this.taskRepository.getTasks(filterDto, user);
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<TaskEntity> {
        return await this.taskRepository.createTask(createTaskDto, user);
    }

    async getTaskById(id: number, user: User): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Task with ID  ${id} not found`);
        }
        return found
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<TaskEntity> {
        const taskEntity = await this.getTaskById(id, user);
        taskEntity.status = status;
        return await taskEntity.save();
    }

    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({id, userId: user.id});
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID  ${id} not found`);
        }
    }
}
