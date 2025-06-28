import { escapeHTML } from '../../../utils/utils.js';

export const VendedorProposalsPage = (proposals = []) => {
    const proposalRows = proposals.map(p => {
        const createdDate = new Date(p.created_at).toLocaleDateString();
        const statusBadge = p.status === 'draft' ? 'bg-secondary' : 
                           p.status === 'sent' ? 'bg-primary' : 
                           p.status === 'accepted' ? 'bg-success' : 'bg-warning';
        
        return `
            <tr>
                <td><strong>${escapeHTML(p.client_name)}</strong></td>
                <td>${escapeHTML(p.client_cups || 'N/A')}</td>
                <td>${createdDate}</td>
                <td><span class="badge ${statusBadge}">${escapeHTML(p.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="generateProposalPDF(${escapeHTML(JSON.stringify(p))})">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button class="btn btn-sm btn-success">
                        <i class="fas fa-envelope"></i> Enviar
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    return `
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Mis Propuestas</h2>
                    <a href="/vendedor/comparator" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Nueva Propuesta
                    </a>
                </div>
                
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>CUPS</th>
                                        <th>Fecha</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${proposalRows.length > 0 ? proposalRows : `
                                        <tr>
                                            <td colspan="5" class="text-center text-muted py-4">
                                                <i class="fas fa-file-alt fa-3x mb-3"></i>
                                                <p>No tienes propuestas aún.</p>
                                                <a href="/vendedor/comparator" class="btn btn-primary">Crear primera propuesta</a>
                                            </td>
                                        </tr>
                                    `}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};