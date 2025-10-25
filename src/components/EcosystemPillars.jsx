import React from 'react';
import { motion } from 'framer-motion';
import { ecosystemPillarsData, getIconComponent } from '@/lib/ecosystemData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EcosystemPillars = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-purple-900/30 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Pilares del Ecosistema Unicornio Solitario
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Un modelo sólido, respaldado por infraestructura, ciencia, inversión y propósito.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ecosystemPillarsData.map((pillar, index) => {
            const Icon = getIconComponent(pillar.icon);
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`h-full ${pillar.id === 'final-vision' || pillar.id === 'tech-infra' || pillar.id === 'mentorship-network' ? 'lg:col-span-1 md:col-span-2' : ( pillar.id === 'universities' ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-1') }`}
              >
                <Card className={`glass-effect h-full flex flex-col border-2 ${pillar.borderColor} ${pillar.bgColor} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                  <CardHeader className="flex flex-row items-center space-x-4 p-6">
                    <Icon className={`w-10 h-10 ${pillar.color}`} />
                    <div>
                      <CardTitle className={`${pillar.color} text-xl`}>{pillar.title}</CardTitle>
                      {pillar.subtitle && <p className="text-sm text-gray-400">{pillar.subtitle}</p>}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow">
                    {pillar.details && (
                      <ul className="space-y-2 mb-4">
                        {pillar.details.map((detail, idx) => (
                          <li key={idx} className={`text-sm ${pillar.isEmphasized && idx === 0 ? 'text-lg font-semibold text-gray-200' : 'text-gray-300'}`}>
                            {pillar.isEmphasized && idx === 0 ? detail : `• ${detail}`}
                          </li>
                        ))}
                      </ul>
                    )}
                    {pillar.subsections && pillar.subsections.map((subsection, sIdx) => {
                       const SubsectionIcon = getIconComponent(subsection.icon);
                       return (
                        <div key={sIdx} className="mt-4 pt-4 border-t border-gray-700/50">
                          <h4 className={`text-md font-semibold ${pillar.color} mb-2 flex items-center`}>
                            <SubsectionIcon className="w-5 h-5 mr-2"/>
                            {subsection.title}
                          </h4>
                          <ul className="space-y-1">
                            {subsection.points.map((point, pIdx) => (
                              <li key={pIdx} className="text-xs text-gray-400 ml-2">{`› ${point}`}</li>
                            ))}
                          </ul>
                        </div>
                       )
                    })}
                    {pillar.sections && pillar.sections.map((section, sIdx) => {
                      const SectionIcon = getIconComponent(section.icon);
                      return(
                        <div key={sIdx} className={`mt-4 ${sIdx > 0 ? 'pt-4 border-t border-gray-700/50' : ''}`}>
                          <h4 className={`text-md font-semibold ${section.color || pillar.color} mb-2 flex items-center`}>
                            <SectionIcon className="w-5 h-5 mr-2"/>
                            {section.subtitle}
                          </h4>
                           <ul className="space-y-1">
                            {section.points.map((point, pIdx) => (
                              <li key={pIdx} className="text-xs text-gray-400 ml-2">{`• ${point}`}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                    {pillar.table && (
                      <div className="overflow-x-auto mt-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-slate-700/50">
                        <table className="min-w-full text-xs">
                          <thead className="bg-slate-700/50">
                            <tr>
                              {Object.keys(pillar.table[0]).map(key => (
                                <th key={key} className="p-2 text-left font-semibold text-purple-300">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {pillar.table.map((row, rIdx) => (
                              <tr key={rIdx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                {Object.values(row).map((value, vIdx) => (
                                  <td key={vIdx} className="p-2 text-gray-400">{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {pillar.quote && (
                      <blockquote className={`mt-4 p-3 border-l-4 ${pillar.borderColor} italic text-sm text-gray-400 ${pillar.bgColor.replace('bg-', 'bg-opacity-50 bg-')} rounded-r-md`}>
                        {pillar.quote}
                      </blockquote>
                    )}
                  </CardContent>
                  {pillar.isEmphasized && (
                     <div className="p-6 pt-0 text-center">
                        <motion.p 
                            className="text-lg font-semibold gradient-text"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1}}
                            transition={{ duration: 0.5, delay: (index * 0.1) + 0.3 }}
                        >
                            "Transformando el futuro, un Unicornio a la vez."
                        </motion.p>
                     </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EcosystemPillars;