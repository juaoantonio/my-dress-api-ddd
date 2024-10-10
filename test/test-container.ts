import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";

class PostgresTestContainerSingleton {
  private static instance: StartedPostgreSqlContainer | null = null;

  public static async getInstance(): Promise<StartedPostgreSqlContainer> {
    if (!PostgresTestContainerSingleton.instance) {
      PostgresTestContainerSingleton.instance =
        await new PostgreSqlContainer().start();
    }
    return PostgresTestContainerSingleton.instance;
  }

  public static async stop(): Promise<void> {
    if (PostgresTestContainerSingleton.instance) {
      await PostgresTestContainerSingleton.instance.stop();
      PostgresTestContainerSingleton.instance = null;
    }
  }
}

export default PostgresTestContainerSingleton;
