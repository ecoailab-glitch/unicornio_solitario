
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartHandshake, LogOut, Loader2, PlusCircle, BarChart2, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const SocialProjectDashboard = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjectData = async () => {
            if (user && user.entity_id) {
                try {
                    const { data, error } = await supabase
                        .from('social_projects')
                        .select('*')
                        .eq('id', user.entity_id)
                        .single();

                    if (error) throw error;
                    setProjectData(data);
                } catch (error) {
                    console.error("Error fetching social project data:", error);
                    toast({
                        title: "Error",
                        description: "No se pudieron cargar los datos del proyecto social.",
                        variant: "destructive",
                    });
                } finally {
                    setLoading(false);
                }
            } else if (user) {
                setLoading(false);
            }
        };

        fetchProjectData();
    }, [user, toast]);

    const handleNotImplemented = () => {
        toast({
            title: "🚧 Funcionalidad en desarrollo",
            description: "¡Esta característica estará disponible próximamente!",
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 text-white">
            <header className="glass-effect border-b border-pink-500/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <HeartHandshake className="w-8 h-8 text-pink-400" />
                            <div>
                                <h1 className="text-xl font-bold gradient-text bg-gradient-to-r from-pink-400 to-red-400">{projectData?.project_name || user?.nombre}</h1>
                                <p className="text-xs text-pink-300">Panel de Proyecto Social</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={logout} size="sm" className="text-xs border-pink-400 text-pink-300 hover:bg-pink-500/20">
                                <LogOut className="w-3 h-3 mr-1" /> Salir
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {projectData ? (
                         <div className="space-y-6">
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">Gestión de Impacto Social</CardTitle>
                                    <CardDescription className="text-gray-400">{projectData.summary}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p><strong className="text-gray-300">Causa Principal:</strong> {projectData.main_purpose}</p>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Beneficiarios Directos</CardTitle>
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{projectData.direct_beneficiaries || 0}</div>
                                        <p className="text-xs text-gray-500">Personas impactadas</p>
                                    </CardContent>
                                </Card>
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Métricas de Impacto</CardTitle>
                                        <BarChart2 className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Ver KPIs</div>
                                        <p className="text-xs text-gray-500">Seguimiento de ODS</p>
                                    </CardContent>
                                </Card>
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Fondos Gestionados</CardTitle>
                                        <DollarSign className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(projectData.managed_funds || 0)}</div>
                                        <p className="text-xs text-gray-500">Capital para la causa</p>
                                    </CardContent>
                                </Card>
                                <Button onClick={handleNotImplemented} className="h-full bg-pink-600/80 hover:bg-pink-700/80 text-lg flex flex-col items-center justify-center">
                                    <PlusCircle className="w-8 h-8 mb-2" />
                                    <span>Buscar Apoyo</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Card className="glass-effect">
                            <CardHeader>
                                <CardTitle className="text-2xl text-white">Completa tu Perfil</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center py-16">
                                <h2 className="text-2xl font-bold text-gray-400 mb-4">¡Bienvenido al Ecosistema!</h2>
                                <p className="text-gray-500">Parece que aún no has registrado los datos de tu proyecto social.</p>
                                <Button onClick={() => navigate(`/registro/proyecto_social`)} className="mt-8 bg-pink-600 hover:bg-pink-700">Registrar Proyecto Social</Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default SocialProjectDashboard;
