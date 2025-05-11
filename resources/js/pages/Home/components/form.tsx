import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CombinationEntity } from "@/entities/combination";
import { Operator } from "@/enums/operator";
import { main_db } from "@/services/main_db";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const example = {
  target: "100",
  numbers:
    "50, 50, 40, 20, 10, 5, 5, 45.5, 54.5, 20.33, 79.67, 22.11, 33.33, 44.56",
};

const Form = () => {
  const [form, setForm] = useState({
    target: example.target,
    numbers: example.numbers,
    apply: true,
    submitting: false,
  });

  const setFormValue = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value, apply: false }));
  };

  const onChangeNumbers = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormValue("numbers", e.target.value);
  };

  const onReset = () => {
    setForm({
      target: "",
      numbers: "",
      apply: false,
      submitting: false,
    });
  };

  const onChangeTarget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();

    if (v !== "") {
      if (!/^\d+(\.\d+)?$/.test(v)) {
        return;
      }
    }

    const numberValue = Number(v);
    if (isNaN(numberValue)) {
      return;
    }

    if (numberValue < 0) {
      return;
    }

    setFormValue("target", v);
  };

  const isFormValid = useMemo(() => {
    return form.target !== "" && form.numbers !== "";
  }, [form]);

  const applyExampleToggle = () => {
    if (!form.apply) {
      setForm({
        numbers: example.numbers,
        target: example.target,
        apply: true,
        submitting: false,
      });
    } else {
      onReset();
    }
  };

  const validateForm = (): string | null => {
    if (form.target === "") {
      return "Target number is required";
    }

    if (form.numbers === "") {
      return "Numbers is required";
    }

    const numberArray = form.numbers
      .split(",")
      .filter((n) => n !== "")
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n));

    if (numberArray.length === 0) {
      return "Numbers is required";
    }

    return null;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      toast.error(error);
      return;
    }

    setForm((prev) => ({ ...prev, submitting: true }));

    const now = new Date();

    const numberSeries = form.numbers
      .split(",")
      .filter((n) => n !== "")
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n));

    const combinationEntity = new CombinationEntity({
      id: now.getTime(),
      target: Number(form.target),
      numberSeries,
      createdAt: now,
      operator: Operator.ADDITION,
    });

    let success = false;

    try {
      await main_db.combinations.add(combinationEntity);
      success = true;
    } catch (e) {
      toast.error("Something went wrong");
    }

    setForm((prev) => ({ ...prev, submitting: false }));

    if (!success) {
      return;
    }

    onReset();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-6 pt-8 rounded-md shadow-lg flex flex-col gap-4 w-full max-w-3xl mx-auto border"
    >
      <div className="flex gap-2 items-center">
        <Checkbox
          id="terms"
          checked={form.apply}
          onCheckedChange={applyExampleToggle}
          disabled={form.submitting}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Apply example
        </label>
      </div>

      <Input
        disabled={form.submitting}
        placeholder="x: 100"
        type="number"
        onChange={onChangeTarget}
        value={form.target}
      />

      <Textarea
        disabled={form.submitting}
        value={form.numbers}
        placeholder="Kombinasi bilangan: 50, 50, 40, ..."
        onChange={onChangeNumbers}
      />

      <div className="flex flex-col gap-2">
        <Button type="submit" disabled={!isFormValid || form.submitting}>
          Find Now!
        </Button>

        <Button
          disabled={form.submitting}
          type="button"
          onClick={onReset}
          variant="ghost"
        >
          Reset
        </Button>
      </div>
    </form>
  );
};

export { Form };
