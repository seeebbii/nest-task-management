import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }
    
    async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]>{
        return this.taskRepository.getTasks(filterDto);
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return await this.taskRepository.createTask(createTaskDto);
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        const found = await this.taskRepository.findOne({ where: { id } });
        if (!found) {
            throw new NotFoundException(`Task with ID  ${id} not found`);
        }
        return found
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
        const taskEntity = await this.getTaskById(id);
        taskEntity.status = status;
        return await taskEntity.save();
    }

    async deleteTask(id: number): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID  ${id} not found`);
        }
    }
}
