import { shout } from "./lib/impl";

export function greet(name: string): string {
  return shout(`hello, ${name}`);
}
