import { DataSource, EntityRepository, Repository } from "typeorm";
import { TaskEntity } from "./task.entity";
import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TaskRepository extends Repository<TaskEntity>{

    constructor(private dataSaource: DataSource) {
        super(TaskEntity, dataSaource.createEntityManager());
    }


    async getTasks(filterDto: GetTasksFilterDto) : Promise<TaskEntity[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task_entity');

        if(status){
            query.andWhere('task_entity.status = :status', { status });
        }

        if(search){
            query.andWhere('(task_entity.title ILIKE :search OR task_entity.description ILIKE :search)', { search: `%${search}%` });
        }

        const tasks = await query.getMany();
        return tasks;
    }



    async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity>{
        const { title, description } = createTaskDto;
        const task = new TaskEntity();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;

        return await task.save();
    }
}