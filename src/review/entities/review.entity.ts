import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    @Column('text')
    content:string;

    @CreateDateColumn()
    createdAt:Date;


}
