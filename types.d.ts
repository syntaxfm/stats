
declare module "linkedom/worker" {
  export function parseHTML(data: string): Window & typeof globalThis;
}
