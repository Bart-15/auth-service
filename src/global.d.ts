declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // ENV variables here such as AWS_ACCESS_KEY_ID: string, etc...
      AUTH0_CLIENT_ID: string;
      AUTH0_PUBLIC_KEY: string;
    }
  }
}
