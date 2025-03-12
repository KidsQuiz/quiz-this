
import React from 'react';
import KidCard from './KidCard';
import { Button } from '@/components/ui/button';
import { Kid } from '@/hooks/useKidsData';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface KidsListProps {
  kids: Kid[];
  isLoading: boolean;
  onDragEnd: (result: DropResult) => void;
  onEditKid: (id: string) => void;
  onDeleteKid: (id: string) => void;
  onAddKid: () => void;
  onAssignPackages?: (id: string, name: string) => void;
  onStartQuestions?: (id: string, name: string) => void;
}

const KidsList = ({
  kids,
  isLoading,
  onDragEnd,
  onEditKid,
  onDeleteKid,
  onAddKid,
  onAssignPackages,
  onStartQuestions
}: KidsListProps) => {
  if (isLoading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-56 rounded-lg bg-muted animate-pulse"></div>)}
      </div>;
  }
  
  if (kids.length === 0) {
    return <div className="text-center py-12">
        <p className="text-muted-foreground">No kids added yet.</p>
        <Button variant="outline" onClick={onAddKid} className="mt-4">
          Add your first kid
        </Button>
      </div>;
  }
  
  return <div className="mb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="kids-list" direction="horizontal">
          {provided => <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" {...provided.droppableProps} ref={provided.innerRef}>
              {kids.map((kid, index) => <Draggable key={kid.id} draggableId={kid.id} index={index}>
                  {provided => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                      />
                    </div>}
                </Draggable>)}
              {provided.placeholder}
            </div>}
        </Droppable>
      </DragDropContext>
    </div>;
};

export default KidsList;
