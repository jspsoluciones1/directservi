import express from 'express';
import { Layout } from '../templates/layout.js';
import { VendedorProposalsPage } from '../templates/pages/vendedor/proposalsPage.js';
import { VendedorComparatorPage } from '../templates/pages/vendedor/comparatorPage.js';
import { getProposalsByUser, getRatesByBusiness } from '../services/supabase.js';
import { calculateTariffComparison } from '../utils/tariffCalculator.js';

const router = express.Router();

// Página de propuestas
router.get('/proposals', async (req, res) => {
  try {
    const proposals = await getProposalsByUser(req.supabase, req.user.id);
    const content = VendedorProposalsPage(proposals);
    res.send(Layout('Mis Propuestas', content, req.userProfile));
  } catch (error) {
    console.error('Error loading proposals:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Comparador de tarifas
router.get('/comparator', async (req, res) => {
  try {
    const rates = await getRatesByBusiness(req.supabase, req.userProfile.business_id);
    const content = VendedorComparatorPage(rates);
    res.send(Layout('Comparador de Tarifas', content, req.userProfile));
  } catch (error) {
    console.error('Error loading comparator:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Procesar comparación
router.post('/comparator', async (req, res) => {
  try {
    const rates = await getRatesByBusiness(req.supabase, req.userProfile.business_id);
    
    // Parsear datos del formulario
    const clientData = {
      client_name: req.body.client_name,
      client_cups: req.body.client_cups,
      client_cif_dni: req.body.client_cif_dni,
      client_address: req.body.client_address,
      client_email: req.body.client_email,
      client_phone: req.body.client_phone,
      access_type: req.body.access_type,
      client_segment: req.body.client_segment,
      input_dias_facturados: parseInt(req.body.input_dias_facturados) || 30,
      input_importe_total_factura: parseFloat(req.body.input_importe_total_factura) || 0,
      input_potencias_contratadas_kw: {},
      input_consumos_energia_kwh: {},
    };

    // Procesar potencias y consumos
    for (let i = 1; i <= 6; i++) {
      const potKey = `potencia_p${i}`;
      const eneKey = `energia_p${i}`;
      const potValue = req.body[potKey];
      const eneValue = req.body[eneKey];

      if (potValue) {
        clientData.input_potencias_contratadas_kw[potKey] = parseFloat(potValue);
      }
      if (eneValue) {
        clientData.input_consumos_energia_kwh[eneKey] = parseFloat(eneValue);
      }
    }

    // Calcular comparación
    const comparison = calculateTariffComparison(rates, clientData);

    // Guardar propuesta en la base de datos
    const proposalData = {
      created_by_user_id: req.user.id,
      business_id: req.userProfile.business_id,
      client_name: clientData.client_name,
      client_cups: clientData.client_cups,
      client_cif_dni: clientData.client_cif_dni,
      client_address: clientData.client_address,
      client_email: clientData.client_email,
      client_phone: clientData.client_phone,
      input_data: JSON.stringify(clientData),
      comparison_results: JSON.stringify(comparison),
      status: 'draft'
    };

    const { data: proposal, error } = await req.supabase
      .from('proposals')
      .insert(proposalData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Mostrar resultados
    const content = VendedorComparatorPage(rates, clientData, comparison, proposal);
    res.send(Layout('Resultados del Comparador', content, req.userProfile));

  } catch (error) {
    console.error('Error processing comparison:', error);
    const rates = await getRatesByBusiness(req.supabase, req.userProfile.business_id);
    const content = VendedorComparatorPage(rates, null, null, null, 'Error procesando la comparación');
    res.send(Layout('Error en Comparador', content, req.userProfile));
  }
});

export { router as vendedorRoutes };