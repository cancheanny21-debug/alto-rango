export const ROLE_ID = { admin: 2, empleado: 3, usuario: 4 }

export const ROLE_LABELS = {
  admin: 'Administrador',
  empleado: 'Empleado/Encargado',
  usuario: 'Usuario',
}

export function roleFromId(roleId) {
  const id = Number(roleId)
  if (id === 1 || id === 2) return 'admin'
  if (id === 3) return 'empleado'
  return 'usuario'
}

export const ROLE_SQL = `CASE role_id WHEN 1 THEN 'admin' WHEN 2 THEN 'admin' WHEN 3 THEN 'empleado' ELSE 'usuario' END`
