import { CombinationCard } from "@/components/cards/combination-card";
import { main_db } from "@/services/main_db";
import { useLiveQuery } from "dexie-react-hooks";

const Result = () => {
  const combinations = useLiveQuery(() =>
    main_db.combinations.reverse().toArray()
  );

  if (!combinations) return null;
  if (combinations.length === 0) return null;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-xl font-bold">Result</h1>

      <div className="flex flex-col gap-2">
        {combinations.map((combination) => (
          <CombinationCard key={combination.id} data={combination} />
        ))}
      </div>
    </div>
  );
};

export { Result };
