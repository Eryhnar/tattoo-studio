import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User";
import { Service } from "./Service";
import { Appointment } from "./Appointment";

@Entity("catalogue")
export class Catalogue extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "name", unique: true})
    name!: string;

    @Column({ name: "description", nullable: true})
    description!: string;

    @Column({ name: "price"})
    price!: number;

    @Column({ name: "before_image", unique: true, nullable: true})
    beforeImage!: string;

    @Column({ name: "after_image", unique: true})
    afterImage!: string;

    @Column({ name: "created_at"})
    createdAt!: Date;

    @Column({ name: "updated_at"})
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.catalogues)
    @JoinColumn({name: "artist_id"})
    artist!: User;

    @ManyToOne(() => Service, service => service.catalogues)
    @JoinColumn({name: "service_id"})
    service!: Service;

    @OneToMany(() => Appointment, appointment => appointment.catalogue)
    appointments!: Appointment[];
}
