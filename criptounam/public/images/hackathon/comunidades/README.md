# Logos de las comunidades aliadas

La marquesina "Comunidades aliadas" de la landing de Goya Hack lee esta carpeta.
Los nombres de archivo son los que declara `COMUNIDADES` en
`src/data/hackathonInfo.ts`:

| Archivo                  | Comunidad          |
| ------------------------ | ------------------ |
| `ethereum-mexico.png`    | Ethereum México    |
| `banda-web3.png`         | Banda Web3         |
| `cartagena-onchain.png`  | Cartagena Onchain  |
| `hello-world.png`        | Hello World        |
| `happ3n.png`             | Happ3n             |
| `la-blocka.png`          | La Blocka          |
| `mpc.png`                | MPC                |

Mientras falte un archivo, la tarjeta muestra el nombre de la comunidad en
versalitas en vez de dejar un hueco roto, así que la cinta funciona igual.

Formato: PNG con fondo transparente, ancho ~500 px. La retícula normaliza todos
los logos a blanco con un filtro de silueta; si el archivo trae fondo claro
opaco en vez de transparencia, márcalo con `fondoOpaco: true` en la lista.
