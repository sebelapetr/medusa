import { MigrationInterface, QueryRunner } from "typeorm"
import IsolateSalesChannelDomainFeatureFlag from "../loaders/feature-flags/isolate-sales-channel-domain"

export const featureFlag = IsolateSalesChannelDomainFeatureFlag.key

export class OrderSalesChannelsLink1699548272662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "order_sales_channel"
        (
            "id"                character varying        NOT NULL,
            "order_id"           character varying        NOT NULL,
            "sales_channel_id"  character varying,
            "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at"        TIMESTAMP WITH TIME ZONE,
            CONSTRAINT "order_sales_channel_pk"              PRIMARY KEY ("id"),
            CONSTRAINT "order_sales_channel_order_id_unique"  UNIQUE ("order_id")
            );

        insert into "order_sales_channel" (id, order_id, sales_channel_id)
            (select 'ordersc_' || substr(md5(random()::text), 0, 27), id, sales_channel_id from "order");

        ALTER TABLE "order" DROP CONSTRAINT IF EXISTS "FK_6ff7e874f01b478c115fdd462eb";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "order_sales_channel";
        ALTER TABLE "order" ADD CONSTRAINT "FK_6ff7e874f01b478c115fdd462eb" FOREIGN KEY ("sales_channel_id") REFERENCES "sales_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
