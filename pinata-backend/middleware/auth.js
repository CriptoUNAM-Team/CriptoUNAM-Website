const ADMIN_WALLETS = [
  '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase(),
  // Agregar más wallets de admin aquí si es necesario
];

// Middleware para verificar si una wallet es admin
const isAdminWallet = (walletAddress) => {
  if (!walletAddress) return false;
  return ADMIN_WALLETS.includes(walletAddress.toLowerCase());
};

// Middleware para requerir autenticación de admin
const requireAdmin = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];
  
  if (!walletAddress) {
    return res.status(401).json({ 
      error: 'Acceso denegado: Se requiere wallet de administrador',
      message: 'Debes conectar tu wallet de administrador para realizar esta acción'
    });
  }
  
  if (!isAdminWallet(walletAddress)) {
    return res.status(403).json({ 
      error: 'Acceso denegado: Wallet no autorizada',
      message: 'Tu wallet no tiene permisos de administrador'
    });
  }
  
  // Agregar información de admin al request
  req.isAdmin = true;
  req.adminWallet = walletAddress;
  
  next();
};

// Middleware opcional para verificar admin (no bloquea si no es admin)
const optionalAdmin = (req, res, next) => {
  const walletAddress = req.headers['x-wallet-address'];
  
  if (walletAddress && isAdminWallet(walletAddress)) {
    req.isAdmin = true;
    req.adminWallet = walletAddress;
  } else {
    req.isAdmin = false;
  }
  
  next();
};

module.exports = {
  requireAdmin,
  optionalAdmin,
  isAdminWallet,
  ADMIN_WALLETS
}; 