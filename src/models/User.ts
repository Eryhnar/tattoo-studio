import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./Role";

@Entity("users")
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column( { name: "name" } )
    name!: string;
    
    @Column( { name: "email", unique: true } )
    email!: string;
    
    @Column( { name: "password" } )
    password!: string;
    
    @Column( { name: "is_active" })
    isActive!: boolean;

    //created_at
    @Column( { name: "created_at" } )
    createdAt!: Date;

    //updated_at
    @Column( { name: "updated_at" } )
    updatedAt!: Date;

    //role_id (foreign key) many to one
    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: "role_id" })
    role!: Role;
}
