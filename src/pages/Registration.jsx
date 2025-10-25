
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Building, HeartHandshake, Briefcase, GraduationCap, DollarSign } from 'lucide-react';

const ProfileForm = ({ tipo, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        ciudad: '',
        experiencia: '',
        sectores: '',
        descripcion: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="nombre" className="text-gray-300">Nombre Completo</Label>
                    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" />
                </div>
                <div>
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="telefono" className="text-gray-300">Teléfono</Label>
                    <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="bg-slate-800/50 border-slate-700" />
                </div>
                <div>
                    <Label htmlFor="ciudad" className="text-gray-300">Ciudad</Label>
                    <Input id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} className="bg-slate-800/50 border-slate-700" />
                </div>
            </div>
            { (tipo === 'mentor' || tipo === 'inversor') && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="experiencia" className="text-gray-300">Años de Experiencia</Label>
                        <Input id="experiencia" name="experiencia" type="number" value={formData.experiencia} onChange={handleChange} className="bg-slate-800/50 border-slate-700" />
                    </div>
                    <div>
                        <Label htmlFor="sectores" className="text-gray-300">Sectores de Interés (separados por comas)</Label>
                        <Input id="sectores" name="sectores" value={formData.sectores} onChange={handleChange} className="bg-slate-800/50 border-slate-700" />
                    </div>
                </div>
            )}
            <div>
                <Label htmlFor="descripcion" className="text-gray-300">Descripción / Biografía</Label>
                <Textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} className="bg-slate-800/50 border-slate-700" />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                    {loading ? 'Registrando...' : 'Completar Registro'}
                </Button>
            </div>
        </form>
    );
};

const CorporateRegistrationForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        main_sector: '',
        location: '',
        website_url: '',
        contact_person_name: '',
        contact_email: '',
        short_description: '',
        innovation_lines: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            innovation_lines: formData.innovation_lines.split(',').map(s => s.trim()),
        });
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="company_name" className="text-gray-300">Nombre Corporativo</Label><Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="main_sector" className="text-gray-300">Sector Principal</Label><Input id="main_sector" name="main_sector" value={formData.main_sector} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="location" className="text-gray-300">Ubicación</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="website_url" className="text-gray-300">Web Corporativa</Label><Input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="contact_person_name" className="text-gray-300">Persona de Contacto</Label><Input id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="contact_email" className="text-gray-300">Email de Contacto</Label><Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
            </div>
            <div><Label htmlFor="short_description" className="text-gray-300">Descripción Breve</Label><Textarea id="short_description" name="short_description" value={formData.short_description} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
            <div><Label htmlFor="innovation_lines" className="text-gray-300">Líneas de Innovación (separadas por comas)</Label><Input id="innovation_lines" name="innovation_lines" value={formData.innovation_lines} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
            <div className="flex justify-end"><Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">{loading ? 'Registrando...' : 'Completar Registro'}</Button></div>
        </form>
    );
};

const SocialProjectRegistrationForm = ({ onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        project_name: '',
        impact_area: '',
        location: '',
        website_url: '',
        contact_person_name: '',
        contact_email: '',
        summary: '',
        main_purpose: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="project_name" className="text-gray-300">Nombre del Proyecto/ONG</Label><Input id="project_name" name="project_name" value={formData.project_name} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="impact_area" className="text-gray-300">Área de Impacto</Label><Input id="impact_area" name="impact_area" value={formData.impact_area} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="location" className="text-gray-300">Ubicación</Label><Input id="location" name="location" value={formData.location} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="website_url" className="text-gray-300">Sitio Web</Label><Input id="website_url" name="website_url" type="url" value={formData.website_url} onChange={handleChange} className="bg-slate-800/_50 border-slate-700" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="contact_person_name" className="text-gray-300">Persona de Contacto</Label><Input id="contact_person_name" name="contact_person_name" value={formData.contact_person_name} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
                <div><Label htmlFor="contact_email" className="text-gray-300">Email de Contacto</Label><Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} required className="bg-slate-800/50 border-slate-700" /></div>
            </div>
            <div><Label htmlFor="summary" className="text-gray-300">Resumen del Proyecto</Label><Textarea id="summary" name="summary" value={formData.summary} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
            <div><Label htmlFor="main_purpose" className="text-gray-300">Propósito o Causa Principal</Label><Textarea id="main_purpose" name="main_purpose" value={formData.main_purpose} onChange={handleChange} className="bg-slate-800/50 border-slate-700" /></div>
            <div className="flex justify-end"><Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">{loading ? 'Registrando...' : 'Completar Registro'}</Button></div>
        </form>
    );
};


const Registration = () => {
    const { tipo } = useParams();
    const navigate = useNavigate();
    const { login } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const profileInfo = {
        nodo: { title: 'Registro de Nodo', icon: GraduationCap },
        emprendedor: { title: 'Registro de Emprendedor', icon: Briefcase },
        mentor: { title: 'Registro de Mentor', icon: UserPlus },
        inversor: { title: 'Registro de Inversor', icon: DollarSign },
        gran_empresa: { title: 'Registro de Gran Empresa', icon: Building },
        proyecto_social: { title: 'Registro de Proyecto Social', icon: HeartHandshake },
    };

    const { title, icon: Icon } = profileInfo[tipo] || { title: 'Registro', icon: UserPlus };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error("Usuario no autenticado.");

            let entityData = {};
            let tableName = '';
            let userProfileData = {};

            if (tipo === 'gran_empresa') {
                tableName = 'large_companies';
                entityData = formData;
                userProfileData = { nombre: formData.company_name, tipo };
            } else if (tipo === 'proyecto_social') {
                tableName = 'social_projects';
                entityData = formData;
                userProfileData = { nombre: formData.project_name, tipo };
            } else {
                tableName = 'profiles';
                entityData = { ...formData, id: authUser.id, tipo };
                userProfileData = { ...formData, tipo };
            }

            if (tipo === 'gran_empresa' || tipo === 'proyecto_social') {
                const { data: entityResult, error: entityError } = await supabase
                    .from(tableName)
                    .insert([entityData])
                    .select()
                    .single();

                if (entityError) throw entityError;

                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({ id: authUser.id, ...userProfileData, entity_id: entityResult.id });
                
                if (profileError) throw profileError;
                login({ ...userProfileData, id: authUser.id, entity_id: entityResult.id });

            } else {
                 const { error } = await supabase.from(tableName).upsert(entityData);
                 if (error) throw error;
                 login({ ...userProfileData, id: authUser.id });
            }

            toast({
                title: "¡Registro completado!",
                description: "Tu perfil ha sido creado exitosamente.",
            });
            navigate(`/dashboard/${tipo}`);

        } catch (error) {
            console.error('Error en el registro:', error);
            toast({
                title: "Error en el registro",
                description: error.message || "No se pudo completar el registro. Inténtalo de nuevo.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        switch (tipo) {
            case 'gran_empresa':
                return <CorporateRegistrationForm onSubmit={handleSubmit} loading={loading} />;
            case 'proyecto_social':
                return <SocialProjectRegistrationForm onSubmit={handleSubmit} loading={loading} />;
            default:
                return <ProfileForm tipo={tipo} onSubmit={handleSubmit} loading={loading} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl">
                <Button variant="ghost" onClick={() => navigate('/')} className="text-purple-300 hover:text-white mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
                </Button>
                <motion.div
                    className="glass-effect rounded-2xl p-6 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <Icon className="w-10 h-10 text-purple-400" />
                        <h1 className="text-3xl font-bold gradient-text">{title}</h1>
                    </div>
                    <p className="text-gray-400 mb-8">Completa los siguientes campos para unirte al ecosistema del Unicornio Solitario.</p>
                    {renderForm()}
                </motion.div>
            </div>
        </div>
    );
};

export default Registration;
