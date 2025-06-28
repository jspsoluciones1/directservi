import express from 'express';
import { LoginPage } from '../templates/pages/loginPage.js';
import { Layout } from '../templates/layout.js';
import { getUserProfile } from '../services/supabase.js';

const router = express.Router();

// Mapa de rutas para redirecciones por rol
const ROLE_DASHBOARDS = {
  superadmin: '/superadmin/dashboard',
  admin: '/admin/dashboard',
  vendedor: '/vendedor/proposals',
  tramitador: '/tramitador/contracts',
};

// Página de login
router.get('/login', (req, res) => {
  if (req.user) {
    const dashboard = ROLE_DASHBOARDS[req.userProfile?.role_name] || '/login';
    return res.redirect(dashboard);
  }
  
  const error = req.query.error;
  const content = LoginPage(error);
  res.send(Layout('Iniciar Sesión', content, null));
});

// Procesar login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await req.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const content = LoginPage(error.message);
      return res.status(401).send(Layout('Error de Login', content, null));
    }

    const loggedInUserProfile = await getUserProfile(req.supabase, data.user.id);
    const dashboardUrl = ROLE_DASHBOARDS[loggedInUserProfile?.role_name] || '/login';
    
    res.redirect(dashboardUrl);
  } catch (error) {
    console.error('Login error:', error);
    const content = LoginPage('Error interno del servidor');
    res.status(500).send(Layout('Error de Login', content, null));
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    await req.supabase.auth.signOut();
    res.redirect('/login');
  } catch (error) {
    console.error('Logout error:', error);
    res.redirect('/login');
  }
});

export { router as authRoutes };