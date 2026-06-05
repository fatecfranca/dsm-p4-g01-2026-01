import { useState } from 'react';

// STUBS TEMPORÁRIOS: serão removidos quando DashboardScreen/HomeScreen forem
// refeitos nas Fases 4 e 5. Mantidos só pra build do Metro passar.

export default function useTelemetryData() {
  return {
    voltage: 0,
    current: 0,
    power: 0,
    powerFactor: 0,
    monthlyCost: 0,
    loading: false,
    error: null,
    refresh: () => {},
  };
}
