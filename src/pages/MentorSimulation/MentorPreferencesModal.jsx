import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Save, Bell, Mail, Smartphone, Clock, Tag } from 'lucide-react';

const MentorPreferencesModal = ({ isOpen, onClose, preferences, onSave }) => {
  const [currentPreferences, setCurrentPreferences] = useState(preferences);

  const handleChange = (field, value) => {
    setCurrentPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(currentPreferences);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800 p-6 rounded-xl shadow-2xl w-full max-w-lg border border-purple-700/50"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold gradient-text">Preferencias de Mentoría</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6 text-sm">
          {/* Notificaciones */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium text-purple-300 flex items-center"><Bell className="w-5 h-5 mr-2"/>Notificaciones</h4>
            <label className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors">
              <span><Mail className="w-4 h-4 mr-2 inline-block text-sky-400"/>Recibir alertas por email</span>
              <input 
                type="checkbox" 
                checked={currentPreferences.receiveEmailAlerts} 
                onChange={(e) => handleChange('receiveEmailAlerts', e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-500 bg-slate-600 border-purple-400 rounded focus:ring-purple-400"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors">
              <span><Smartphone className="w-4 h-4 mr-2 inline-block text-green-400"/>Recibir notificaciones push (app móvil)</span>
              <input 
                type="checkbox" 
                checked={currentPreferences.receivePushAlerts} 
                onChange={(e) => handleChange('receivePushAlerts', e.target.checked)}
                className="form-checkbox h-5 w-5 text-purple-500 bg-slate-600 border-purple-400 rounded focus:ring-purple-400"
              />
            </label>
            <div className="p-3 bg-slate-700/50 rounded-md">
              <label htmlFor="alertFrequency" className="block mb-1 text-gray-300"><Clock className="w-4 h-4 mr-2 inline-block text-orange-400"/>Frecuencia de Resumen de Alertas</label>
              <select 
                id="alertFrequency"
                value={currentPreferences.alertFrequency}
                onChange={(e) => handleChange('alertFrequency', e.target.value)}
                className="w-full bg-slate-600 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensualmente</option>
                <option value="never">Nunca (solo alertas críticas)</option>
              </select>
            </div>
          </div>

          {/* Seguimiento de Proyectos */}
          <div className="space-y-3">
             <h4 className="text-lg font-medium text-purple-300 flex items-center"><Tag className="w-5 h-5 mr-2"/>Seguimiento de Proyectos</h4>
             <div className="p-3 bg-slate-700/50 rounded-md">
              <label htmlFor="highlightSectors" className="block mb-1 text-gray-300">Sectores de Interés (separados por coma)</label>
              <input 
                type="text"
                id="highlightSectors"
                value={currentPreferences.highlightSectors.join(', ')}
                onChange={(e) => handleChange('highlightSectors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder="Ej: IA, Sostenibilidad, Fintech"
                className="w-full bg-slate-600 border border-purple-500/30 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Los proyectos en estos sectores se destacarán en tu panel.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-opacity">
            <Save className="w-4 h-4 mr-2" /> Guardar Preferencias
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MentorPreferencesModal;