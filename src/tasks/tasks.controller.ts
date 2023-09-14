import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskInterface, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): TaskInterface[] {

        if(Object.keys(filterDto).length){
            return this.tasksService.getTasksWithFilters(filterDto);
        }

        return this.tasksService.getAllTasks();
    }

    @Post()
    @UsePipes(ValidationPipe)
    // @UseFilters(new ValidationExceptionFilter())
    createTask(@Body() createTaskDto: CreateTaskDto): TaskInterface {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): TaskInterface{
        return this.tasksService.getTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id') id: string, @Body('status', TaskStatusValidationPipe) status: TaskStatus){
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id:string){
        return this.tasksService.deleteTask(id);
    }
    
}
