import { escapeHTML } from '../../../utils/utils.js';

export const AdminRatesPage = (rates = [], providers = [], message = null) => {
    const messageHtml = message ? `<div class="alert alert-info">${escapeHTML(message)}</div>` : '';

    const providerOptions = providers.map(p =>
        `<option value="${p.id}">${escapeHTML(p.name)}</option>`
    ).join('');

    const rateRows = rates.map(r => `
        <tr>
            <td><strong>${escapeHTML(r.name)}</strong></td>
            <td>${escapeHTML(r.provider?.name || 'N/A')}</td>
            <td>${escapeHTML(r.access_type)}</td>
            <td>${escapeHTML(r.client_segment)}</td>
            <td><span class="badge ${r.is_active ? 'bg-success' : 'bg-secondary'}">${r.is_active ? 'Activa' : 'Inactiva'}</span></td>
            <td>
                <button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
        </tr>
    `).join('');

    return `
        ${messageHtml}
        <div class="row">
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Crear Nueva Tarifa</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="/admin/rates?action=create_rate">
                            <div class="mb-3">
                                <label for="provider_id" class="form-label">Proveedor</label>
                                <select id="provider_id" name="provider_id" class="form-select" required>
                                    <option value="">Selecciona un proveedor...</option>
                                    ${providerOptions}
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="name" class="form-label">Nombre de la Tarifa</label>
                                <input type="text" id="name" name="name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="access_type" class="form-label">Tipo de Acceso</label>
                                <select id="access_type" name="access_type" class="form-select" required>
                                    <option value="">Selecciona...</option>
                                    <option value="2.0TD">2.0TD</option>
                                    <option value="3.0TD">3.0TD</option>
                                    <option value="6.1TD">6.1TD</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="client_segment" class="form-label">Segmento de Cliente</label>
                                <select id="client_segment" name="client_segment" class="form-select" required>
                                    <option value="">Selecciona...</option>
                                    <option value="domestico">Doméstico</option>
                                    <option value="comercial">Comercial</option>
                                    <option value="industrial">Industrial</option>
                                </select>
                            </div>
                            
                            <h6>Precios de Potencia (€/kW/mes)</h6>
                            <div class="row">
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p1" class="form-control form-control-sm" placeholder="P1">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p2" class="form-control form-control-sm" placeholder="P2">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p3" class="form-control form-control-sm" placeholder="P3">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p4" class="form-control form-control-sm" placeholder="P4">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p5" class="form-control form-control-sm" placeholder="P5">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="potencia_p6" class="form-control form-control-sm" placeholder="P6">
                                </div>
                            </div>
                            
                            <h6>Precios de Energía (€/kWh)</h6>
                            <div class="row">
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p1" class="form-control form-control-sm" placeholder="P1">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p2" class="form-control form-control-sm" placeholder="P2">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p3" class="form-control form-control-sm" placeholder="P3">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p4" class="form-control form-control-sm" placeholder="P4">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p5" class="form-control form-control-sm" placeholder="P5">
                                </div>
                                <div class="col-6 mb-2">
                                    <input type="number" step="0.001" name="energia_p6" class="form-control form-control-sm" placeholder="P6">
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="comision_vendedor" class="form-label">Comisión Vendedor (%)</label>
                                <input type="number" step="0.01" id="comision_vendedor" name="comision_vendedor" class="form-control">
                            </div>
                            
                            <div class="mb-3 form-check">
                                <input type="checkbox" class="form-check-input" id="is_active" name="is_active" checked>
                                <label class="form-check-label" for="is_active">Tarifa activa</label>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100">Crear Tarifa</button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Tarifas Configuradas</h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Proveedor</th>
                                        <th>Tipo Acceso</th>
                                        <th>Segmento</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rateRows.length > 0 ? rateRows : `<tr><td colspan="6" class="text-center text-muted">No hay tarifas configuradas.</td></tr>`}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};