import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Service } from "./Service";
import { User } from "./User";

export enum AppointmentStatus {
    pending = "pending",
    passed = "confirmed",
    cancelled = "cancelled"
}

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

    @Column({ name: "updated_at"})
    updatedAt!: Date;

    /*@Column({ name: "duration"})
    duration!: number; //in minutes */

    @Column(
        {
            name: "status",
            type: "enum",
            enum: AppointmentStatus,
            default: AppointmentStatus.pending
        }
    )
    status!: AppointmentStatus;

    @ManyToOne(() => User, user => user.customerAppointments)
    @JoinColumn({ name: "customer_id" })
    customer!: User;

    @ManyToOne(() => User, user => user.artistAppointments)
    @JoinColumn({ name: "artist_id" })
    artist!: User;

    @ManyToOne(() => Service, service => service.appointments)
    @JoinColumn({ name: "service_id" })
    service!: Service;
}
