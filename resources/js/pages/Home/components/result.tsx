import { CombinationCard } from "@/components/cards/combination-card";
import {
  CombinationDetailDialog,
  CombinationDetailDialogHandler,
} from "@/components/dialogs/combination-detail-dialog";
import { main_db } from "@/services/main_db";
import { useLiveQuery } from "dexie-react-hooks";
import { useRef } from "react";

const Result = () => {
  const combinations = useLiveQuery(() =>
    main_db.combinations.reverse().toArray()
  );

  const dialogRef = useRef<CombinationDetailDialogHandler>(null);

  if (!combinations) return null;
  if (combinations.length === 0) return null;

  return (
    <>
      <CombinationDetailDialog ref={dialogRef} />

      <div className="flex flex-col gap-5">
        <h1 className="text-xl font-bold">Result</h1>

        <div className="flex flex-col gap-2">
          {combinations.map((combination) => (
            <div
              key={combination.id}
              onClick={() => dialogRef.current?.onOpen(combination)}
              className="cursor-pointer"
            >
              <CombinationCard key={combination.id} data={combination} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { Result };
