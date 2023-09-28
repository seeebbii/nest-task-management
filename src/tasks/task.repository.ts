import { DataSource, EntityRepository, Repository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";

@Injectable()
export class TaskRepository extends Repository<TaskEntity>{
    private logger = new Logger("TaskRepository");
    constructor(private dataSaource: DataSource) {
        super(TaskEntity, dataSaource.createEntityManager());
    }


    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<TaskEntity[]> {

        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task_entity');

        query.where('task_entity.userId = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task_entity.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task_entity.title ILIKE :search OR task_entity.description ILIKE :search)', { search: `%${search}%` });
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error
            throw new InternalServerErrorException();
        }


    }



    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<TaskEntity> {
        const { title, description } = createTaskDto;
        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        try {
            await task.save()
        } catch (error) {
            this.logger.error(`Failed to create a task for user ${user.username}. Data: ${createTaskDto}`, error.stack);
            throw new InternalServerErrorException();
        }
        delete task.user;
        return task;
    }
}