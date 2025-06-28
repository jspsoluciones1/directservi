import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authRoutes } from './routes/auth.js';
import { superadminRoutes } from './routes/superadmin.js';
import { adminRoutes } from './routes/admin.js';
import { vendedorRoutes } from './routes/vendedor.js';
import { tramitadorRoutes } from './routes/tramitador.js';
import { createSupabaseClient, getUserProfile } from './services/supabase.js';
import { Layout } from './templates/layout.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/static', express.static(join(__dirname, '../public')));

// Middleware para agregar Supabase client a req
app.use(async (req, res, next) => {
  req.supabase = createSupabaseClient(req, res);
  
  // Obtener usuario actual
  const { data: { user } } = await req.supabase.auth.getUser();
  req.user = user;
  
  if (user) {
    req.userProfile = await getUserProfile(req.supabase, user.id);
  }
  
  next();
});

// Mapa de rutas para redirecciones por rol
const ROLE_DASHBOARDS = {
  superadmin: '/superadmin/dashboard',
  admin: '/admin/dashboard',
  vendedor: '/vendedor/proposals',
  tramitador: '/tramitador/contracts',
};

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  if (!req.user || !req.userProfile) {
    return res.redirect('/login?error=Debes+iniciar+sesión');
  }
  next();
};

// Middleware de autorización por rol
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.userProfile || !roles.includes(req.userProfile.role_name)) {
      const defaultDashboard = ROLE_DASHBOARDS[req.userProfile?.role_name] || '/login';
      return res.redirect(defaultDashboard);
    }
    next();
  };
};

// Ruta raíz - redirección inteligente
app.get('/', (req, res) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  const dashboard = ROLE_DASHBOARDS[req.userProfile?.role_name] || '/login';
  res.redirect(dashboard);
});

// Rutas de autenticación
app.use('/', authRoutes);

// Rutas protegidas por rol
app.use('/superadmin', requireAuth, requireRole(['superadmin']), superadminRoutes);
app.use('/admin', requireAuth, requireRole(['admin']), adminRoutes);
app.use('/vendedor', requireAuth, requireRole(['vendedor']), vendedorRoutes);
app.use('/tramitador', requireAuth, requireRole(['tramitador']), tramitadorRoutes);

// Manejo de errores 404
app.use((req, res) => {
  const content = `
    <div class="text-center">
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe.</p>
      <a href="/" class="btn btn-primary">Volver al inicio</a>
    </div>
  `;
  res.status(404).send(Layout('Error 404', content, req.userProfile));
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  const content = `
    <div class="text-center">
      <h2>Error interno del servidor</h2>
      <p>Ha ocurrido un error inesperado.</p>
      <a href="/" class="btn btn-primary">Volver al inicio</a>
    </div>
  `;
  res.status(500).send(Layout('Error 500', content, req.userProfile));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Comparador de Tarifas Energéticas - Multi-tenant`);
});