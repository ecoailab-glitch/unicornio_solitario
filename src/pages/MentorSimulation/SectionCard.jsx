import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SectionCard = ({ title, icon, children, delay = 0, cardClassName = "glass-effect", contentClassName="p-0" }) => {
  const IconComponent = icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card className={`${cardClassName} mb-0 h-full`}>
        {title && (
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-md text-white flex items-center">
              {IconComponent && <IconComponent className="w-5 h-5 mr-2 text-purple-400" />}
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={contentClassName}>{children}</CardContent>
      </Card>
    </motion.div>
  );
};

export default SectionCard;