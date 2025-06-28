export const TramitadorContractsPage = () => {
    return `
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="jumbotron bg-info text-white p-5 rounded mb-4">
              <h1 class="display-4">Gestión de Contratos</h1>
              <p class="lead">Panel de tramitación para gestionar el estado de los contratos enviados.</p>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header">
                <h5 class="mb-0">Contratos Pendientes</h5>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>CUPS</th>
                        <th>Proveedor</th>
                        <th>Estado</th>
                        <th>Fecha Envío</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colspan="6" class="text-center text-muted py-4">
                          <i class="fas fa-file-contract fa-3x mb-3"></i>
                          <p>No hay contratos pendientes de tramitación.</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
};