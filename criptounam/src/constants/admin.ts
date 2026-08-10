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
// que el gating por dirección ya no identifica a los organizadores. Se admite
// además un allowlist de emails, configurable por env (VITE_ADMIN_EMAILS,
// coma-separado). Reutilizado por el panel del hackathon.
const ENV_ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || '';
export const ADMIN_EMAILS = ENV_ADMIN_EMAILS
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

// Función para verificar si una wallet es admin
export const isAdminWallet = (walletAddress: string): boolean => {
  if (!walletAddress) return false;

  const normalizedAddress = walletAddress.toLowerCase();
  return ADMIN_WALLETS.includes(normalizedAddress);
};

// Función para verificar si un email es admin
export const isAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
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