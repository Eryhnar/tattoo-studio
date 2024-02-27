import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Service } from "./Service";
import { User } from "./User";

@Entity("appointments")
export class Appointment extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number;
    
    //date
    @Column({ name: "date"})
    date!: Date;

    //created_at
    @Column({ name: "created_at"})
    createdAt!: Date;

    @Column({ name: "duration"})
    duration!: number; //in minutes

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "customer_id" })
    customer!: User;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: "artist_id" })
    artist!: User;

    @ManyToOne(() => Service, service => service.id)
    @JoinColumn({ name: "service_id" })
    service!: Service;
}
