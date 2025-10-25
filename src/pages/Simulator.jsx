import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, Calculator, TrendingUp, DollarSign, 
  Sparkles, Target, Rocket
} from 'lucide-react';

const initialFormData = {
  projectName: '',
  sector: 'Tecnología',
  initialInvestment: 50000,
  marketSize: 1000000,
  marketShare: 1,
  growthRate: 20,
  timeToUnicorn: 7
};

const sectorOptions = [
  'Tecnología', 'Fintech', 'Salud', 'Sostenibilidad', 'Educación', 'E-commerce'
];

const getSectorMultiplier = (sector) => {
  const multipliers = {
    'Tecnología': 15, 'Fintech': 12, 'Salud': 18,
    'Sostenibilidad': 10, 'Educación': 8, 'E-commerce': 6
  };
  return multipliers[sector] || 10;
};

const calculateProbability = (data) => {
  let probability = 5;
  if (data.marketSize > 10000000) probability += 15;
  if (data.growthRate > 30) probability += 20;
  if (data.marketShare > 5) probability += 10;
  if (data.timeToUnicorn < 5) probability += 15;
  if (data.sector === 'Tecnología' || data.sector === 'Fintech') probability += 10;
  return Math.min(probability, 85);
};

const calculateInvestmentNeeded = (years, growth) => {
  const baseInvestment = 500000;
  const yearMultiplier = years * 200000;
  const growthBonus = growth > 25 ? 300000 : 0;
  return baseInvestment + yearMultiplier + growthBonus;
};

const generateTimeline = (years) => [
  { phase: 'Semilla', year: 1, funding: '€50K - €500K', milestone: 'MVP y primeros usuarios' },
  { phase: 'Pegaso', year: Math.ceil(years * 0.3), funding: '€500K - €5M', milestone: 'Product-market fit' },
  { phase: 'Dragón', year: Math.ceil(years * 0.7), funding: '€5M - €50M', milestone: 'Escalabilidad internacional' },
  { phase: 'Unicornio', year: years, funding: '€50M+', milestone: 'Valoración +€1B' }
];

const formatCurrency = (amount) => {
  if (amount >= 1000000000) return `€${(amount / 1000000000).toFixed(1)}B`;
  if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
  return `€${amount.toFixed(0)}`;
};

const SimulatorForm = ({ formData, onInputChange, onSubmit }) => (
  <Card className="glass-effect border-purple-500/20">
    <CardHeader>
      <CardTitle className="text-white flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-purple-400" />
        Parámetros del Proyecto
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div>
        <Label className="text-gray-300">Nombre del Proyecto</Label>
        <Input
          value={formData.projectName}
          onChange={(e) => onInputChange('projectName', e.target.value)}
          placeholder="Mi Startup Unicornio"
          className="bg-slate-800/50 border-purple-500/30 text-white"
        />
      </div>
      <div>
        <Label className="text-gray-300">Sector</Label>
        <select
          value={formData.sector}
          onChange={(e) => onInputChange('sector', e.target.value)}
          className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white"
        >
          {sectorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      {[
        { field: 'initialInvestment', label: 'Inversión Inicial', max: 1000000, min: 10000, step: 10000 },
        { field: 'marketSize', label: 'Tamaño del Mercado', max: 100000000, min: 1000000, step: 1000000 },
        { field: 'marketShare', label: 'Cuota de Mercado Objetivo', max: 20, min: 0.1, step: 0.1, unit: '%' },
        { field: 'growthRate', label: 'Tasa de Crecimiento Anual', max: 100, min: 5, step: 5, unit: '%' },
        { field: 'timeToUnicorn', label: 'Tiempo hasta Unicornio', max: 15, min: 3, step: 1, unit: ' años' },
      ].map(({ field, label, max, min, step, unit }) => (
        <div key={field}>
          <Label className="text-gray-300">
            {label}: {unit === '%' || unit === ' años' ? formData[field] : formatCurrency(formData[field])}{unit || ''}
          </Label>
          <Slider
            value={[formData[field]]}
            onValueChange={(value) => onInputChange(field, value[0])}
            max={max} min={min} step={step} className="mt-2"
          />
        </div>
      ))}
      <Button
        onClick={onSubmit}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
      >
        <Rocket className="w-4 h-4 mr-2" />
        Calcular Potencial Unicornio
      </Button>
    </CardContent>
  </Card>
);

const ResultsDisplay = ({ results }) => {
  if (!results) {
    return (
      <Card className="glass-effect border-purple-500/20 h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">¡Completa los parámetros!</h3>
          <p className="text-gray-300">Ajusta los valores y presiona "Calcular".</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Resultados de la Simulación
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[
            { label: 'Valoración Proyectada', value: formatCurrency(results.projectedValuation), color: 'text-green-400' },
            { label: 'Probabilidad Unicornio', value: `${results.unicornProbability}%`, color: 'text-purple-400' },
            { label: 'Inversión Necesaria', value: formatCurrency(results.investmentNeeded), color: 'text-blue-400' },
            { label: 'ROI Proyectado', value: `${results.roi.toFixed(0)}%`, color: 'text-orange-400' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-sm text-gray-300">{item.label}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-yellow-400" />
            Timeline de Crecimiento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.timeline.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                item.phase === 'Semilla' ? 'bg-green-500' :
                item.phase === 'Pegaso' ? 'bg-blue-500' :
                item.phase === 'Dragón' ? 'bg-orange-500' : 'bg-purple-500'
              }`} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{item.phase}</span>
                  <span className="text-gray-400">Año {item.year}</span>
                </div>
                <div className="text-sm text-gray-300">{item.milestone}</div>
                <div className="text-sm text-purple-300">{item.funding}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const Simulator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateUnicornPotential = () => {
    if (!formData.projectName.trim()) {
      toast({
        title: "Nombre Requerido",
        description: "Por favor, introduce un nombre para tu proyecto.",
        variant: "destructive",
      });
      return;
    }

    const { initialInvestment, marketSize, marketShare, growthRate, timeToUnicorn } = formData;
    const targetMarketValue = marketSize * (marketShare / 100);
    const compoundGrowth = Math.pow(1 + (growthRate / 100), timeToUnicorn);
    const projectedRevenue = initialInvestment * compoundGrowth;
    const valuationMultiplier = getSectorMultiplier(formData.sector);
    const projectedValuation = projectedRevenue * valuationMultiplier;
    const unicornProbability = calculateProbability(formData);
    const investmentNeeded = calculateInvestmentNeeded(timeToUnicorn, growthRate);
    const timeline = generateTimeline(timeToUnicorn);
    
    setResults({
      projectedValuation, unicornProbability, investmentNeeded,
      projectedRevenue, targetMarket: targetMarketValue, timeline,
      roi: ((projectedValuation - investmentNeeded) / investmentNeeded) * 100
    });
    setShowResults(true);
    toast({
      title: "🦄 Simulación completada",
      description: `Tu proyecto tiene un ${unicornProbability}% de probabilidad de ser unicornio.`,
    });
  };

  const handleStartJourney = () => {
    console.log("Intentando navegar a /dashboard/emprendedor");
    navigate('/dashboard/emprendedor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="glass-effect border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-purple-300 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <h1 className="text-5xl font-bold gradient-text mb-4">🦄 Simulador de Unicornio</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre el potencial de tu proyecto y calcula cuánto podría valer.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <SimulatorForm formData={formData} onInputChange={handleInputChange} onSubmit={calculateUnicornPotential} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <ResultsDisplay results={results} />
            </motion.div>
          </div>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="text-center mt-8">
              <Card className="glass-effect border-purple-500/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold gradient-text mb-4">¿Listo para hacer realidad tu unicornio?</h3>
                  <p className="text-gray-300 mb-6">Únete al ecosistema y conecta con mentores e inversores.</p>
                  <Button onClick={handleStartJourney} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 text-lg">
                    🚀 Comenzar mi Viaje
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;