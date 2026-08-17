import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { isAdminWallet, ADMIN_PERMISSIONS, type AdminPermission } from '../constants/admin';
import { apiFetch } from '../services/apiClient';

/**
 * Consulta al servidor si la sesión abierta es de organizador.
 *
 * La allowlist de correos vive solo en Vercel (`ADMIN_EMAILS`), nunca en el
 * bundle, así que la respuesta tiene que venir de la API. Se cachea por sesión
 * porque el Navbar, el layout del hackathon y la propia página llaman a
 * `useAdmin` en el mismo render y si no serían tres peticiones idénticas.
 *
 * Si la API no responde se asume "no organizador": el panel del hackathon no
 * funcionaría igualmente sin ella.
 */
let consulta: { clave: string; promesa: Promise<boolean> } | null = null;

function preguntarAlServidor(clave: string): Promise<boolean> {
  if (consulta?.clave === clave) return consulta.promesa;
  const promesa = apiFetch<{ isAdmin: boolean }>('/admin/lists', { query: { list: 'perfil' } })
    .then((res) => res.isAdmin === true)
    .catch(() => false);
  consulta = { clave, promesa };
  return promesa;
}

export const useAdmin = () => {
  const { walletAddress, isConnected, email } = useWallet();
  const [esOrganizador, setEsOrganizador] = useState(false);
  // Arranca en true con sesión abierta para que las pantallas cerradas muestren
  // el spinner y no un "acceso restringido" que se corrige medio segundo después.
  const [cargandoAdmin, setCargandoAdmin] = useState(isConnected);

  useEffect(() => {
    if (!isConnected) {
      setEsOrganizador(false);
      setCargandoAdmin(false);
      return;
    }

    let vigente = true;
    setCargandoAdmin(true);
    preguntarAlServidor((email || walletAddress || '').toLowerCase()).then((res) => {
      if (!vigente) return;
      setEsOrganizador(res);
      setCargandoAdmin(false);
    });
    return () => {
      vigente = false;
    };
  }, [isConnected, email, walletAddress]);

  // La wallet sigue abriendo el panel de PUMA, donde el permiso real es
  // on-chain (AccessControl) y la lista solo evita enseñar botones que la
  // transacción rechazaría. Los paneles con datos personales no dependen de
  // esto: su gate está en el servidor.
  const isAdmin = isConnected
    ? esOrganizador || (!!walletAddress && isAdminWallet(walletAddress))
    : false;

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!isAdmin) return false;
    return ADMIN_PERMISSIONS[permission] || false;
  };

  const canCreateCourse = hasPermission('CREATE_COURSE');
  const canEditCourse = hasPermission('EDIT_COURSE');
  const canDeleteCourse = hasPermission('DELETE_COURSE');

  const canCreateNewsletter = hasPermission('CREATE_NEWSLETTER');
  const canEditNewsletter = hasPermission('EDIT_NEWSLETTER');
  const canDeleteNewsletter = hasPermission('DELETE_NEWSLETTER');

  const canCreateEvent = hasPermission('CREATE_EVENT');
  const canEditEvent = hasPermission('EDIT_EVENT');
  const canDeleteEvent = hasPermission('DELETE_EVENT');

  const canCreateNotification = hasPermission('CREATE_NOTIFICATION');
  const canEditNotification = hasPermission('EDIT_NOTIFICATION');
  const canDeleteNotification = hasPermission('DELETE_NOTIFICATION');

  return {
    isAdmin,
    cargandoAdmin,
    walletAddress,
    isConnected,
    hasPermission,
    // Permisos específicos
    canCreateCourse,
    canEditCourse,
    canDeleteCourse,
    canCreateNewsletter,
    canEditNewsletter,
    canDeleteNewsletter,
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
    canCreateNotification,
    canEditNotification,
    canDeleteNotification,
  };
};
