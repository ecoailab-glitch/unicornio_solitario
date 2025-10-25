import React from 'react';
import SectionCard from './SectionCard';
import { PlusCircle } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <SectionCard title="" delay={0}>
      <div className="text-center py-16">
        <div className="flex justify-center items-center space-x-6 mb-8">
          <img-replace src="/placeholder-impacthub.png" alt="Logo Impact Hub Málaga" className="h-20 metallic-gradient p-2 rounded-md" />
          <PlusCircle className="w-10 h-10 text-purple-400" />
          <img-replace src="/placeholder-unicornio-solitario.png" alt="Logo Unicornio Solitario" className="h-24 metallic-gradient p-2 rounded-md" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Bienvenida, María.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Este es tu panel estratégico como mentora institucional.
          Gestiona tus proyectos, activa talento y observa tu impacto crecer año a año.
        </p>
      </div>
    </SectionCard>
  );
};

export default WelcomeScreen;