import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import KidCard from './kid-card/KidCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface Kid {
  id: string;
  name: string;
  age: number;
  avatar_url: string | null;
  points: number;
  position: number;
}

interface KidsListProps {
  kids: Kid[];
  isLoading: boolean;
  onDragEnd: (result: DropResult) => void;
  onEditKid: (id: string) => void;
  onDeleteKid: (id: string) => void;
  onAddKid: () => void;
  onAssignPackages?: (id: string, name: string) => void;
  onStartQuestions?: (id: string, name: string) => void;
  onResetPoints?: (id: string, name: string) => void;
  onManageMilestones?: (id: string, name: string, points: number) => void;
  onViewWrongAnswers?: (id: string, name: string) => void;
}

const KidsList = ({ 
  kids, 
  isLoading, 
  onDragEnd, 
  onEditKid, 
  onDeleteKid,
  onAddKid,
  onAssignPackages,
  onStartQuestions,
  onResetPoints,
  onManageMilestones,
  onViewWrongAnswers
}: KidsListProps) => {
  const { t } = useLanguage();
  const sortedKids = [...kids].sort((a, b) => a.position - b.position);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (kids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <p className="text-muted-foreground mb-4">{t('noKids')}</p>
        <Button onClick={onAddKid} className="gap-2">
          <PlusCircle className="h-5 w-5" />
          {t('addKid')}
        </Button>
      </div>
    );
  }
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="kids" direction="horizontal">
        {(provided) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mt-8"
          >
            {sortedKids.map((kid, index) => (
              <Draggable key={kid.id} draggableId={kid.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <KidCard
                      id={kid.id}
                      name={kid.name}
                      age={kid.age}
                      avatarUrl={kid.avatar_url}
                      points={kid.points}
                      onEdit={onEditKid}
                      onDelete={onDeleteKid}
                      onAssignPackages={onAssignPackages}
                      onStartQuestions={onStartQuestions}
                      onResetPoints={onResetPoints}
                      onManageMilestones={onManageMilestones}
                      onViewWrongAnswers={onViewWrongAnswers}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KidsList;
