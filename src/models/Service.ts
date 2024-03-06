import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Catalogue } from "./Catalogue";
import { Appointment } from "./Appointment";

@Entity("services")
export class Service extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", unique: true})
    name!: string;
    
    @Column({ name: "description", nullable: true})
    description!: string;

    @Column({ name: "photo", nullable: true})
    photo!: string;

    @OneToMany(() => Catalogue, catalogue => catalogue.service)
    catalogues!: Catalogue[];

    @OneToMany(() => Appointment, appointment => appointment.service)
    appointments!: Appointment[];
}
