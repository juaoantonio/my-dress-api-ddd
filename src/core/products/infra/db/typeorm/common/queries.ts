export function getNotAvailableForPeriodQuery(
  dbType: string,
  tableName: string,
): string {
  if (dbType === "postgres") {
    return `
      EXISTS (SELECT 1
              FROM json_array_elements("${tableName}"."reservationPeriods") AS period
              WHERE (
                  ((period ->> 'startDate')::timestamp <= :startDate AND
                   (period ->> 'endDate')::timestamp >= :endDate))
                 OR ((period ->> 'startDate')::timestamp > :startDate AND
                     :endDate BETWEEN (period ->> 'startDate')::timestamp AND (period ->> 'endDate')::timestamp)
                 OR ((period ->> 'endDate')::timestamp < :endDate AND
                     :startDate BETWEEN (period ->> 'startDate')::timestamp AND (period ->> 'endDate')::timestamp)
                 OR ((period ->> 'startDate')::timestamp > :startDate AND
                     (period ->> 'endDate')::timestamp < :endDate)
              )`;
  } else if (dbType === "sqlite") {
    return `
      EXISTS (
        SELECT 1
        FROM json_each(${tableName}.reservationPeriods) AS period
        WHERE
          (json_extract(period.value, '$.startDate') <= :endDate
          AND json_extract(period.value, '$.endDate') >= :startDate)
          OR (json_extract(period.value, '$.startDate') > :startDate
          AND :endDate BETWEEN json_extract(period.value, '$.startDate') AND json_extract(period.value, '$.endDate'))
          OR (json_extract(period.value, '$.endDate') < :endDate
          AND :startDate BETWEEN json_extract(period.value, '$.startDate') AND json_extract(period.value, '$.endDate'))
          OR (json_extract(period.value, '$.startDate') > :startDate
          AND json_extract(period.value, '$.endDate') < :endDate)
      )`;
  } else {
    throw new Error("Unsupported database type");
  }
}

export function getAvailableForPeriodQuery(
  dbType: string,
  tableName: string,
): string {
  if (dbType === "postgres") {
    return `
      NOT EXISTS (SELECT 1
              FROM json_array_elements("${tableName}"."reservationPeriods") AS period
              WHERE (
                  ((period ->> 'startDate')::timestamp <= :startDate AND
                   (period ->> 'endDate')::timestamp >= :endDate))
                 OR ((period ->> 'startDate')::timestamp > :startDate AND
                     :endDate BETWEEN (period ->> 'startDate')::timestamp AND (period ->> 'endDate')::timestamp)
                 OR ((period ->> 'endDate')::timestamp < :endDate AND
                     :startDate BETWEEN (period ->> 'startDate')::timestamp AND (period ->> 'endDate')::timestamp)
                 OR ((period ->> 'startDate')::timestamp > :startDate AND
                     (period ->> 'endDate')::timestamp < :endDate)
              )
      `;
  } else if (dbType === "sqlite") {
    return `
      NOT EXISTS (
        SELECT 1
        FROM json_each(${tableName}.reservationPeriods) AS period
        WHERE
          (json_extract(period.value, '$.startDate') <= :endDate
          AND json_extract(period.value, '$.endDate') >= :startDate)
          OR (json_extract(period.value, '$.startDate') > :startDate
          AND :endDate BETWEEN json_extract(period.value, '$.startDate') AND json_extract(period.value, '$.endDate'))
          OR (json_extract(period.value, '$.endDate') < :endDate
          AND :startDate BETWEEN json_extract(period.value, '$.startDate') AND json_extract(period.value, '$.endDate'))
          OR (json_extract(period.value, '$.startDate') > :startDate
          AND json_extract(period.value, '$.endDate') < :endDate)
      )`;
  } else {
    throw new Error("Unsupported database type");
  }
}
