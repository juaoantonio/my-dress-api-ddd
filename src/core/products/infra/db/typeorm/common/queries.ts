// clutch.typeorm-repository.helpers.ts

/**
 * Retorna a condição SQL para disponibilidade com base no driver e no valor de 'available'.
 * @param dbType Tipo do banco de dados (e.g., 'postgres', 'sqlite')
 * @param alias Alias da tabela (e.g., 'clutch')
 * @param available Booleano indicando se deve filtrar clutches disponíveis (true) ou indisponíveis (false)
 */
export function getAvailabilityCondition(
  dbType: string,
  alias: string,
  available: boolean,
): string {
  const existsCondition = `
    EXISTS (
      SELECT 1
      FROM ${
        dbType === "postgres" ? "json_array_elements" : "json_each"
      }(${alias}.reservationPeriods) AS period
      WHERE (
        ${
          dbType === "postgres"
            ? "(period->>'startDate')::timestamptz <= :endDate AND (period->>'endDate')::timestamptz >= :startDate"
            : "json_extract(value, '$.startDate') <= :endDate AND json_extract(value, '$.endDate') >= :startDate"
        }
        OR 
        ${
          dbType === "postgres"
            ? "(period->>'startDate')::timestamptz BETWEEN :startDate AND :endDate"
            : "json_extract(value, '$.startDate') BETWEEN :startDate AND :endDate"
        }
        OR 
        ${
          dbType === "postgres"
            ? "(period->>'endDate')::timestamptz BETWEEN :startDate AND :endDate"
            : "json_extract(value, '$.endDate') BETWEEN :startDate AND :endDate"
        }
      )
    )
  `;

  if (available) {
    return `NOT ${existsCondition}`;
  } else {
    return existsCondition;
  }
}
