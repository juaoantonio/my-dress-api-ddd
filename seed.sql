DO
$$
    DECLARE
        tabela RECORD;
    BEGIN
        FOR tabela IN
                (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
            LOOP
                EXECUTE 'TRUNCATE TABLE ' || quote_ident(tabela.tablename) || ' CASCADE';
            END LOOP;
    END
$$;

INSERT INTO dresses (id, "imageUrl", "rentPrice", color, model, "isPickedUp", type, fabric)
VALUES ('f7e0e076-e10f-4306-b877-a5aeb412f367',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 120.00, 'Azul',
        'Longo', FALSE, 'dress', 'Seda'),
       ('50b3b1f4-479f-49f1-ba62-f991b5cf3b36',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 95.00, 'Verde',
        'Curto', FALSE, 'dress', 'Cetim'),
       ('18032160-60b3-4882-be72-8a43180d7b9f',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 110.00, 'Preto',
        'Midi', TRUE, 'dress', 'Veludo'),
       ('64e6e559-ccfa-43e5-b312-6a49d6616710',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 130.00, 'Rosa',
        'Longo', FALSE, 'dress', 'Chiffon'),
       ('9c1e4c6d-64eb-464d-b939-db53491ea0b2',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 105.00,
        'Branco', 'Tomara que Caia', TRUE, 'dress', 'Organza'),
       ('1bc75591-8363-4c35-a33a-52aff1d058c6',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 115.00,
        'Amarelo', 'Curto', FALSE, 'dress', 'Seda'),
       ('b8d23d1d-d07d-4020-9ac4-17f0f3cd7248',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 125.00,
        'Laranja', 'Midi', TRUE, 'dress', 'Cetim'),
       ('a20ca593-eb1a-49b2-afb8-89b14fb59b31',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 135.00, 'Vinho',
        'Longo', FALSE, 'dress', 'Veludo'),
       ('70abecac-58a6-418c-8740-84e455f52e3b',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 140.00, 'Prata',
        'Curto', FALSE, 'dress', 'Organza'),
       ('8a7368fe-f60c-483d-bfcf-583d7af36f37',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 150.00,
        'Dourado', 'Midi', TRUE, 'dress', 'Chiffon'),
       ('81f5ae15-d5d3-48d4-897c-600c2dcf9a3f',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 160.00, 'Lilás',
        'Tomara que Caia', FALSE, 'dress', 'Seda'),
       ('bd85cede-a901-4489-87de-2bfc96b79cdf',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 90.00, 'Cinza',
        'Longo', TRUE, 'dress', 'Cetim'),
       ('9a0aa885-1125-46fd-a9de-1ae41e241ec3',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 170.00, 'Roxo',
        'Midi', FALSE, 'dress', 'Veludo'),
       ('06bdffa9-104e-4882-9951-c4e095b6a584',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 180.00, 'Bordô',
        'Longo', TRUE, 'dress', 'Chiffon'),
       ('08f05733-0192-4cfb-92ad-14e396d61f2b',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 100.00,
        'Marrom', 'Tomara que Caia', FALSE, 'dress', 'Organza'),
       ('5d16d500-cd16-4d6e-ad8f-2a2b3614eaa5',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 95.00,
        'Rosa Claro', 'Curto', FALSE, 'dress', 'Seda'),
       ('0e6cd2f3-d101-4cc8-921c-fe993e990cb5',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 130.00,
        'Pérola', 'Midi', TRUE, 'dress', 'Cetim'),
       ('3b32e737-cb88-4505-86e2-4358364eb421',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 140.00,
        'Azul Claro', 'Longo', FALSE, 'dress', 'Veludo'),
       ('8be7b09c-2ef7-4355-8ecf-2018abbba774',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 125.00,
        'Champanhe', 'Curto', TRUE, 'dress', 'Organza'),
       ('31a3f3a9-2e5e-4bc1-af05-f6a930cfba95',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9eFVdKbD_PBvIkfjqB1DkBrEXzEjvHvpzdg&s', 150.00,
        'Verde Musgo', 'Midi', FALSE, 'dress', 'Chiffon');

INSERT INTO clutches (id, "imageUrl", "rentPrice", color, model, "isPickedUp", type)
VALUES ('92765182-77fb-5d7f-986b-8b3c347c7c99',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        55.00, 'Dourada', 'Com Alça', FALSE, 'clutch'),
       ('a3865182-88ec-6e8f-987b-9a3c347c7d88',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        60.00, 'Preta', 'Sem Alça', TRUE, 'clutch'),
       ('b4955182-99fd-7f9f-998b-ab3c347c7e88',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        45.00, 'Azul', 'Com Alça', FALSE, 'clutch'),
       ('c5a65182-a0fe-8f0f-999b-bc3c347c7f88',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        65.00, 'Vermelha', 'Sem Alça', TRUE, 'clutch'),
       ('8caab6ad-6a34-4851-8301-5beebfcc960c',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        52.00, 'Verde', 'Com Alça', FALSE, 'clutch'),
       ('03a47df0-2983-4935-aee6-67399f136b55',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        58.00, 'Rosa', 'Sem Alça', FALSE, 'clutch'),
       ('40fa6f98-e296-4393-aeb0-33a479320b4a',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        70.00, 'Branca', 'Com Alça', TRUE, 'clutch'),
       ('0ae05182-e4f2-2f4f-ad9b-f03c347c8388',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        48.00, 'Prateada', 'Sem Alça', FALSE, 'clutch'),
       ('1bf15182-f5f3-3f5f-ae9b-013c347c8488',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        55.00, 'Champanhe', 'Com Alça', TRUE, 'clutch'),
       ('3f961e50-4922-4130-b514-74b8879d718a',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        65.00, 'Grafite', 'Sem Alça', FALSE, 'clutch'),
       ('3f961e50-4922-4130-b514-74b8879d718b',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        60.00, 'Cinza', 'Sem Alça', FALSE, 'clutch'),
       ('3f961e50-4922-4130-b514-74b8879d718c',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        57.00, 'Marrom', 'Com Alça', TRUE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be971',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        68.00, 'Bege', 'Sem Alça', FALSE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be871',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        63.00, 'Lavanda', 'Com Alça', TRUE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be972',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        54.00, 'Verde Escuro', 'Sem Alça', FALSE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be961',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        70.00, 'Amarelo', 'Com Alça', TRUE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be962',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        50.00, 'Roxo', 'Sem Alça', FALSE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be963',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        62.00, 'Vermelho Escuro', 'Com Alça', FALSE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be967',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        69.00, 'Prateada', 'Sem Alça', TRUE, 'clutch'),
       ('5e83cbd3-8a3c-4c16-9c0a-6e22675be912',
        'https://ae01.alicdn.com/kf/S358207b2c7f34b0ab37552263094b956u/Crystal-Evening-Clutch-Bag-Bolsa-de-casamento-Festa-nupcial-do-baile-Sparkly-Jantar-Clutch-Bags-Rhinestone.jpg',
        67.00, 'Azul Claro', 'Com Alça', FALSE, 'clutch');

INSERT INTO bookings (id, "customerName", "eventDate", "expectedPickUpDate", "expectedReturnDate", "pickUpDate",
                      "returnDate", status, "amountPaid")
VALUES ('faf61a92-93b8-42cc-8298-1da888f640b4', 'João da Silva', '2024-12-01T00:00:00-03:00',
        '2024-11-29T00:00:00-03:00', '2024-12-02T00:00:00-03:00', NULL, NULL, 'READY', 0.00),
       ('c0e879ff-02a8-4e31-8a52-20569dcb6ab2', 'Maria Oliveira', '2024-12-15T00:00:00-03:00',
        '2024-12-13T00:00:00-03:00', '2024-12-16T00:00:00-03:00', NULL, NULL, 'IN_PROGRESS', 0.00),
       ('301a6f36-f35d-4c02-99ff-86f38e9b729c', 'Carlos Souza', '2024-12-20T00:00:00-03:00',
        '2024-12-18T00:00:00-03:00', '2024-12-21T00:00:00-03:00', NULL, NULL, 'NOT_INITIATED', 0.00),
       ('3dd8bdd7-f14d-4c02-889e-a44c1b3a69d8', 'Ana Santos', '2024-12-25T00:00:00-03:00', '2024-12-23T00:00:00-03:00',
        '2024-12-26T00:00:00-03:00', NULL, NULL, 'READY', 0.00),
       ('4877752a-4d6a-4f9a-9339-38fc3b457d30', 'Luiz Costa', '2024-12-30T00:00:00-03:00', '2024-12-28T00:00:00-03:00',
        '2025-01-02T00:00:00-03:00', NULL, NULL, 'IN_PROGRESS', 0.00),
       ('e479fc7e-df60-488a-bafa-e1a7c856730e', 'Patrícia Lima', '2025-01-05T00:00:00-03:00',
        '2025-01-03T00:00:00-03:00', '2025-01-06T00:00:00-03:00', NULL, NULL, 'NOT_INITIATED', 0.00),
       ('2436e1f1-2d9f-4f4d-a730-30563c366fe0', 'Roberto Alves', '2025-01-10T00:00:00-03:00',
        '2025-01-08T00:00:00-03:00', '2025-01-11T00:00:00-03:00', NULL, NULL, 'READY', 0.00),
       ('4afac0ca-14c3-48e8-9453-f71e31900df5', 'Fernanda Dias', '2025-01-15T00:00:00-03:00',
        '2025-01-13T00:00:00-03:00', '2025-01-16T00:00:00-03:00', NULL, NULL, 'IN_PROGRESS', 0.00),
       ('8bc4b380-89ef-4d5f-816e-750a82b2a826', 'Marcos Pereira', '2025-01-20T00:00:00-03:00',
        '2025-01-18T00:00:00-03:00', '2025-01-21T00:00:00-03:00', NULL, NULL, 'NOT_INITIATED', 0.00),
       ('9a0aa885-1125-46fd-a9de-1ae41e241ec3', 'Juliana Mendes', '2025-01-25T00:00:00-03:00',
        '2025-01-23T00:00:00-03:00', '2025-01-26T00:00:00-03:00', NULL, NULL, 'READY', 0.00),
       ('8296950b-19e1-48f0-ac88-8da7a90f0de8', 'Maria Mendes', '2025-01-25T00:00:00-03:00',
        '2025-01-23T00:00:00-03:00', '2025-01-26T00:00:00-03:00', NULL, NULL, 'COMPLETED', 0.00);

INSERT INTO dress_booking_item (id, "rentPrice", "isCourtesy", "dressId", "bookingId", adjustments)
VALUES ('1f1a2b3c-4d5e-6f78-9a0b-c1d2e3f4b5a6', 120.00, false, 'f7e0e076-e10f-4306-b877-a5aeb412f367',
        'faf61a92-93b8-42cc-8298-1da888f640b4', '[]'),
       ('9ae6c13e-8ff8-49e8-b500-dc61682e31ea', 95.00, false, '50b3b1f4-479f-49f1-ba62-f991b5cf3b36',
        'c0e879ff-02a8-4e31-8a52-20569dcb6ab2', '[]'),
       ('58662f7a-ce93-49e5-823e-31147c4e480c', 110.00, false, '18032160-60b3-4882-be72-8a43180d7b9f',
        '301a6f36-f35d-4c02-99ff-86f38e9b729c', '[]'),
       ('bf6d8a58-40e6-4e12-bda7-04b42226e41f', 130.00, false, '64e6e559-ccfa-43e5-b312-6a49d6616710',
        '3dd8bdd7-f14d-4c02-889e-a44c1b3a69d8', '[]'),
       ('2ecc1017-75c3-4b03-9737-88c03d2a6608', 105.00, false, '9c1e4c6d-64eb-464d-b939-db53491ea0b2',
        '4877752a-4d6a-4f9a-9339-38fc3b457d30', '[]'),
       ('83bb3b81-d644-4d5a-9574-66ff5e7f5cc1', 115.00, false, '1bc75591-8363-4c35-a33a-52aff1d058c6',
        'e479fc7e-df60-488a-bafa-e1a7c856730e', '[]'),
       ('3b2ef000-e2bf-4ce5-8c4f-557aab5c9dd3', 125.00, false, 'b8d23d1d-d07d-4020-9ac4-17f0f3cd7248',
        '2436e1f1-2d9f-4f4d-a730-30563c366fe0', '[]'),
       ('f2d24641-8ebe-487d-afef-43fa1f7e81f8', 135.00, false, 'a20ca593-eb1a-49b2-afb8-89b14fb59b31',
        '4afac0ca-14c3-48e8-9453-f71e31900df5', '[]'),
       ('bcf3ae83-06ed-425f-815f-010960a4001b', 140.00, false, '70abecac-58a6-418c-8740-84e455f52e3b',
        '8bc4b380-89ef-4d5f-816e-750a82b2a826', '[]'),
       ('a0b1c2d3-4e5f-6a7b-8c9d-0e1f2a3b4c5d', 150.00, false, '8a7368fe-f60c-483d-bfcf-583d7af36f37',
        '9a0aa885-1125-46fd-a9de-1ae41e241ec3', '[]');

INSERT INTO clutch_booking_item (id, "rentPrice", "isCourtesy", "clutchId", "bookingId")
VALUES ('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 55.00, false, '92765182-77fb-5d7f-986b-8b3c347c7c99',
        'faf61a92-93b8-42cc-8298-1da888f640b4'),
       ('a6d03200-97a6-435e-8373-9a8ee01a461a', 60.00, true, 'a3865182-88ec-6e8f-987b-9a3c347c7d88',
        'c0e879ff-02a8-4e31-8a52-20569dcb6ab2'),
       ('e730f058-b8b3-41e2-ad1a-d786e588b0ab', 45.00, false, 'b4955182-99fd-7f9f-998b-ab3c347c7e88',
        '301a6f36-f35d-4c02-99ff-86f38e9b729c'),
       ('4e0ee2a3-f5de-4dd5-9080-5dfcf0e0a77a', 65.00, true, 'c5a65182-a0fe-8f0f-999b-bc3c347c7f88',
        '3dd8bdd7-f14d-4c02-889e-a44c1b3a69d8'),
       ('c38116c5-ee81-492f-9f7b-aa1a41c56922', 52.00, false, '8caab6ad-6a34-4851-8301-5beebfcc960c',
        '4877752a-4d6a-4f9a-9339-38fc3b457d30'),
       ('171a899f-d853-49b7-ac35-dc5fa35e9b87', 58.00, true, '03a47df0-2983-4935-aee6-67399f136b55',
        'e479fc7e-df60-488a-bafa-e1a7c856730e'),
       ('2e7bff1a-67e4-40f0-bfb3-2974fccc6215', 70.00, false, '40fa6f98-e296-4393-aeb0-33a479320b4a',
        '2436e1f1-2d9f-4f4d-a730-30563c366fe0'),
       ('7c30b38a-122e-4330-a16f-2e4288fba66f', 48.00, false, '0ae05182-e4f2-2f4f-ad9b-f03c347c8388',
        '4afac0ca-14c3-48e8-9453-f71e31900df5'),
       ('9a019ad6-cd5b-4ca2-b938-7e2a0fe61918', 55.00, true, '1bf15182-f5f3-3f5f-ae9b-013c347c8488',
        '8bc4b380-89ef-4d5f-816e-750a82b2a826'),
       ('7e4821c3-a49c-43b9-b7dc-bbc466a2bfa9', 65.00, false, '3f961e50-4922-4130-b514-74b8879d718a',
        '9a0aa885-1125-46fd-a9de-1ae41e241ec3');
