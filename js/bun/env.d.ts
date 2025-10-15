declare module "bun" {
  interface Env {
    BASE_URL: string;
    DASHBOARD_BASE_URL: string;

    DATABASE_URL: string;
    DIRECT_URL: string;
  }
}
