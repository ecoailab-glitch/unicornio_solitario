import React, { useState, useEffect } from 'react';
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
  Sparkles, Target, Rocket, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

const initialFormData = {
  // Datos personales
  nombre: '',
  apellidos: '',
  correo: '',
  telefono: '',
  pais: '',
  ciudad: '',
  // Proyecto
  proyecto: {
    nombre: '',
    descripcion: '',
    sector: 'Tecnología',
    etapa: 'Idea',
    fechaInicio: '',
    problemaQueResuelve: '',
    solucionPropuesta: '',
    propuestaValor: '',
    modeloNegocio: ''
  },
  // Mercado
  mercado: {
    tamano: 1000000,
    segmentoObjetivo: '',
    canalesDistribucion: []
  },
  // Financiero
  financiero: {
    inversionNecesaria: 50000,
    inversionActual: 0,
    ingresosActuales: 0,
    proyeccionIngresos: []
  },
  // Equipo
  equipo: {
    fundadores: 1,
    empleados: 0,
    asesores: 0
  },
  // Tecnología
  tecnologia: {
    stack: [],
    propiedadIntelectual: false,
    patentes: []
  },
  // Tracción
  traccion: {
    usuarios: 0,
    clientes: 0,
    crecimientoMensual: 0
  }
};

const sectorOptions = [
  'Tecnología', 'Fintech', 'Salud', 'Sostenibilidad', 'Educación', 'E-commerce',
  'Transporte', 'Logística', 'Entretenimiento', 'Retail', 'Alimentos', 'Otro'
];

const etapaOptions = [
  'Idea', 'Prototipo', 'MVP', 'Crecimiento', 'Escalamiento', 'Madurez'
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

const SimulatorForm = ({ formData, onInputChange, onSubmit, isLoading }) => (
  <Card className="glass-effect border-purple-500/20 max-h-[80vh] overflow-y-auto">
    <CardHeader>
      <CardTitle className="text-white flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-purple-400" />
        Datos del Emprendedor y Proyecto
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Datos Personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
          Información Personal
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Nombre *</Label>
            <Input
              value={formData.nombre}
              onChange={(e) => onInputChange('nombre', e.target.value)}
              placeholder="Tu nombre"
              className="bg-slate-800/50 border-purple-500/30 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-gray-300">Apellidos *</Label>
            <Input
              value={formData.apellidos}
              onChange={(e) => onInputChange('apellidos', e.target.value)}
              placeholder="Tus apellidos"
              className="bg-slate-800/50 border-purple-500/30 text-white"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Correo *</Label>
            <Input
              type="email"
              value={formData.correo}
              onChange={(e) => onInputChange('correo', e.target.value)}
              placeholder="correo@ejemplo.com"
              className="bg-slate-800/50 border-purple-500/30 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-gray-300">Teléfono</Label>
            <Input
              value={formData.telefono}
              onChange={(e) => onInputChange('telefono', e.target.value)}
              placeholder="+34 600 000 000"
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">País</Label>
            <Input
              value={formData.pais}
              onChange={(e) => onInputChange('pais', e.target.value)}
              placeholder="España"
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Ciudad</Label>
            <Input
              value={formData.ciudad}
              onChange={(e) => onInputChange('ciudad', e.target.value)}
              placeholder="Madrid"
              className="bg-slate-800/50 border-purple-500/30 text-white"
            />
          </div>
        </div>
      </div>

      {/* Información del Proyecto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
          Información del Proyecto
        </h3>
        <div>
          <Label className="text-gray-300">Nombre del Proyecto *</Label>
          <Input
            value={formData.proyecto.nombre}
            onChange={(e) => onInputChange('proyecto.nombre', e.target.value)}
            placeholder="Mi Startup Unicornio"
            className="bg-slate-800/50 border-purple-500/30 text-white"
            required
          />
        </div>
        <div>
          <Label className="text-gray-300">Descripción *</Label>
          <textarea
            value={formData.proyecto.descripcion}
            onChange={(e) => onInputChange('proyecto.descripcion', e.target.value)}
            placeholder="Describe tu proyecto en detalle..."
            className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white min-h-[80px]"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Sector *</Label>
            <select
              value={formData.proyecto.sector}
              onChange={(e) => onInputChange('proyecto.sector', e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white"
            >
              {sectorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-gray-300">Etapa *</Label>
            <select
              value={formData.proyecto.etapa}
              onChange={(e) => onInputChange('proyecto.etapa', e.target.value)}
              className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white"
            >
              {etapaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label className="text-gray-300">Problema que Resuelve *</Label>
          <textarea
            value={formData.proyecto.problemaQueResuelve}
            onChange={(e) => onInputChange('proyecto.problemaQueResuelve', e.target.value)}
            placeholder="¿Qué problema resuelve tu proyecto?"
            className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white min-h-[60px]"
            required
          />
        </div>
        <div>
          <Label className="text-gray-300">Solución Propuesta *</Label>
          <textarea
            value={formData.proyecto.solucionPropuesta}
            onChange={(e) => onInputChange('proyecto.solucionPropuesta', e.target.value)}
            placeholder="¿Cómo lo resuelves?"
            className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white min-h-[60px]"
            required
          />
        </div>
        <div>
          <Label className="text-gray-300">Propuesta de Valor</Label>
          <textarea
            value={formData.proyecto.propuestaValor}
            onChange={(e) => onInputChange('proyecto.propuestaValor', e.target.value)}
            placeholder="¿Por qué elegirte a ti?"
            className="w-full px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white min-h-[60px]"
          />
        </div>
        <div>
          <Label className="text-gray-300">Modelo de Negocio</Label>
          <Input
            value={formData.proyecto.modeloNegocio}
            onChange={(e) => onInputChange('proyecto.modeloNegocio', e.target.value)}
            placeholder="SaaS, Marketplace, B2B, B2C..."
            className="bg-slate-800/50 border-purple-500/30 text-white"
          />
        </div>
      </div>

      {/* Mercado */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
          Mercado
        </h3>
        <div>
          <Label className="text-gray-300">
            Tamaño del Mercado: {formatCurrency(formData.mercado.tamano)}
          </Label>
          <Slider
            value={[formData.mercado.tamano]}
            onValueChange={(value) => onInputChange('mercado.tamano', value[0])}
            max={100000000} min={100000} step={100000} className="mt-2"
          />
        </div>
        <div>
          <Label className="text-gray-300">Segmento Objetivo</Label>
          <Input
            value={formData.mercado.segmentoObjetivo}
            onChange={(e) => onInputChange('mercado.segmentoObjetivo', e.target.value)}
            placeholder="Jóvenes 18-35, Empresas B2B..."
            className="bg-slate-800/50 border-purple-500/30 text-white"
          />
        </div>
      </div>

      {/* Financiero */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
          Financiero
        </h3>
        <div>
          <Label className="text-gray-300">
            Inversión Necesaria: {formatCurrency(formData.financiero.inversionNecesaria)}
          </Label>
          <Slider
            value={[formData.financiero.inversionNecesaria]}
            onValueChange={(value) => onInputChange('financiero.inversionNecesaria', value[0])}
            max={10000000} min={10000} step={10000} className="mt-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Inversión Actual: {formatCurrency(formData.financiero.inversionActual)}</Label>
            <Slider
              value={[formData.financiero.inversionActual]}
              onValueChange={(value) => onInputChange('financiero.inversionActual', value[0])}
              max={5000000} min={0} step={5000} className="mt-2"
            />
          </div>
          <div>
            <Label className="text-gray-300">Ingresos Actuales: {formatCurrency(formData.financiero.ingresosActuales)}</Label>
            <Slider
              value={[formData.financiero.ingresosActuales]}
              onValueChange={(value) => onInputChange('financiero.ingresosActuales', value[0])}
              max={1000000} min={0} step={1000} className="mt-2"
            />
          </div>
        </div>
      </div>

      {/* Equipo y Tracción */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
          Equipo y Tracción
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300">Fundadores: {formData.equipo.fundadores}</Label>
            <Slider
              value={[formData.equipo.fundadores]}
              onValueChange={(value) => onInputChange('equipo.fundadores', value[0])}
              max={10} min={1} step={1} className="mt-2"
            />
          </div>
          <div>
            <Label className="text-gray-300">Empleados: {formData.equipo.empleados}</Label>
            <Slider
              value={[formData.equipo.empleados]}
              onValueChange={(value) => onInputChange('equipo.empleados', value[0])}
              max={100} min={0} step={1} className="mt-2"
            />
          </div>
          <div>
            <Label className="text-gray-300">Asesores: {formData.equipo.asesores}</Label>
            <Slider
              value={[formData.equipo.asesores]}
              onValueChange={(value) => onInputChange('equipo.asesores', value[0])}
              max={20} min={0} step={1} className="mt-2"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-gray-300">Usuarios: {formData.traccion.usuarios}</Label>
            <Slider
              value={[formData.traccion.usuarios]}
              onValueChange={(value) => onInputChange('traccion.usuarios', value[0])}
              max={1000000} min={0} step={100} className="mt-2"
            />
          </div>
          <div>
            <Label className="text-gray-300">Clientes: {formData.traccion.clientes}</Label>
            <Slider
              value={[formData.traccion.clientes]}
              onValueChange={(value) => onInputChange('traccion.clientes', value[0])}
              max={10000} min={0} step={10} className="mt-2"
            />
          </div>
          <div>
            <Label className="text-gray-300">Crecimiento: {formData.traccion.crecimientoMensual}%</Label>
            <Slider
              value={[formData.traccion.crecimientoMensual]}
              onValueChange={(value) => onInputChange('traccion.crecimientoMensual', value[0])}
              max={100} min={0} step={1} className="mt-2"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analizando con IA...
          </>
        ) : (
          <>
            <Rocket className="w-4 h-4 mr-2" />
            Calcular Potencial Unicornio
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);

const ResultsDisplay = ({ informe, isLoading, estado }) => {
  console.log('📺 [ResultsDisplay] Props recibidos:', {
    informe: informe ? 'EXISTE' : 'NO EXISTE',
    isLoading: isLoading,
    estado: estado,
    informeViabilidad: informe?.viabilidad
  });

  if (isLoading) {
    return (
      <Card className="glass-effect border-purple-500/20 h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {estado === 'procesando' ? 'Analizando tu proyecto con IA...' : 'Preparando análisis...'}
          </h3>
          <p className="text-gray-300">
            {estado === 'procesando' 
              ? 'Buscando proyectos similares y generando recomendaciones...' 
              : 'Esto puede tardar unos momentos...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!informe) {
    return (
      <Card className="glass-effect border-purple-500/20 h-full flex items-center justify-center">
        <CardContent className="text-center">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">¡Completa el formulario!</h3>
          <p className="text-gray-300">Llena los campos requeridos (*) y presiona "Calcular".</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header con Viabilidad */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-400" />
              Análisis Completo
            </div>
            <div className="text-sm text-gray-400">
              {new Date(informe.fechaAnalisis).toLocaleDateString()}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg">
            <div className="text-5xl font-bold gradient-text mb-2">
              {informe.viabilidad}%
            </div>
            <div className="text-lg text-gray-300">Viabilidad de Convertirse en Unicornio</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(informe.valorMercado)}
              </div>
              <div className="text-sm text-gray-300">Valor de Mercado Estimado</div>
            </div>
            <div className="text-center p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {informe.proyectosSimilares?.length || 0}
              </div>
              <div className="text-sm text-gray-300">Proyectos Similares</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proyectos Similares */}
      {informe.proyectosSimilares && informe.proyectosSimilares.length > 0 && (
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              Proyectos Similares
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {informe.proyectosSimilares.map((proyecto, index) => (
              <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-white">{proyecto.nombre}</div>
                    <div className="text-sm text-gray-400">{proyecto.sector}</div>
                  </div>
                  <div className="text-sm font-semibold text-purple-400">
                    {proyecto.similarity ? `${(proyecto.similarity * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                </div>
                {proyecto.valoracion && (
                  <div className="text-sm text-green-400">
                    Valoración: {formatCurrency(proyecto.valoracion)}
                  </div>
                )}
                {proyecto.pais && (
                  <div className="text-xs text-gray-500">📍 {proyecto.pais}</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones */}
      {informe.recomendaciones && informe.recomendaciones.length > 0 && (
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {informe.recomendaciones.map((rec, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Pivotes Sugeridos */}
      {informe.pivotesSugeridos && informe.pivotesSugeridos.length > 0 && (
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
              Pivotes Sugeridos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {informe.pivotesSugeridos.map((pivote, index) => (
                <li key={index} className="flex items-start text-gray-300">
                  <span className="text-orange-400 mr-2">→</span>
                  <span>{pivote}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Análisis SWOT */}
      <Card className="glass-effect border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Análisis SWOT</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {/* Fortalezas */}
          {informe.fortalezas && informe.fortalezas.length > 0 && (
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h4 className="font-semibold text-green-400 mb-2">💪 Fortalezas</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {informe.fortalezas.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Debilidades */}
          {informe.debilidades && informe.debilidades.length > 0 && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">⚠️ Debilidades</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {informe.debilidades.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Oportunidades */}
          {informe.oportunidades && informe.oportunidades.length > 0 && (
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-400 mb-2">🎯 Oportunidades</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {informe.oportunidades.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Amenazas */}
          {informe.amenazas && informe.amenazas.length > 0 && (
            <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
              <h4 className="font-semibold text-orange-400 mb-2">🚨 Amenazas</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                {informe.amenazas.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análisis Completo */}
      {informe.analisisCompleto && (
        <Card className="glass-effect border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-purple-400" />
              Análisis Detallado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {informe.analisisCompleto}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Simulator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [informe, setInforme] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emprendedorId, setEmprendedorId] = useState(null);
  const [estado, setEstado] = useState(null);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Polling para obtener el informe
  useEffect(() => {
    if (!emprendedorId) {
      console.log('❌ No hay emprendedorId, no se inicia polling');
      return;
    }

    console.log('✅ Iniciando polling para emprendedorId:', emprendedorId);

    const pollInforme = async () => {
      try {
        console.log('🔍 [POLLING] Consultando informe para ID:', emprendedorId);
        const response = await fetch(`http://localhost:5000/api/informe/${emprendedorId}`);
        
        console.log('📡 [POLLING] Response status:', response.status, response.statusText);
        
        if (response.ok) {
          const result = await response.json();
          console.log('📦 [POLLING] Respuesta completa:', JSON.stringify(result, null, 2));
          
          // El backend devuelve { success: true, data: { emprendedor: {...}, informe: {...} } }
          if (result.success && result.data) {
            const informeData = result.data.informe;
            console.log('📋 [POLLING] Informe data:', informeData ? 'EXISTE' : 'NO EXISTE');
            
            if (informeData) {
              const estado = informeData.estado || 'pendiente';
              console.log('📊 [POLLING] Estado del informe:', estado);
              console.log('💾 [POLLING] Actualizando estado en React...');
              setEstado(estado);

              if (estado === 'completado') {
                console.log('✅ [POLLING] ¡INFORME COMPLETADO! Actualizando estado...');
                console.log('📊 [POLLING] Datos del informe:', {
                  viabilidad: informeData.viabilidad,
                  valorMercado: informeData.valorMercado,
                  proyectosSimilares: informeData.proyectosSimilares?.length || 0,
                  recomendaciones: informeData.recomendaciones?.length || 0
                });
                
                // Actualizar estados
                setInforme(informeData);
                setIsLoading(false);
                
                // Limpiar interval
                if (window.pollInterval) {
                  console.log('🛑 [POLLING] Deteniendo polling...');
                  clearInterval(window.pollInterval);
                  window.pollInterval = null;
                }
                
                // Mostrar toast
                toast({
                  title: "🦄 Análisis Completado",
                  description: `Tu proyecto tiene un ${informeData.viabilidad}% de viabilidad.`,
                });
                
                console.log('✨ [POLLING] Estados actualizados, componente debería renderizar ahora');
              } else if (estado === 'error') {
                console.log('❌ [POLLING] Error en el análisis');
                setIsLoading(false);
                if (window.pollInterval) {
                  clearInterval(window.pollInterval);
                  window.pollInterval = null;
                }
                toast({
                  title: "Error en el Análisis",
                  description: "Hubo un error al procesar tu solicitud.",
                  variant: "destructive",
                });
              } else {
                console.log('⏳ [POLLING] Análisis aún en proceso... Estado:', estado);
              }
            } else {
              console.log('⚠️ [POLLING] No hay datos de informe en la respuesta');
            }
          } else {
            console.log('⚠️ [POLLING] Respuesta no tiene success o data:', {
              success: result.success,
              hasData: !!result.data
            });
          }
        } else {
          console.error('❌ [POLLING] Error en la respuesta HTTP:', response.status);
        }
      } catch (error) {
        console.error('❌ [POLLING] Error en la petición:', error);
      }
    };

    // Poll cada 2 segundos (más frecuente para mejor UX)
    window.pollInterval = setInterval(pollInforme, 2000);
    
    // Primera llamada después de un pequeño delay
    setTimeout(pollInforme, 1000);

    // Timeout de seguridad: después de 60 segundos, dejar de hacer polling
    const timeoutId = setTimeout(() => {
      console.log('⏱️ Timeout alcanzado, deteniendo polling');
      if (window.pollInterval) {
        clearInterval(window.pollInterval);
      }
      if (!informe) {
        setIsLoading(false);
        toast({
          title: "⏱️ Tiempo de espera agotado",
          description: "El análisis está tardando más de lo esperado. Por favor, recarga la página.",
          variant: "destructive",
        });
      }
    }, 60000); // 60 segundos

    return () => {
      console.log('🛑 Limpiando polling interval y timeout');
      if (window.pollInterval) {
        clearInterval(window.pollInterval);
      }
      clearTimeout(timeoutId);
    };
  }, [emprendedorId, toast, informe]);

  const validateForm = () => {
    const required = [
      { field: formData.nombre, name: 'Nombre' },
      { field: formData.apellidos, name: 'Apellidos' },
      { field: formData.correo, name: 'Correo' },
      { field: formData.proyecto.nombre, name: 'Nombre del Proyecto' },
      { field: formData.proyecto.descripcion, name: 'Descripción del Proyecto' },
      { field: formData.proyecto.problemaQueResuelve, name: 'Problema que Resuelve' },
      { field: formData.proyecto.solucionPropuesta, name: 'Solución Propuesta' },
    ];

    for (const item of required) {
      if (!item.field || item.field.trim() === '') {
        toast({
          title: "Campo Requerido",
          description: `Por favor, completa el campo: ${item.name}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast({
        title: "Email Inválido",
        description: "Por favor, introduce un correo electrónico válido.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const calculateUnicornPotential = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setInforme(null);
    setEmprendedorId(null);
    setEstado('pendiente');

    try {
      // Generar valores automáticos para campos requeridos por el backend
      const timestamp = Date.now();
      const dataToSend = {
        ...formData,
        // Generar usuario único si no existe
        usuario: `user_${timestamp}`,
        // Generar contraseña temporal si no existe
        contrasena: `temp_${timestamp}`,
        // Asegurar que país tenga un valor por defecto
        pais: formData.pais || 'España',
        // Asegurar que fechaInicio esté presente
        proyecto: {
          ...formData.proyecto,
          fechaInicio: formData.proyecto.fechaInicio || new Date().toISOString()
        }
      };

      const response = await fetch('http://localhost:5000/api/emprendedor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.mensaje || 'Error al crear emprendedor');
      }

      const data = await response.json();
      console.log('✅ Emprendedor creado:', data);
      console.log('📝 ID del emprendedor:', data._id);
      
      // Importante: Primero mostrar el toast
      toast({
        title: "✅ Proyecto Enviado",
        description: "Estamos analizando tu proyecto con IA. Esto puede tardar unos momentos...",
      });
      
      // Luego setear el ID para que inicie el polling
      setEmprendedorId(data._id);
      
      // Dar un pequeño delay para que el IA Analyzer procese
      setTimeout(async () => {
        // Forzar una consulta inmediata después de 2 segundos
        try {
          const checkResponse = await fetch(`http://localhost:5000/api/informe/${data._id}`);
          if (checkResponse.ok) {
            const checkResult = await checkResponse.json();
            console.log('🔄 Verificación inicial del informe:', checkResult);
          }
        } catch (err) {
          console.log('⏳ Esperando que el análisis se complete...');
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error:', error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: error.message || "No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.",
        variant: "destructive",
      });
    }
  };

  const handleStartJourney = () => {
    console.log("Intentando navegar a /dashboard/emprendedor");
    navigate('/dashboard/emprendedor');
  };

  // Log para debugging del render
  console.log('🎨 [RENDER] Estado actual del componente:', {
    informe: informe ? 'EXISTE' : 'NO EXISTE',
    isLoading: isLoading,
    emprendedorId: emprendedorId,
    estado: estado,
    informeViabilidad: informe?.viabilidad,
    informeEstado: informe?.estado
  });

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
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
            <h1 className="text-5xl font-bold gradient-text mb-4">🦄 Simulador de Unicornio con IA</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre el potencial de tu proyecto con análisis de inteligencia artificial basado en +1,300 unicornios reales.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <SimulatorForm 
                formData={formData} 
                onInputChange={handleInputChange} 
                onSubmit={calculateUnicornPotential}
                isLoading={isLoading}
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <ResultsDisplay 
                informe={informe} 
                isLoading={isLoading}
                estado={estado}
              />
            </motion.div>
          </div>
          {informe && (
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