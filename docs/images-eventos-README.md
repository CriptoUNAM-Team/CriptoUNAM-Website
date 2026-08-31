# Imágenes de eventos (Home – Eventos anteriores)

Coloca **una imagen por evento** en `public/images/eventos/` para el carrusel de la Home. Nombres esperados (o actualiza la ruta en `src/data/eventosData.ts`):

| Archivo | Evento |
|---------|--------|
| `01-taller-mi-primer-wallet-2024.jpg` | Taller "Mi primer wallet" UNAM 2024 |
| `02-workshop-defi-fundamentals-2024.jpg` | Workshop: DeFi Fundamentals |
| `03-bitcoin-day-2024.jpg` | Bitcoin Day |
| `04-meetup-nft-arte-digital-2024.jpg` | Meetup: NFT y Arte Digital |

- **Formato recomendado:** JPG o WebP, relación 16:9 o similar (ej. 1200×675 px).
- Si usas otro nombre, edita la propiedad `image` del evento en `src/data/eventosData.ts`.
- Si falta la imagen, el carrusel mostrará el logo de CriptoUNAM como respaldo.
