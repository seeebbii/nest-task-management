import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto) : Promise<TaskEntity[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Post()
    @UsePipes(ValidationPipe)
    // @UseFilters(new ValidationExceptionFilter())
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity>{
        return this.tasksService.getTaskById(id);
    }

    @Patch('/:id/status')
    updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus) : Promise<TaskEntity>{
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number){
        return this.tasksService.deleteTask(id);
    }
    
}
