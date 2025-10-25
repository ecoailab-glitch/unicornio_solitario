import { CheckCircle, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export const formatCurrency = (amount, short = false) => {
  if (typeof amount === 'string') {
    const numericString = amount.replace(/[.€ ]/g, '').replace(',', '.');
    amount = parseFloat(numericString);
  }
  if (isNaN(amount)) {
    return 'N/A';
  }

  if (short) {
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B €`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M €`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K €`;
    return `${amount.toFixed(0)} €`;
  }
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const getPhaseColor = (fase) => {
  const colors = {
    'Semilla': 'bg-green-500 text-white',
    'Pegaso': 'bg-blue-500 text-white',
    'Dragón': 'bg-orange-500 text-white',
    'Unicornio': 'bg-purple-500 text-white',
    '🌱 Fase Semilla': 'bg-green-500 text-white',
    '🟦 Fase Pegaso': 'bg-blue-500 text-white',
    '🟧 Fase Dragón': 'bg-orange-500 text-white',
    '🟪 Fase Unicornio': 'bg-purple-500 text-white'
  };
  return colors[fase] || 'bg-gray-500 text-white';
};

export const getProgressStatusColor = (status, border = false) => {
  const baseColors = {
    on_track: 'text-green-400',
    needs_attention: 'text-yellow-400',
    at_risk: 'text-red-400',
    exceeding_expectations: 'text-teal-400', 
  };
  const borderColors = {
    on_track: 'border-green-500/50 bg-green-500/10',
    needs_attention: 'border-yellow-500/50 bg-yellow-500/10',
    at_risk: 'border-red-500/50 bg-red-500/10',
    exceeding_expectations: 'border-teal-500/50 bg-teal-500/10',
  };
  return border ? (borderColors[status] || 'border-gray-500/50 bg-gray-500/10') : (baseColors[status] || 'text-gray-400');
};

export const getProgressStatusIcon = (status) => {
  const icons = {
    on_track: CheckCircle,
    needs_attention: AlertCircle,
    at_risk: Clock,
    exceeding_expectations: TrendingUp, 
  };
  return icons[status] || AlertCircle;
};