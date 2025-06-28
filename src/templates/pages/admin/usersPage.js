import { escapeHTML } from '../../../utils/utils.js';

export const AdminUsersPage = (users = [], roles = [], message = null) => {
    const messageHtml = message ? `<div class="alert alert-info">${escapeHTML(message)}</div>` : '';

    const roleOptions = roles
        .filter(r => r.name !== 'superadmin' && r.name !== 'admin')
        .map(r => `<option value="${r.id}">${escapeHTML(r.name)}</option>`)
        .join('');

    const userRows = users.map(u => `
        <tr>
            <td>${escapeHTML(u.full_name || 'N/A')}</td>
            <td>${escapeHTML(u.role?.name || 'N/A')}</td>
            <td><span class="badge bg-success">Activo</span></td>
            <td>
                <button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-danger">Desactivar</button>
            </td>
        </tr>
    `).join('');

    return `
        ${messageHtml}
        <div class="row">
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Crear Nuevo Usuario</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="/admin/users?action=create_user">
                            <div class="mb-3">
                                <label for="full_name" class="form-label">Nombre Completo</label>
                                <input type="text" id="full_name" name="full_name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" id="email" name="email" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña</label>
                                <input type="password" id="password" name="password" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="role_id" class="form-label">Rol</label>
                                <select id="role_id" name="role_id" class="form-select" required>
                                    <option value="">Selecciona un rol...</option>
                                    ${roleOptions}
                                </select>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Crear Usuario</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Usuarios del Negocio</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Rol</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${userRows.length > 0 ? userRows : `<tr><td colspan="4" class="text-center text-muted">No hay usuarios registrados.</td></tr>`}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};