
import React from 'react';
import { Card } from '@/components/ui/card';
import Avatar from './Avatar';
import { Baby, Edit, Trash2, MoreVertical, Star, Package, PlayCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface KidCardProps {
  id: string;
  name: string;
  age: number;
  avatarUrl: string | null;
  points: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAssignPackages?: (id: string, name: string) => void;
  onStartQuestions?: (id: string, name: string) => void;
  onResetPoints?: (id: string, name: string) => void;
}

const KidCard = ({ 
  id, 
  name, 
  age, 
  avatarUrl, 
  points, 
  onEdit, 
  onDelete, 
  onAssignPackages,
  onStartQuestions,
  onResetPoints 
}: KidCardProps) => {
  return (
    <Card className="overflow-hidden transition-colors hover:shadow-md relative">
      {/* Start Questions Mini Button */}
      {onStartQuestions && (
        <Button
          size="icon"
          variant="outline"
          className="absolute top-2 left-2 w-8 h-8 rounded-full z-10 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => onStartQuestions(id, name)}
          title="Start Questions"
        >
          <PlayCircle className="h-4 w-4" />
          <span className="sr-only">Start Questions</span>
        </Button>
      )}
      
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="self-stretch flex justify-end items-center mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-full hover:bg-accent flex items-center justify-center focus:outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {onAssignPackages && (
                  <DropdownMenuItem 
                    onClick={() => onAssignPackages(id, name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    <span>Assign Packages</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                
                {onResetPoints && (
                  <DropdownMenuItem 
                    onClick={() => onResetPoints(id, name)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset Points</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onDelete(id)}
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mb-4">
            {avatarUrl ? (
              <Avatar 
                src={avatarUrl} 
                alt={name} 
                size="lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Baby className="w-12 h-12 text-primary" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{age} years old</p>
            
            <div className="mt-4 bg-primary/10 rounded-full py-2 px-4 inline-flex items-center justify-center gap-1.5 transform transition-all hover:scale-105">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="font-semibold text-primary">{points} points</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KidCard;
