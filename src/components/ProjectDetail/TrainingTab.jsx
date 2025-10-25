import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { lessonsData } from '@/contexts/ProjectContext/lessonsData';

const TrainingTab = ({ project, updateProject }) => {
  const course = lessonsData.impactoOng;
  const projectProgress = project.training_progress || {};

  const handleToggleComplete = (lessonId) => {
    const newProgress = {
      ...projectProgress,
      [lessonId]: !projectProgress[lessonId],
    };
    if (updateProject) {
      updateProject(project.id, { training_progress: newProgress });
    }
  };
  
  const completedLessons = Object.values(projectProgress).filter(Boolean).length;
  const totalLessons = course.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-yellow-400" />
          Formación: Impacto y Gestión de ONGs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-300">Progreso del curso</p>
            <p className="text-sm font-semibold text-white">{completedLessons} / {totalLessons} lecciones</p>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="space-y-4">
          {course.map(lesson => {
            const isCompleted = projectProgress[lesson.id] === true;
            return (
              <div key={lesson.id} className={`p-4 rounded-lg transition-all ${isCompleted ? 'bg-green-500/20 border-l-4 border-green-400' : 'bg-slate-800/50'}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <div className="flex items-center mb-1">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      ) : (
                        <div className="w-5 h-5 mr-2" />
                      )}
                      <h4 className="font-semibold text-white">{lesson.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 ml-7 flex items-center">
                      <Clock className="w-3 h-3 mr-1.5"/>{lesson.duration}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <Button onClick={() => handleToggleComplete(lesson.id)} size="sm" variant={isCompleted ? "outline" : "default"} className={isCompleted ? "text-green-300 border-green-500/50" : "bg-yellow-600 hover:bg-yellow-700"}>
                      {isCompleted ? 'Marcar como no completada' : 'Marcar como completada'}
                    </Button>
                  </div>
                </div>
                 <p className="text-sm text-gray-400 mt-2 ml-7">{lesson.content}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingTab;