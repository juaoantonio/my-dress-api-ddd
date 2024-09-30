import { DataSource } from "typeorm";
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { Config } from "@core/@shared/infra/config";

export function setupTypeOrmForIntegrationTests(
  options?: Partial<SqliteConnectionOptions>,
) {
  let _dataSource: DataSource;

  beforeAll(async () => {
    _dataSource = new DataSource({
      ...(Config.database() as SqliteConnectionOptions),
      ...options,
    });
    await _dataSource.initialize();
  });

  beforeEach(async () => {
    await _dataSource.synchronize(true);
  });

  afterAll(async () => {
    await _dataSource.destroy();
  });

  return {
    get dataSource() {
      return _dataSource;
    },
  };
}
