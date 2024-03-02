import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Catalogue1708977049545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "catalogue",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "250"
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "artist_id",
                        type: "int",
                    },
                    {
                        name: "service_id",
                        type: "int",
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "before_image",
                        type: "varchar",
                        length: "250",
                        isNullable: true
                    },
                    {
                        name: "after_image",
                        type: "varchar",
                        length: "250"
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
                    }
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("catalogue");
    }

}
