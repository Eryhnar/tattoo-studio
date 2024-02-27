import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Role extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string;

    @OneToMany(() => User, user => user.role)
    users!: User[];
}
