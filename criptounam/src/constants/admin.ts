// Configuración de administradores.
// Esta lista sólo abre la UI; los permisos reales viven on-chain (AccessControl).
// Mantenerla alineada con las wallets que sí tienen DEFAULT_ADMIN / DROP_MANAGER,
// o el panel promete accesos que la transacción luego rechaza.
export const ADMIN_WALLETS = [
  // Deployer: DEFAULT_ADMIN en PUMA, Badges y Drops (Fuji).
  '0x2101bB1CB94C5295244a0E6DfE74e390B45bd5fE'.toLowerCase(),
  // Antes vivía aquí 0x04BEf5…16217, del despliegue viejo en Ethereum. No tiene
  // ningún rol en los contratos de Fuji, así que abría el panel para luego
  // reventar al firmar con "AccessControl: ... is missing role". Si vuelve a
  // hacer falta una wallet aquí, otórgale primero los roles on-chain con
  // script/grant-admin-roles-fuji.sh.
];

// Con login por email (Privy), la wallet embebida tiene una dirección nueva, así
// que el gating por dirección no identifica a los organizadores: esos entran por
// correo. Esa allowlist NO vive aquí.
//
// Aquí estuvo `VITE_ADMIN_EMAILS`, y ese era el problema: Vite incrusta las
// variables `VITE_*` dentro de `assets/index-*.js`, así que estar en un `.env`
// no las hace secretas — cualquiera podía leer en el bundle los correos de los
// organizadores y saber a quién hacerle phishing para entrar al panel. Ahora la
// lista vive solo en el servidor (`ADMIN_EMAILS` en Vercel, sin prefijo) y el
// navegador pregunta por `/api/admin/lists?list=perfil`. Ver `useAdmin`.

// Función para verificar si una wallet es admin
export const isAdminWallet = (walletAddress: string): boolean => {
  if (!walletAddress) return false;

  const normalizedAddress = walletAddress.toLowerCase();
  return ADMIN_WALLETS.includes(normalizedAddress);
};

// Configuración de permisos de admin
export const ADMIN_PERMISSIONS = {
  CREATE_COURSE: true,
  EDIT_COURSE: true,
  DELETE_COURSE: true,
  CREATE_NEWSLETTER: true,
  EDIT_NEWSLETTER: true,
  DELETE_NEWSLETTER: true,
  CREATE_EVENT: true,
  EDIT_EVENT: true,
  DELETE_EVENT: true,
  CREATE_NOTIFICATION: true,
  EDIT_NOTIFICATION: true,
  DELETE_NOTIFICATION: true,
} as const;

// Tipos de permisos
export type AdminPermission = keyof typeof ADMIN_PERMISSIONS; 