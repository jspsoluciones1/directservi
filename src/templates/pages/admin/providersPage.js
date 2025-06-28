import { escapeHTML } from '../../../utils/utils.js';

export const AdminProvidersPage = (providers = [], message = null) => {
    const messageHtml = message ? `<div class="alert alert-info">${escapeHTML(message)}</div>` : '';

    const providerRows = providers.map(p => `
        <tr>
            <td>
                ${p.logo_url ? `<img src="${escapeHTML(p.logo_url)}" alt="Logo" style="height: 30px;">` : 'Sin logo'}
            </td>
            <td><strong>${escapeHTML(p.name)}</strong></td>
            <td>${escapeHTML(p.description || 'N/A')}</td>
            <td><span class="badge bg-success">Activo</span></td>
            <td>
                <button class="btn btn-sm btn-warning">Editar</button>
            </td>
        </tr>
    `).join('');

    return `
        ${messageHtml}
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Proveedores Energéticos</h5>
                        <button class="btn btn-primary btn-sm">Agregar Proveedor</button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Logo</th>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${providerRows.length > 0 ? providerRows : `<tr><td colspan="5" class="text-center text-muted">No hay proveedores registrados.</td></tr>`}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};