import express from 'express';
import { Layout } from '../templates/layout.js';
import { SuperAdminDashboardPage } from '../templates/pages/superadmin/dashboardPage.js';
import { SuperAdminBusinessesPage } from '../templates/pages/superadmin/businessesPage.js';
import { SuperAdminUsersPage } from '../templates/pages/superadmin/usersPage.js';
import { getCompanies, getBusinesses, getRoles } from '../services/supabase.js';

const router = express.Router();

// Dashboard del superadmin
router.get('/dashboard', (req, res) => {
  const content = SuperAdminDashboardPage();
  res.send(Layout('Superadmin Dashboard', content, req.userProfile));
});

// Gestión de negocios
router.get('/businesses', async (req, res) => {
  try {
    const companies = await getCompanies(req.supabase);
    const businesses = await getBusinesses(req.supabase);
    const message = req.query.message;
    
    const content = SuperAdminBusinessesPage(companies, businesses, message);
    res.send(Layout('Gestión de Negocios', content, req.userProfile));
  } catch (error) {
    console.error('Error loading businesses page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Crear compañía
router.post('/businesses', async (req, res) => {
  try {
    const action = req.query.action;
    let message = '';

    if (action === 'create_company') {
      const { name, cif, address } = req.body;
      const { error } = await req.supabase.from('companies').insert({ 
        name, 
        cif,
        address 
      });
      message = error ? `Error: ${error.message}` : 'Compañía creada con éxito.';
    } else if (action === 'create_business') {
      const { name, company_id } = req.body;
      const { error } = await req.supabase.from('businesses').insert({ 
        name, 
        company_id: parseInt(company_id)
      });
      message = error ? `Error: ${error.message}` : 'Negocio creado con éxito.';
    }

    res.redirect(`/superadmin/businesses?message=${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Error creating business/company:', error);
    res.redirect(`/superadmin/businesses?message=${encodeURIComponent('Error interno del servidor')}`);
  }
});

// Gestión de usuarios
router.get('/users', async (req, res) => {
  try {
    const businesses = await getBusinesses(req.supabase);
    const message = req.query.message;
    
    const content = SuperAdminUsersPage(businesses, message);
    res.send(Layout('Gestión de Admins', content, req.userProfile));
  } catch (error) {
    console.error('Error loading users page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Crear administrador
router.post('/users', async (req, res) => {
  try {
    const action = req.query.action;
    let message = '';

    if (action === 'create_admin') {
      const { email, password, business_id, full_name } = req.body;
      
      const { data: authData, error: authError } = await req.supabase.auth.signUp({ 
        email, 
        password 
      });

      if (authError) {
        message = `Error creando usuario: ${authError.message}`;
      } else {
        const roles = await getRoles(req.supabase);
        const adminRole = roles.find(r => r.name === 'admin');
        
        const { error: profileError } = await req.supabase.from('user_profiles').insert({
          id: authData.user.id,
          business_id: parseInt(business_id),
          role_id: adminRole.id,
          full_name,
        });
        
        message = profileError ? `Error creando perfil: ${profileError.message}` : 'Administrador creado con éxito.';
      }
    }

    res.redirect(`/superadmin/users?message=${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.redirect(`/superadmin/users?message=${encodeURIComponent('Error interno del servidor')}`);
  }
});

export { router as superadminRoutes };