import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Filter as FilterIcon, Download, TrendingUp, Heart, Globe, Users, BrainCircuit, Shield, Gem, Star, Award, Building, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const funnelDataModels = {
  aspiracional: [
    { name: 'Entrada', projects: 600000, color: 'from-blue-500 to-blue-400', width: 100, icon: <Users/> },
    { name: 'Semilla', projects: 50000, color: 'from-cyan-500 to-cyan-400', width: 85, icon: <BrainCircuit/> },
    { name: 'Pegaso', projects: 5000, color: 'from-green-500 to-green-400', width: 70, icon: <Shield/> },
    { name: 'Dragón', projects: 500, color: 'from-yellow-500 to-yellow-400', width: 50, icon: <Gem/> },
    { name: 'Unicornio', projects: 50, color: 'from-purple-600 to-purple-500', width: 30, icon: <Star/> },
  ],
  realista: [
    { name: 'Entrada', projects: 600000, color: 'from-blue-500 to-blue-400', width: 100, icon: <Users/> },
    { name: 'Semilla', projects: 5000, color: 'from-cyan-500 to-cyan-400', width: 85, icon: <BrainCircuit/> },
    { name: 'Pegaso', projects: 250, color: 'from-green-500 to-green-400', width: 70, icon: <Shield/> },
    { name: 'Dragón', projects: 25, color: 'from-yellow-500 to-yellow-400', width: 50, icon: <Gem/> },
    { name: 'Unicornio', projects: 2, color: 'from-purple-600 to-purple-500', width: 30, icon: <Star/> },
  ]
};

const FunnelStageDetails = ({ stage, model }) => (
    <DialogContent className="sm:max-w-[625px] bg-slate-900/80 border-purple-500/30 text-white">
        <DialogHeader>
            <DialogTitle className="text-2xl gradient-text flex items-center gap-2">{stage.icon} {stage.name} - Modelo {model.charAt(0).toUpperCase() + model.slice(1)}</DialogTitle>
            <DialogDescription className="text-gray-400">
                Análisis detallado de la fase {stage.name}.
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader><CardTitle className="text-lg text-purple-300">Proyectos Activos</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">{stage.projects.toLocaleString('es-ES')}</p></CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader><CardTitle className="text-lg text-purple-300">Capital Invertido (Est.)</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">€{(stage.projects * 5000).toLocaleString('es-ES')}</p></CardContent>
                </Card>
            </div>
            <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader><CardTitle className="text-lg text-purple-300">Desglose por Asociación</CardTitle></CardHeader>
                <CardContent className="flex justify-around">
                    <div className="text-center"><Building className="mx-auto mb-1 text-cyan-400"/> <p>Impact Hub: {(stage.projects * 0.4).toLocaleString('es-ES')}</p></div>
                    <div className="text-center"><Award className="mx-auto mb-1 text-green-400"/> <p>Menttoriza: {(stage.projects * 0.2).toLocaleString('es-ES')}</p></div>
                    <div className="text-center"><Sparkles className="mx-auto mb-1 text-yellow-400"/> <p>BPW: {(stage.projects * 0.4).toLocaleString('es-ES')}</p></div>
                </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20">
                <CardHeader><CardTitle className="text-lg text-purple-300">ODS Cubiertos</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-red-500/20 text-red-300">1: Fin de la Pobreza</Badge>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">4: Educación de Calidad</Badge>
                    <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">5: Igualdad de Género</Badge>
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">9: Industria e Innovación</Badge>
                </CardContent>
            </Card>
        </div>
    </DialogContent>
);


const FunnelStage = ({ stage, prevStage }) => {
    const conversionRate = prevStage ? (stage.projects / prevStage.projects) * 100 : 100;
    const formattedConversion = conversionRate < 0.1 ? `~${conversionRate.toFixed(2)}%` : `${conversionRate.toFixed(1)}%`;
    const clipPath = `polygon(0% 0%, 100% 0%, ${100 - (100 - stage.width) / 2}% 100%, ${(100 - stage.width) / 2}% 100%)`;
    const prevClipPath = prevStage ? `polygon(0% 0%, 100% 0%, ${100 - (100 - prevStage.width) / 2}% 100%, ${(100 - prevStage.width) / 2}% 100%)` : clipPath;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <motion.div
                    className="relative cursor-pointer group"
                    style={{ width: `${prevStage ? prevStage.width : stage.width}%`, height: '120px' }}
                    initial={{ clipPath: prevClipPath }}
                    animate={{ clipPath }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stage.color} flex flex-col items-center justify-center text-white text-center p-2 transition-transform duration-300 group-hover:scale-105`}>
                        <div className="flex items-center gap-2">{stage.icon} <span className="text-xl font-bold">{stage.name}</span></div>
                        <div className="text-3xl font-bold">{stage.projects.toLocaleString('es-ES')}</div>
                        {prevStage && <div className="text-xs opacity-80">{formattedConversion} conversión</div>}
                    </div>
                </motion.div>
            </DialogTrigger>
            <FunnelStageDetails stage={stage} model={funnelDataModels.aspiracional.some(s => s.projects === 50) ? 'aspiracional' : 'realista'} />
        </Dialog>
    );
};


const FunnelDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [model, setModel] = useState('aspiracional');

    const funnelStagesData = useMemo(() => funnelDataModels[model], [model]);

    const handleExport = () => {
        toast({
            title: "🚧 Funcionalidad no implementada",
            description: "¡La exportación a PDF/Imagen estará disponible pronto! 🚀",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 md:p-8 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-purple-300 hover:bg-purple-500/20 hover:text-white">
                            <Home />
                        </Button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold gradient-text">Embudo de Posibilidades</h1>
                            <p className="text-gray-400">El viaje de la idea al unicornio.</p>
                        </div>
                    </div>
                    <Button onClick={handleExport} className="bg-teal-500 hover:bg-teal-600 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </Button>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-effect rounded-2xl p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-2">
                        <FilterIcon className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-semibold">Filtros y Opciones</h3>
                     </div>
                     <div className="flex items-center space-x-2">
                        <Label htmlFor="model-switch" className="text-gray-300">Realista</Label>
                        <Switch
                            id="model-switch"
                            checked={model === 'aspiracional'}
                            onCheckedChange={(checked) => setModel(checked ? 'aspiracional' : 'realista')}
                            aria-label="Cambiar modelo de embudo"
                        />
                        <Label htmlFor="model-switch" className="text-gray-300">Aspiracional</Label>
                    </div>
                </motion.div>

                <div className="flex flex-col items-center space-y-[-1px]">
                    {funnelStagesData.map((stage, index) => (
                        <FunnelStage
                            key={`${model}-${stage.name}`}
                            stage={stage}
                            prevStage={index > 0 ? funnelStagesData[index - 1] : null}
                        />
                    ))}
                </div>
                
                <div className="mt-12 text-center text-gray-400 max-w-2xl mx-auto">
                    <p>Este embudo representa el flujo de valor y el potencial de nuestro ecosistema. Cada fase aplica filtros de IA, mentoría y acceso a capital para maximizar el impacto y la probabilidad de éxito, escalando la creación de valor de forma masiva.</p>
                </div>
            </div>
        </div>
    );
};

export default FunnelDashboard;