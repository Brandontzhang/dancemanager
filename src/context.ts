import { PGDBDataSource } from "./datasources/db";

export type DataSourceContext = {
  dataSources: {
    db: PGDBDataSource;
  };
}
