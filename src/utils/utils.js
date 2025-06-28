/**
 * Escapa caracteres HTML para prevenir ataques XSS
 */
export const escapeHTML = (str) => {
  if (typeof str !== 'string') {
    if (str === null || str === undefined) return '';
    return String(str);
  }
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Parsea los datos del formulario de tarifas
 */
export function parseTariffFormData(formData) {
    const data = {
        provider_id: formData.get('provider_id') ? parseInt(formData.get('provider_id'), 10) : null,
        name: formData.get('name'),
        access_type: formData.get('access_type'),
        client_segment: formData.get('client_segment'),
        comision_vendedor: formData.get('comision_vendedor') ? parseFloat(formData.get('comision_vendedor')) : null,
        is_active: formData.get('is_active') === 'on',
        valid_from: formData.get('valid_from') || null,
        valid_to: formData.get('valid_to') || null,
    };

    const priceFields = [
        'potencia_p1', 'potencia_p2', 'potencia_p3', 'potencia_p4', 'potencia_p5', 'potencia_p6',
        'energia_p1', 'energia_p2', 'energia_p3', 'energia_p4', 'energia_p5', 'energia_p6'
    ];

    priceFields.forEach(field => {
        const value = formData.get(field);
        data[field] = (value === '' || value === null) ? null : parseFloat(value);
    });

    return data;
}

/**
 * Parsea los datos del comparador
 */
export function parseComparatorFormData(formData) {
    const data = {
        client_name: formData.get('client_name'),
        client_cups: formData.get('client_cups'),
        client_cif_dni: formData.get('client_cif_dni'),
        client_address: formData.get('client_address'),
        client_email: formData.get('client_email'),
        client_phone: formData.get('client_phone'),
        access_type: formData.get('access_type'),
        client_segment: formData.get('client_segment'),
        input_dias_facturados: parseInt(formData.get('input_dias_facturados'), 10) || 30,
        input_importe_total_factura: parseFloat(formData.get('input_importe_total_factura')) || 0,
        input_potencias_contratadas_kw: {},
        input_consumos_energia_kwh: {},
    };

    for (let i = 1; i <= 6; i++) {
        const potKey = `potencia_p${i}`;
        const eneKey = `energia_p${i}`;
        const potValue = formData.get(potKey);
        const eneValue = formData.get(eneKey);

        if (potValue) {
            data.input_potencias_contratadas_kw[potKey] = parseFloat(potValue);
        }
        if (eneValue) {
            data.input_consumos_energia_kwh[eneKey] = parseFloat(eneValue);
        }
    }

    return data;
}