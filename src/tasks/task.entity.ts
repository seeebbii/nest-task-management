import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from './task-status.enum';
import { User } from "src/auth/user.entity";

@Entity()
export class TaskEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    //type => User, user => user.tasks, {eager: false}
    @ManyToOne(() => User, user => user.tasks, {eager: false,})
    user: User[];
}