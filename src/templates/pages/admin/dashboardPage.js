export const AdminDashboardPage = (userProfile) => {
    const businessName = userProfile?.business?.name || 'su negocio';
    
    return `
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="jumbotron bg-primary text-white p-5 rounded mb-4">
              <h1 class="display-4">Dashboard de Administrador</h1>
              <p class="lead">Gestione los usuarios, tarifas y configuración de ${businessName}.</p>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-3 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-users fa-3x text-primary mb-3"></i>
                <h5 class="card-title">Usuarios</h5>
                <p class="card-text">Gestione vendedores y tramitadores.</p>
                <a href="/admin/users" class="btn btn-primary">Acceder</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-building fa-3x text-success mb-3"></i>
                <h5 class="card-title">Proveedores</h5>
                <p class="card-text">Administre proveedores energéticos.</p>
                <a href="/admin/providers" class="btn btn-success">Acceder</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-euro-sign fa-3x text-warning mb-3"></i>
                <h5 class="card-title">Tarifas</h5>
                <p class="card-text">Configure tarifas y precios.</p>
                <a href="/admin/rates" class="btn btn-warning">Acceder</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-3 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-palette fa-3x text-info mb-3"></i>
                <h5 class="card-title">Apariencia</h5>
                <p class="card-text">Personalice colores y logo.</p>
                <a href="/admin/styles" class="btn btn-info">Acceder</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
};