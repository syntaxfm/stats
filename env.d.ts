declare global {
  namespace NodeJS {
    interface ProcessEnv {
      D1: D1Database
    }
  }
}

declare global {
  interface CloudflareEnv {
    D1: D1Database
  }
}



export { }
