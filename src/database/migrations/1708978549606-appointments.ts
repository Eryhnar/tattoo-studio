import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Appointments1708978549606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "appointments",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "customer_id",
                        type: "int"
                    },
                    {
                        name: "artist_id",
                        type: "int"
                    },
                    {
                        name: "service_id",
                        type: "int"
                    },
                    {
                        name: "date",
                        type: "timestamp"
                    },
                    // {
                    //     name: "duration",
                    //     type: "int"
                    // },
                    {
                        name: "status",
                        type: "enum",
                        enum: ["pending", "confirmed", "cancelled"],
                        default: "'pending'"
                    },
                    {
                        name: "catalogue_id",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                        onUpdate: "now()"
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["customer_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["artist_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "users",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["service_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "services",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["catalogue_id"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "catalogue",
                        onDelete: "CASCADE"
                    }
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("appointments");
    }

}
