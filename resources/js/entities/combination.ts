import { Operator } from "@/enums/operator";

export class CombinationEntity {
  id!: number;

  name?: string;

  target?: number;

  numberSeries?: number[];

  createdAt?: Date;

  operator?: Operator;

  combinationResult?: number[][];

  executionTime?: number; // milisecond

  constructor(data?: Partial<CombinationEntity>) {
    Object.assign(this, data);
  }

  get isFinished(): boolean {
    return this.combinationResult !== undefined;
  }
}
