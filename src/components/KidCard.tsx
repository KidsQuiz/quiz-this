
import React from 'react';
import { Card } from '@/components/ui/card';
import Avatar from './Avatar';
import { Baby, GripVertical } from 'lucide-react';

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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="self-stretch flex justify-center items-center mb-2">
            <GripVertical className="text-muted-foreground h-5 w-5" />
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
          
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => onEdit(id)} 
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(id)} 
              className="px-3 py-1 text-xs bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KidCard;
