import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskInterface, TaskStatus } from './task.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable() 
export class TasksService {
    private tasks: TaskInterface[] = [];

    getAllTasks(): TaskInterface[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): TaskInterface[] {
        const { status, search } = filterDto;
        let filteredList: TaskInterface[] = this.getAllTasks();

        if (status) {
            filteredList = filteredList.filter(task => task.status === status);
        }
        if (search) {
            filteredList = filteredList.filter(task => task.title.includes(search) || task.description.includes(search));
        }

        return filteredList;
    }

    createTask(createTaskDto: CreateTaskDto): TaskInterface {

        const { title, description } = createTaskDto;

        const task: TaskInterface = {
            id: uuid.v1(),
            title,
            description,
            status: TaskStatus.OPEN,
        }

        this.tasks.push(task);
        return task;
    }

    getTaskById(id: string): TaskInterface {
        let found = this.tasks.find(task => task.id === id);

        if (!found) {
            throw new NotFoundException(`Task with ID  ${id} not found`);
        }

        return found;
    }

    updateTaskStatus(id: string, status: TaskStatus): TaskInterface {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTask(id: string) {
        let found = this.getTaskById(id);
        return this.tasks = this.tasks.filter(task => task.id !== found.id);
    }
}
