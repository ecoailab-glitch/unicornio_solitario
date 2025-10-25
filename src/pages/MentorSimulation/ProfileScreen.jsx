import React from 'react';
import SectionCard from './SectionCard';
import { User } from 'lucide-react';

const ProfileScreen = ({ mariaAlonsoData }) => {
  return (
    <SectionCard title="Perfil de María Alonso" icon={User} delay={0.1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4">
        {Object.entries(mariaAlonsoData).map(([key, value]) => {
          if (key === 'proyectosActuales') {
            return (
              <div key={key} className="md:col-span-2">
                <p className="text-sm text-purple-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                <p className="text-lg text-white">
                  {value.total} (Semilla: {value.semilla}, Pegaso: {value.pegaso}, Dragón: {value.dragon}, Unicornio: {value.unicornio})
                </p>
              </div>
            );
          }
          return (
            <div key={key}>
              <p className="text-sm text-purple-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
              <p className="text-lg text-white">{value}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default ProfileScreen;