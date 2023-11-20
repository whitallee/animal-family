import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringJoin(arrayStr: string[]) {
  let joined: string = "";
  arrayStr.forEach(str => {
      joined = joined + str;        
  });
  return (joined)
}