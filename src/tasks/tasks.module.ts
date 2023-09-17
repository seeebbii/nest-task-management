import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { TaskEntity } from './task.entity';

@Module({
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}
