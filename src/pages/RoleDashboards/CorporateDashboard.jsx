
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building, LogOut, Loader2, PlusCircle, BarChart2, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const CorporateDashboard = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [companyData, setCompanyData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (user && user.entity_id) {
                try {
                    const { data, error } = await supabase
                        .from('large_companies')
                        .select('*')
                        .eq('id', user.entity_id)
                        .single();

                    if (error) throw error;
                    setCompanyData(data);
                } catch (error) {
                    console.error("Error fetching company data:", error);
                    toast({
                        title: "Error",
                        description: "No se pudieron cargar los datos de la empresa.",
                        variant: "destructive",
                    });
                } finally {
                    setLoading(false);
                }
            } else if (user) {
                setLoading(false);
            }
        };

        fetchCompanyData();
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
            <header className="glass-effect border-b border-gray-500/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Building className="w-8 h-8 text-gray-400" />
                            <div>
                                <h1 className="text-xl font-bold gradient-text">{companyData?.company_name || user?.nombre}</h1>
                                <p className="text-xs text-gray-300">Panel de Gran Empresa</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" onClick={logout} size="sm" className="text-xs border-gray-400 text-gray-300 hover:bg-gray-500/20">
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
                    {companyData ? (
                        <div className="space-y-6">
                            <Card className="glass-effect">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white">Incubadora Corporativa</CardTitle>
                                    <CardDescription className="text-gray-400">{companyData.short_description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div><strong className="text-gray-300">Sector:</strong> {companyData.main_sector}</div>
                                        <div><strong className="text-gray-300">Ubicación:</strong> {companyData.location}</div>
                                        <div><strong className="text-gray-300">Web:</strong> <a href={companyData.website_url} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">{companyData.website_url}</a></div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Proyectos Activos</CardTitle>
                                        <Target className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{companyData.active_projects_count || 0}</div>
                                        <p className="text-xs text-gray-500">Proyectos en la incubadora</p>
                                    </CardContent>
                                </Card>
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Métricas de Innovación</CardTitle>
                                        <BarChart2 className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Ver KPIs</div>
                                        <p className="text-xs text-gray-500">Seguimiento de rendimiento</p>
                                    </CardContent>
                                </Card>
                                <Card className="glass-effect card-hover cursor-pointer" onClick={handleNotImplemented}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-300">Equipos y Mentores</CardTitle>
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">Gestionar</div>
                                        <p className="text-xs text-gray-500">Asignar recursos y talento</p>
                                    </CardContent>
                                </Card>
                                <Button onClick={handleNotImplemented} className="h-full bg-purple-600/80 hover:bg-purple-700/80 text-lg flex flex-col items-center justify-center">
                                    <PlusCircle className="w-8 h-8 mb-2" />
                                    <span>Lanzar Reto</span>
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
                                <p className="text-gray-500">Parece que aún no has registrado los datos de tu empresa.</p>
                                <Button onClick={() => navigate(`/registro/gran_empresa`)} className="mt-8 bg-purple-600 hover:bg-purple-700">Registrar Empresa</Button>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </main>
        </div>
    );
};

export default CorporateDashboard;
