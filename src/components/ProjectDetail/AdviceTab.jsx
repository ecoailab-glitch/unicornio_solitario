import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { BrainCircuit, Anchor, Sparkles, Loader2, Save } from 'lucide-react';
import { getAiAdvice, simpleHash } from '@/lib/aiService';
import { Badge } from '@/components/ui/badge';

const AdviceTab = ({ project, updateProject }) => {
  const [adviceMode, setAdviceMode] = useState(project.project_kind === 'startup' ? 'startup' : 'social');
  const [advice, setAdvice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAdvice = async () => {
    setIsLoading(true);
    const response = await getAiAdvice(project, adviceMode);
    if (response.success) {
      const promptHash = await simpleHash(JSON.stringify({ projectId: project.id, mode: adviceMode }));
      let parsedAdvice = response.data;
      if (adviceMode === 'social') {
        try {
          parsedAdvice = JSON.parse(response.data);
        } catch(e) {
          console.error("Failed to parse social advice JSON", e);
          parsedAdvice = { error: "Failed to parse AI advice.", raw: response.data };
        }
      }
      setAdvice({
        ...project.advice,
        [adviceMode]: parsedAdvice,
        [`${adviceMode}_hash`]: promptHash,
      });
    } else {
      toast({ title: 'Error IA', description: 'No se pudo obtener el consejo.', variant: 'destructive' });
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Carga el consejo si ya existe en el proyecto
    if (project.advice && project.advice[adviceMode]) {
      setAdvice(project.advice);
    } else {
      setAdvice(null);
    }
  }, [adviceMode, project.advice]);

  const saveAdvice = () => {
    if (updateProject && advice) {
      updateProject(project.id, { advice: advice });
      toast({ title: "Consejo Guardado", description: "El consejo de la IA ha sido guardado en el proyecto." });
    }
  };

  const anchorOnGravity = async () => {
    if (!advice || !advice[adviceMode]) {
        toast({ title: "Error", description: "Genera un consejo antes de anclarlo.", variant: 'destructive'});
        return;
    }
    const contentHash = await simpleHash(JSON.stringify(advice[adviceMode]));
    const tx_hash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    const newEvent = {
        id: `evt-${Date.now()}`,
        event_type: 'LLM_EVALUATED',
        content_hash: contentHash,
        tx_hash,
        created_at: new Date().toISOString(),
    };

    const updatedTraceEvents = [...(project.trace_events || []), newEvent];
    updateProject(project.id, { trace_events: updatedTraceEvents });

    toast({
      title: "Anclado en Gravity",
      description: `El consejo IA ha sido anclado con el tx: ${tx_hash.substring(0, 20)}...`,
    });
  };

  const renderSocialAdvice = (data) => {
    if(!data) return <p>No hay datos.</p>;
    return (
      <div className="space-y-4 text-sm">
        <p className="text-gray-300 italic">"{data.fit_summary}"</p>
        <div>
          <h4 className="font-semibold text-purple-300 mb-1">Alineación ODS</h4>
          <div className="flex flex-wrap gap-2">
            {data.sdg_alignment?.map(sdg => <Badge key={sdg.id} variant="secondary">{sdg.name} ({(sdg.score*100).toFixed(0)}%)</Badge>)}
          </div>
        </div>
         <div>
          <h4 className="font-semibold text-purple-300 mb-1">KPIs de Impacto Sugeridos</h4>
          <ul className="list-disc list-inside text-gray-400">
            {data.impact_kpis?.map(kpi => <li key={kpi.name}>{kpi.name}: {kpi.target}{kpi.unit}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-purple-300 mb-1">Rutas de Financiación</h4>
           <ul className="list-disc list-inside text-gray-400">
            {data.funding_routes?.map(route => <li key={route.name}>{route.name} ({route.type})</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-purple-300 mb-1">Próximos Pasos</h4>
           <ol className="list-decimal list-inside text-gray-400">
            {data.next_steps?.map(step => <li key={step}>{step}</li>)}
          </ol>
        </div>
        <div className="pt-2">
          <p className="text-gray-400">Puntuación Impact Readiness: <span className="font-bold text-green-400">{data.score?.impact_readiness}/10</span></p>
        </div>
      </div>
    )
  };

  return (
    <Card className="glass-effect">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-white flex items-center">
            <BrainCircuit className="w-6 h-6 mr-3 text-purple-400" />
            Consejero IA
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="advice-mode" className={adviceMode === 'startup' ? 'text-white' : 'text-gray-400'}>Startup</Label>
              <Switch id="advice-mode" checked={adviceMode === 'social'} onCheckedChange={(checked) => setAdviceMode(checked ? 'social' : 'startup')} />
              <Label htmlFor="advice-mode" className={adviceMode === 'social' ? 'text-white' : 'text-gray-400'}>Social</Label>
            </div>
            <Button onClick={fetchAdvice} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2"/>}
              {advice ? 'Regenerar' : 'Generar'} Consejo
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin"/>
          </div>
        ) : advice && advice[adviceMode] ? (
          <div className="space-y-4">
            {adviceMode === 'startup' ? (
                <p className="text-gray-300 whitespace-pre-wrap">{advice.startup}</p>
            ) : (
                renderSocialAdvice(advice.social)
            )}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-purple-500/20">
              <Button variant="outline" className="text-green-300 border-green-500/50" onClick={saveAdvice}>
                  <Save className="w-4 h-4 mr-2"/> Guardar Consejo
              </Button>
              <Button variant="outline" className="text-blue-300 border-blue-500/50" onClick={anchorOnGravity}>
                  <Anchor className="w-4 h-4 mr-2"/> Anclar en Gravity (v1)
              </Button>
            </div>
            {advice[`${adviceMode}_hash`] && <p className="text-xs text-gray-500 mt-2">Hash del prompt: {advice[`${adviceMode}_hash`]}</p>}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Selecciona un modo y genera un consejo para tu proyecto.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdviceTab;