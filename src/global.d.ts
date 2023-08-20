type Class<T = any> = { new (): T };

namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    MONGO_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_LIFE_TIME: `${number}${string}`;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_LIFE_TIME: `${number}${string}`;
    COOKIE_SECRET: string;
    CLIENT_URL: string;
    NODE_ENV: 'dev' | 'prod';
    ADMIN_USERNAME: string;
    ADMIN_PASSWORD: string;
  }
}
