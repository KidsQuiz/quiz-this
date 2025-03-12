
import React from 'react';
import { Card } from '@/components/ui/card';
import Avatar from './Avatar';
import { Baby, GripVertical, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface KidCardProps {
  id: string;
  name: string;
  age: number;
  avatarUrl: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const KidCard = ({ id, name, age, avatarUrl, onEdit, onDelete }: KidCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <div className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="self-stretch flex justify-between items-center mb-2">
                <GripVertical className="text-muted-foreground h-5 w-5" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Right-click for options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {avatarUrl ? (
                <Avatar 
                  src={avatarUrl} 
                  alt={name} 
                  size="lg"
                  className="mb-2" 
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Baby className="w-12 h-12 text-primary" />
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium">{name}</h3>
                <p className="text-sm text-muted-foreground">{age} years old</p>
              </div>
            </div>
          </div>
        </Card>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48">
        <ContextMenuItem 
          onClick={() => onEdit(id)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </ContextMenuItem>
        
        <ContextMenuItem 
          onClick={() => onDelete(id)}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default KidCard;
