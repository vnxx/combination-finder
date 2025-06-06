import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CombinationEntity } from "@/entities/combination";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Button } from "../ui/button";
import { CombinationCard } from "../cards/combination-card";
import { main_db } from "@/services/main_db";
import { ClipboardCopyIcon } from "lucide-react";
import { toast } from "sonner";
import { isArrayMoreThan } from "@/lib/utils";

export type CombinationDetailDialogHandler = {
  onOpen: (detail: CombinationEntity) => void;
};

const CombinationDetailDialog = forwardRef<CombinationDetailDialogHandler>(
  (_, ref) => {
    const [state, setState] = useState({
      detail: null as CombinationEntity | null,
      open: false,
    });

    const onOpen = (detail: CombinationEntity) => {
      setState({ detail, open: true });
    };

    const onClose = () => {
      setState((prev) => ({ ...prev, open: false }));
    };

    useImperativeHandle(ref, () => ({ onOpen }));

    const onDelete = async () => {
      if (!state.detail) return;
      await main_db.combinations.delete(state.detail.id);

      setTimeout(() => {
        onClose();
      }, 100);
    };

    const result = useMemo(() => {
      if (!state.detail) return [];
      return (state.detail.combinationResult || []).slice(0, 20);
    }, [state.detail]);

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);

      toast.success("Copied to clipboard");
    };

    const stringNumberSeries = useMemo(() => {
      if (!state.detail?.numberSeries) return "";
      return state.detail.numberSeries?.join(", ");
    }, [state.detail]);

    const getStringCombinationResult = useCallback(
      (index: number): string => {
        if (!state.detail?.combinationResult) return "";
        return state.detail.combinationResult?.[index]?.join(", ") || "";
      },
      [state.detail]
    );

    if (!state.detail) return null;

    return (
      <Dialog open={state.open} onOpenChange={onClose}>
        <DialogContent className="w-full !max-w-none !min-w-none !h-full rounded-none flex flex-col">
          <DialogHeader>
            <DialogTitle>Combination Detail</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex flex-col gap-8 h-full overflow-hidden">
              <CombinationCard data={state.detail} showExecutionTime />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <h2 className="font-medium">
                    Numbere series ({state.detail.numberSeries?.length})
                  </h2>

                  {isArrayMoreThan(state.detail.numberSeries, 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8"
                      onClick={() => copyToClipboard(stringNumberSeries)}
                    >
                      <ClipboardCopyIcon className="size-4 text-gray-600" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 max-h-[250px] overflow-y-auto">
                  {state.detail.numberSeries?.map((n, i) => (
                    <NumberBox key={i} data={n} />
                  ))}
                </div>
              </div>

              {result.length > 0 && (
                <div className="flex-1 overflow-hidden">
                  <div className="flex flex-col gap-4 h-full">
                    <h2 className="font-medium flex-none">
                      Combination result ({state.detail?.combinationResultCount}
                      )
                    </h2>

                    <div className="flex flex-col h-full gap-2 overflow-auto">
                      {result.map((item, i) => (
                        <div
                          key={i}
                          className="p-3 border group rounded-md hover:bg-gray-50 transition-colors flex flex-col gap-2"
                        >
                          <div className="flex gap-2 items-center">
                            <div className="text-xs group-hover:bg-black group-hover:text-white tabular-nums bg-gray-50 rounded-full group-hover:border-black border px-2 transition-colors">
                              {i + 1}
                            </div>{" "}
                            ~{" "}
                            <div className="tabular-nums text-xs">
                              {item.length}
                            </div>
                            {isArrayMoreThan(item, 0) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8"
                                onClick={() =>
                                  copyToClipboard(getStringCombinationResult(i))
                                }
                              >
                                <ClipboardCopyIcon className="size-4 text-gray-600" />
                              </Button>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {item.map((n, i) => (
                              <NumberBox key={i} data={n} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your combination data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

const NumberBox = ({ data }: { data: number }) => {
  return (
    <div className="border bg-white px-2 py-1 tabular-nums text-xs rounded-sm">
      {data}
    </div>
  );
};

export { CombinationDetailDialog };
