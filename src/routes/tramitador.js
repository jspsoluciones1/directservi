import express from 'express';
import { Layout } from '../templates/layout.js';
import { TramitadorContractsPage } from '../templates/pages/tramitador/contractsPage.js';

const router = express.Router();

// Gestión de contratos
router.get('/contracts', (req, res) => {
  const content = TramitadorContractsPage();
  res.send(Layout('Gestión de Contratos', content, req.userProfile));
});

export { router as tramitadorRoutes };