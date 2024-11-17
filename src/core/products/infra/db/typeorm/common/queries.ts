/**
 * Retorna a condição SQL para disponibilidade com base no driver e no valor de 'available'.
 * @param dbType Tipo do banco de dados (e.g., 'postgres', 'sqlite')
 * @param alias Alias da tabela do produto (e.g., 'clutch' ou 'dress')
 * @param available Booleano indicando se deve filtrar itens disponíveis (true) ou indisponíveis (false)
 */
export function getAvailabilityCondition(
  dbType: string,
  alias: string,
  available: boolean,
): string {
  const existsCondition = `
    EXISTS (
      SELECT 1
      FROM "bookings" AS booking
      JOIN ${alias === "clutch" ? '"clutch_booking_item"' : '"dress_booking_item"'} AS booking_item
      ON booking_item."bookingId" = booking."id"
      WHERE booking_item."${alias}Id" = ${alias}."id"
      AND (
        ${
          dbType === "postgres"
            ? 'booking."expectedPickUpDate"::timestamptz <= :endDate AND booking."expectedReturnDate"::timestamptz >= :startDate'
            : "datetime(booking.expectedPickUpDate) <= :endDate AND datetime(booking.expectedReturnDate) >= :startDate"
        }
        OR 
        ${
          dbType === "postgres"
            ? 'booking."expectedPickUpDate"::timestamptz BETWEEN :startDate AND :endDate'
            : "datetime(booking.expectedPickUpDate) BETWEEN :startDate AND :endDate"
        }
        OR 
        ${
          dbType === "postgres"
            ? 'booking."expectedReturnDate"::timestamptz BETWEEN :startDate AND :endDate'
            : "datetime(booking.expectedReturnDate) BETWEEN :startDate AND :endDate"
        }
      )
      AND
      booking."status" NOT IN ('CANCELED', 'COMPLETED')
    )
  `;

  return available ? `NOT ${existsCondition}` : existsCondition;
}
