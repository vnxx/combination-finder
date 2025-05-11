import { CombinationEntity } from "@/entities/combination";
import Dexie, { EntityTable } from "dexie";

const DATABASE_NAME = "main_db";

const main_db = new Dexie(DATABASE_NAME) as Dexie & {
  combinations: EntityTable<CombinationEntity, "id">;
};

main_db.version(1).stores({
  combinations: "&id,name",
});

export { main_db };
