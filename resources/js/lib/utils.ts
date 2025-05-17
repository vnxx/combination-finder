import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readableMilliseconds(milliseconds: number) {
  if (milliseconds < 1000) {
    return `${(milliseconds / 1000).toFixed(1)}s`;
  }
  const seconds = (milliseconds / 1000).toFixed(1);
  return `${seconds}s`;
}

export function isArrayMoreThan(arr: any[] | undefined | null, length: number) {
  if (!arr) return false;
  if (arr.length <= length) return false;
  return arr.length > length;
}
