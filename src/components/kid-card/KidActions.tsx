
import React from 'react';
import { Edit, Trash2, MoreVertical, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidActionsProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onResetPoints?: (id: string, name: string) => void;
}

const KidActions = ({ 
  id, 
  name, 
  onEdit, 
  onDelete, 
  onResetPoints 
}: KidActionsProps) => {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-8 w-8 p-0 rounded-full hover:bg-accent flex items-center justify-center focus:outline-none">
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={() => onEdit(id)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          <span>{t('edit')}</span>
        </DropdownMenuItem>
        
        {onResetPoints && (
          <DropdownMenuItem 
            onClick={() => onResetPoints(id, name)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{t('resetPoints')}</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(id)}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>{t('delete')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KidActions;
