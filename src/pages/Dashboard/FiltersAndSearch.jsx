import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Grid, MapPin as MapPinIcon } from 'lucide-react';

const FiltersAndSearch = ({ filters, setFilters, searchTerm, setSearchTerm, viewMode, setViewMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <div className="glass-effect rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-purple-500/30 text-white w-full"
              />
            </div>
            
            <select
              value={filters.fase}
              onChange={(e) => setFilters({...filters, fase: e.target.value})}
              className="px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white w-full sm:w-auto"
            >
              <option value="todas">Todas las fases</option>
              <option value="Semilla">Semilla</option>
              <option value="Pegaso">Pegaso</option>
              <option value="Dragón">Dragón</option>
              <option value="Unicornio">Unicornio</option>
            </select>
            
            <select
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="px-4 py-2 bg-slate-800/50 border border-purple-500/30 rounded-md text-white w-full sm:w-auto"
            >
              <option value="todos">Todos los sectores</option>
              <option value="Salud">Salud</option>
              <option value="Fintech">Fintech</option>
              <option value="Sostenibilidad">Sostenibilidad</option>
              <option value="Educación">Educación</option>
              <option value="Alimentación">Alimentación</option>
              <option value="Turismo">Turismo</option>
              <option value="Agricultura">Agricultura</option>
              <option value="Moda">Moda</option>
              <option value="Smart Cities">Smart Cities</option>
              <option value="Energía">Energía</option>
              <option value="Ciberseguridad">Ciberseguridad</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 lg:mt-0">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white'}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'bg-purple-600 hover:bg-purple-700' : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-white'}
            >
              <MapPinIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FiltersAndSearch;