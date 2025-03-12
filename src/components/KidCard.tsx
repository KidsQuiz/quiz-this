
import React from 'react';
import { Card } from '@/components/ui/card';
import Avatar from './Avatar';
import { Baby, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    <Card className="overflow-hidden transition-colors hover:shadow-md cursor-grab active:cursor-grabbing">
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="self-stretch flex justify-end items-center mb-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 p-0 rounded-full hover:bg-accent flex items-center justify-center focus:outline-none">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => onEdit(id)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                
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
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KidCard;
