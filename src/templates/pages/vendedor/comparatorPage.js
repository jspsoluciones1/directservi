import { escapeHTML } from '../../../utils/utils.js';

export const VendedorComparatorPage = (rates = [], clientData = null, comparison = null, proposal = null, error = null) => {
    const errorHtml = error ? `<div class="alert alert-danger">${escapeHTML(error)}</div>` : '';
    
    // Si hay resultados de comparación, mostrar los resultados
    if (comparison && comparison.length > 0) {
        const resultsHtml = comparison.map((result, index) => {
            const isRecommended = index === 0; // El primer resultado es el recomendado
            const cardClass = isRecommended ? 'tariff-card best-offer' : 'tariff-card';
            const badgeHtml = isRecommended ? '<span class="badge savings-badge text-white position-absolute top-0 end-0 m-2">RECOMENDADO</span>' : '';
            
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card ${cardClass} h-100 position-relative">
                        ${badgeHtml}
                        <div class="card-header text-center">
                            <h5 class="card-title">${escapeHTML(result.provider_name)}</h5>
                            <p class="card-text text-muted">${escapeHTML(result.tariff_name)}</p>
                        </div>
                        <div class="card-body text-center">
                            <h3 class="text-primary">${result.monthly_cost.toFixed(2)}€</h3>
                            <p class="text-muted">por mes</p>
                            
                            <div class="mt-3">
                                <p class="mb-1"><strong>Ahorro anual:</strong></p>
                                <h4 class="text-success">${result.annual_savings.toFixed(2)}€</h4>
                            </div>
                            
                            <div class="mt-3">
                                <small class="text-muted">
                                    Coste anual: ${result.annual_cost.toFixed(2)}€
                                </small>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn btn-outline-primary btn-sm w-100">Ver detalles</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            ${errorHtml}
            <div class="row mb-4">
                <div class="col-12">
                    <div class="alert alert-success">
                        <h4><i class="fas fa-check-circle"></i> Comparación completada</h4>
                        <p>Se ha generado una propuesta para <strong>${escapeHTML(clientData.client_name)}</strong></p>
                        ${proposal ? `<p><small>ID de propuesta: ${proposal.id}</small></p>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="row mb-4">
                <div class="col-12">
                    <h3>Resultados de la Comparación</h3>
                    <p class="text-muted">Tarifas ordenadas por mejor ahorro para el cliente</p>
                </div>
            </div>
            
            <div class="row">
                ${resultsHtml}
            </div>
            
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <a href="/vendedor/comparator" class="btn btn-primary me-2">Nueva Comparación</a>
                    <a href="/vendedor/proposals" class="btn btn-outline-primary">Ver Todas las Propuestas</a>
                </div>
            </div>
        `;
    }

    // Formulario de comparación
    return `
        ${errorHtml}
        <div class="row">
            <div class="col-12">
                <div class="card shadow-sm">
                    <div class="card-header">
                        <h5 class="mb-0">Comparador de Tarifas Energéticas</h5>
                    </div>
                    <div class="card-body">
                        <form method="POST" action="/vendedor/comparator">
                            <div class="row">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">Datos del Cliente</h6>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="client_name" class="form-label">Nombre del Cliente *</label>
                                    <input type="text" id="client_name" name="client_name" class="form-control" required
                                           value="${escapeHTML(clientData?.client_name || '')}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="client_cups" class="form-label">CUPS</label>
                                    <input type="text" id="client_cups" name="client_cups" class="form-control"
                                           value="${escapeHTML(clientData?.client_cups || '')}">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="client_cif_dni" class="form-label">CIF/DNI</label>
                                    <input type="text" id="client_cif_dni" name="client_cif_dni" class="form-control"
                                           value="${escapeHTML(clientData?.client_cif_dni || '')}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="client_phone" class="form-label">Teléfono</label>
                                    <input type="tel" id="client_phone" name="client_phone" class="form-control"
                                           value="${escapeHTML(clientData?.client_phone || '')}">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="client_email" class="form-label">Email</label>
                                    <input type="email" id="client_email" name="client_email" class="form-control"
                                           value="${escapeHTML(clientData?.client_email || '')}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="client_address" class="form-label">Dirección</label>
                                    <input type="text" id="client_address" name="client_address" class="form-control"
                                           value="${escapeHTML(clientData?.client_address || '')}">
                                </div>
                            </div>
                            
                            <hr class="my-4">
                            
                            <div class="row">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">Datos de la Factura Actual</h6>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="access_type" class="form-label">Tipo de Acceso *</label>
                                    <select id="access_type" name="access_type" class="form-select" required>
                                        <option value="">Selecciona...</option>
                                        <option value="2.0TD" ${clientData?.access_type === '2.0TD' ? 'selected' : ''}>2.0TD</option>
                                        <option value="3.0TD" ${clientData?.access_type === '3.0TD' ? 'selected' : ''}>3.0TD</option>
                                        <option value="6.1TD" ${clientData?.access_type === '6.1TD' ? 'selected' : ''}>6.1TD</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="client_segment" class="form-label">Segmento *</label>
                                    <select id="client_segment" name="client_segment" class="form-select" required>
                                        <option value="">Selecciona...</option>
                                        <option value="domestico" ${clientData?.client_segment === 'domestico' ? 'selected' : ''}>Doméstico</option>
                                        <option value="comercial" ${clientData?.client_segment === 'comercial' ? 'selected' : ''}>Comercial</option>
                                        <option value="industrial" ${clientData?.client_segment === 'industrial' ? 'selected' : ''}>Industrial</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="input_dias_facturados" class="form-label">Días Facturados</label>
                                    <input type="number" id="input_dias_facturados" name="input_dias_facturados" class="form-control" 
                                           value="${clientData?.input_dias_facturados || 30}" min="1" max="365">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="input_importe_total_factura" class="form-label">Importe Total Factura (€)</label>
                                    <input type="number" step="0.01" id="input_importe_total_factura" name="input_importe_total_factura" 
                                           class="form-control" value="${clientData?.input_importe_total_factura || ''}">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">Potencias Contratadas (kW)</h6>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p1" class="form-label">P1</label>
                                    <input type="number" step="0.001" id="potencia_p1" name="potencia_p1" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p1 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p2" class="form-label">P2</label>
                                    <input type="number" step="0.001" id="potencia_p2" name="potencia_p2" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p2 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p3" class="form-label">P3</label>
                                    <input type="number" step="0.001" id="potencia_p3" name="potencia_p3" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p3 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p4" class="form-label">P4</label>
                                    <input type="number" step="0.001" id="potencia_p4" name="potencia_p4" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p4 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p5" class="form-label">P5</label>
                                    <input type="number" step="0.001" id="potencia_p5" name="potencia_p5" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p5 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="potencia_p6" class="form-label">P6</label>
                                    <input type="number" step="0.001" id="potencia_p6" name="potencia_p6" class="form-control"
                                           value="${clientData?.input_potencias_contratadas_kw?.potencia_p6 || ''}">
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">Consumos de Energía (kWh)</h6>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p1" class="form-label">P1</label>
                                    <input type="number" step="0.001" id="energia_p1" name="energia_p1" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p1 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p2" class="form-label">P2</label>
                                    <input type="number" step="0.001" id="energia_p2" name="energia_p2" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p2 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p3" class="form-label">P3</label>
                                    <input type="number" step="0.001" id="energia_p3" name="energia_p3" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p3 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p4" class="form-label">P4</label>
                                    <input type="number" step="0.001" id="energia_p4" name="energia_p4" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p4 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p5" class="form-label">P5</label>
                                    <input type="number" step="0.001" id="energia_p5" name="energia_p5" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p5 || ''}">
                                </div>
                                <div class="col-md-2 mb-3">
                                    <label for="energia_p6" class="form-label">P6</label>
                                    <input type="number" step="0.001" id="energia_p6" name="energia_p6" class="form-control"
                                           value="${clientData?.input_consumos_energia_kwh?.energia_p6 || ''}">
                                </div>
                            </div>
                            
                            <div class="row mt-4">
                                <div class="col-12 text-center">
                                    <button type="submit" class="btn btn-primary btn-lg">
                                        <i class="fas fa-calculator"></i> Calcular Comparación
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
};