import express from 'express';
import { Layout } from '../templates/layout.js';
import { AdminDashboardPage } from '../templates/pages/admin/dashboardPage.js';
import { AdminUsersPage } from '../templates/pages/admin/usersPage.js';
import { AdminProvidersPage } from '../templates/pages/admin/providersPage.js';
import { AdminRatesPage } from '../templates/pages/admin/ratesPage.js';
import { AdminStylesPage } from '../templates/pages/admin/stylesPage.js';
import { getUsersByBusiness, getProviders, getRatesByBusiness, getRoles } from '../services/supabase.js';

const router = express.Router();

// Dashboard del admin
router.get('/dashboard', (req, res) => {
  const content = AdminDashboardPage(req.userProfile);
  res.send(Layout('Admin Dashboard', content, req.userProfile));
});

// Gestión de usuarios del negocio
router.get('/users', async (req, res) => {
  try {
    const users = await getUsersByBusiness(req.supabase, req.userProfile.business_id);
    const roles = await getRoles(req.supabase);
    const message = req.query.message;
    
    const content = AdminUsersPage(users, roles, message);
    res.send(Layout('Gestión de Usuarios', content, req.userProfile));
  } catch (error) {
    console.error('Error loading users page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Gestión de proveedores
router.get('/providers', async (req, res) => {
  try {
    const providers = await getProviders(req.supabase);
    const message = req.query.message;
    
    const content = AdminProvidersPage(providers, message);
    res.send(Layout('Gestión de Proveedores', content, req.userProfile));
  } catch (error) {
    console.error('Error loading providers page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Gestión de tarifas
router.get('/rates', async (req, res) => {
  try {
    const rates = await getRatesByBusiness(req.supabase, req.userProfile.business_id);
    const providers = await getProviders(req.supabase);
    const message = req.query.message;
    
    const content = AdminRatesPage(rates, providers, message);
    res.send(Layout('Gestión de Tarifas', content, req.userProfile));
  } catch (error) {
    console.error('Error loading rates page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Gestión de estilos/apariencia
router.get('/styles', async (req, res) => {
  try {
    const message = req.query.message;
    const content = AdminStylesPage(req.userProfile.business?.style, message);
    res.send(Layout('Configuración de Apariencia', content, req.userProfile));
  } catch (error) {
    console.error('Error loading styles page:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Crear usuario
router.post('/users', async (req, res) => {
  try {
    const action = req.query.action;
    let message = '';

    if (action === 'create_user') {
      const { email, password, role_id, full_name } = req.body;
      
      const { data: authData, error: authError } = await req.supabase.auth.signUp({ 
        email, 
        password 
      });

      if (authError) {
        message = `Error creando usuario: ${authError.message}`;
      } else {
        const { error: profileError } = await req.supabase.from('user_profiles').insert({
          id: authData.user.id,
          business_id: req.userProfile.business_id,
          role_id: parseInt(role_id),
          full_name,
        });
        
        message = profileError ? `Error creando perfil: ${profileError.message}` : 'Usuario creado con éxito.';
      }
    }

    res.redirect(`/admin/users?message=${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Error creating user:', error);
    res.redirect(`/admin/users?message=${encodeURIComponent('Error interno del servidor')}`);
  }
});

// Crear/actualizar tarifa
router.post('/rates', async (req, res) => {
  try {
    const action = req.query.action;
    let message = '';

    if (action === 'create_rate') {
      const rateData = {
        ...req.body,
        business_id: req.userProfile.business_id,
        provider_id: parseInt(req.body.provider_id),
        is_active: req.body.is_active === 'on',
        comision_vendedor: parseFloat(req.body.comision_vendedor) || 0
      };

      // Convertir campos de precio a números
      const priceFields = [
        'potencia_p1', 'potencia_p2', 'potencia_p3', 'potencia_p4', 'potencia_p5', 'potencia_p6',
        'energia_p1', 'energia_p2', 'energia_p3', 'energia_p4', 'energia_p5', 'energia_p6'
      ];

      priceFields.forEach(field => {
        const value = req.body[field];
        rateData[field] = (value === '' || value === null) ? null : parseFloat(value);
      });

      const { error } = await req.supabase.from('rates').insert(rateData);
      message = error ? `Error: ${error.message}` : 'Tarifa creada con éxito.';
    }

    res.redirect(`/admin/rates?message=${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Error managing rate:', error);
    res.redirect(`/admin/rates?message=${encodeURIComponent('Error interno del servidor')}`);
  }
});

// Actualizar estilos
router.post('/styles', async (req, res) => {
  try {
    const { primary_color, secondary_color, background_color, logo_base64 } = req.body;
    
    const styleData = {
      business_id: req.userProfile.business_id,
      primary_color,
      secondary_color,
      background_color,
      logo_base64
    };

    // Verificar si ya existe un estilo para este negocio
    const { data: existingStyle } = await req.supabase
      .from('business_styles')
      .select('id')
      .eq('business_id', req.userProfile.business_id)
      .single();

    let error;
    if (existingStyle) {
      // Actualizar estilo existente
      const { error: updateError } = await req.supabase
        .from('business_styles')
        .update(styleData)
        .eq('business_id', req.userProfile.business_id);
      error = updateError;
    } else {
      // Crear nuevo estilo
      const { error: insertError } = await req.supabase
        .from('business_styles')
        .insert(styleData);
      error = insertError;
    }

    const message = error ? `Error: ${error.message}` : 'Configuración de apariencia actualizada con éxito.';
    res.redirect(`/admin/styles?message=${encodeURIComponent(message)}`);
  } catch (error) {
    console.error('Error updating styles:', error);
    res.redirect(`/admin/styles?message=${encodeURIComponent('Error interno del servidor')}`);
  }
});

export { router as adminRoutes };