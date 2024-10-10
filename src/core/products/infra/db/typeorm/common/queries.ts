const postgresBaseQuery = (tableName: string) => `
EXISTS (
  SELECT 1
  FROM json_array_elements("${tableName}"."reservationPeriods") AS period
  WHERE (
    ((period ->> 'startDate')::timestamp <= :startDate::timestamp AND (period ->> 'endDate')::timestamp >= :endDate::timestamp)
    OR (period ->> 'startDate')::timestamp BETWEEN :startDate::timestamp AND :endDate::timestamp
    OR (period ->> 'endDate')::timestamp BETWEEN :startDate::timestamp AND :endDate::timestamp
  )
)`;

export function getNotAvailableForPeriodQuery(
  dbType: string,
  tableName: string,
): string {
  if (dbType === "postgres") {
    return postgresBaseQuery(tableName);
  }
  throw new Error("Unsupported database type");
}

export function getAvailableForPeriodQuery(
  dbType: string,
  tableName: string,
): string {
  if (dbType === "postgres") {
    return `NOT ${postgresBaseQuery(tableName)}`;
  }
  throw new Error("Unsupported database type");
}
