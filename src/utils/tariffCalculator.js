/**
 * Calcula la comparación de tarifas energéticas
 */
export function calculateTariffComparison(rates, clientData) {
    const results = [];
    
    // Filtrar tarifas que coincidan con el tipo de acceso y segmento del cliente
    const applicableRates = rates.filter(rate => 
        rate.access_type === clientData.access_type && 
        rate.client_segment === clientData.client_segment &&
        rate.is_active
    );

    for (const rate of applicableRates) {
        try {
            const monthlyCost = calculateMonthlyCost(rate, clientData);
            const annualCost = monthlyCost * 12;
            
            results.push({
                rate_id: rate.id,
                provider_name: rate.provider?.name || 'Proveedor desconocido',
                tariff_name: rate.name,
                monthly_cost: monthlyCost,
                annual_cost: annualCost,
                annual_savings: 0, // Se calculará después
                commission: rate.comision_vendedor || 0
            });
        } catch (error) {
            console.error(`Error calculating cost for rate ${rate.id}:`, error);
        }
    }

    // Ordenar por coste mensual (menor a mayor)
    results.sort((a, b) => a.monthly_cost - b.monthly_cost);

    // Calcular ahorros anuales comparando con la tarifa más cara
    if (results.length > 0) {
        const mostExpensive = Math.max(...results.map(r => r.annual_cost));
        results.forEach(result => {
            result.annual_savings = mostExpensive - result.annual_cost;
        });
    }

    return results;
}

/**
 * Calcula el coste mensual de una tarifa para un cliente específico
 */
function calculateMonthlyCost(rate, clientData) {
    let totalCost = 0;

    // Calcular coste de potencia
    for (let i = 1; i <= 6; i++) {
        const potKey = `potencia_p${i}`;
        const ratePrice = rate[potKey];
        const clientPower = clientData.input_potencias_contratadas_kw[potKey];

        if (ratePrice && clientPower) {
            totalCost += ratePrice * clientPower; // €/kW/mes
        }
    }

    // Calcular coste de energía
    for (let i = 1; i <= 6; i++) {
        const eneKey = `energia_p${i}`;
        const ratePrice = rate[eneKey];
        const clientConsumption = clientData.input_consumos_energia_kwh[eneKey];

        if (ratePrice && clientConsumption) {
            // Normalizar el consumo a mensual
            const monthlyConsumption = (clientConsumption / clientData.input_dias_facturados) * 30;
            totalCost += ratePrice * monthlyConsumption; // €/kWh
        }
    }

    return totalCost;
}

/**
 * Calcula estadísticas de ahorro para una propuesta
 */
export function calculateSavingsStats(comparison) {
    if (!comparison || comparison.length === 0) {
        return null;
    }

    const bestOffer = comparison[0];
    const worstOffer = comparison[comparison.length - 1];
    
    return {
        best_monthly_cost: bestOffer.monthly_cost,
        best_annual_savings: bestOffer.annual_savings,
        max_potential_savings: worstOffer.annual_cost - bestOffer.annual_cost,
        average_cost: comparison.reduce((sum, r) => sum + r.monthly_cost, 0) / comparison.length,
        total_options: comparison.length
    };
}