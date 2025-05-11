import { CombinationEntity } from "@/entities/combination";
import { SearchCheckIcon, SearchIcon, TableIcon } from "lucide-react";
import dayjs from "dayjs";

type CombinationCardProps = {
  data: CombinationEntity;
};

export const CombinationCard = ({ data }: CombinationCardProps) => {
  return (
    <div className="bg-white border py-3 px-4 rounded-md flex flex-col sm:flex-row  justify-between gap-4 sm:items-center">
      <h1 className="text-base flex">
        {dayjs(data.createdAt).format("DD, MMMM YYYY - hh:mma")}
      </h1>

      <div className="flex gap-2">
        <div className="py-1 px-2 text-sm border rounded-md flex items-center gap-2">
          <SearchIcon className="size-4 text-gray-500" />
          <span className="tabular-nums">{data.target || "-"}</span>
        </div>

        <div className="py-1 px-2 text-sm border rounded-md flex items-center gap-2">
          <TableIcon className="size-4 text-gray-500" />
          <span className="tabular-nums">
            {data.numberSeries?.length || "-"}
          </span>
        </div>

        <div className="py-1 px-2 text-sm border rounded-md flex items-center gap-2">
          <SearchCheckIcon className="size-4 text-gray-500" />
          <span className="tabular-nums">
            {data.combinationResult?.length || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};
