export const SuperAdminDashboardPage = () => {
    return `
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="jumbotron bg-primary text-white p-5 rounded mb-4">
              <h1 class="display-4">Bienvenido, Superadmin</h1>
              <p class="lead">Desde este panel podrá gestionar canales, compañías y usuarios de toda la plataforma.</p>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-building fa-3x text-primary mb-3"></i>
                <h5 class="card-title">Gestión de Negocios</h5>
                <p class="card-text">Administre compañías y negocios del sistema.</p>
                <a href="/superadmin/businesses" class="btn btn-primary">Acceder</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-users fa-3x text-success mb-3"></i>
                <h5 class="card-title">Gestión de Admins</h5>
                <p class="card-text">Cree y administre usuarios administradores.</p>
                <a href="/superadmin/users" class="btn btn-success">Acceder</a>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body text-center">
                <i class="fas fa-chart-bar fa-3x text-info mb-3"></i>
                <h5 class="card-title">Estadísticas</h5>
                <p class="card-text">Vea estadísticas globales del sistema.</p>
                <a href="#" class="btn btn-info">Próximamente</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
};