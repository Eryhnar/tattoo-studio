import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Catalogue } from "./Catalogue";

@Entity("services")
export class Service extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", unique: true})
    name!: string;
    
    @Column({ name: "description"})
    description!: string;
    
    @Column({ name: "price"})
    price!: number;

    @OneToMany(() => Catalogue, catalogue => catalogue.id)
    catalogues!: Catalogue[];

    @OneToMany(() => Appointment, appointment => appointment.id)
    appointments!: Appointment[];
}
