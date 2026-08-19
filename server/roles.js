export const ROLE_ID = { admin: 1, empleado: 2, usuario: 3 }

export const ROLE_LABELS = {
  admin: 'Administrador',
  empleado: 'Empleado/Encargado',
  usuario: 'Usuario',
}

export function roleFromId(roleId) {
  const id = Number(roleId)
  if (id === 1) return 'admin'
  if (id === 2) return 'empleado'
  return 'usuario'
}

export const ROLE_SQL = `CASE role_id WHEN 1 THEN 'admin' WHEN 2 THEN 'empleado' ELSE 'usuario' END`
