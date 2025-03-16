
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, RotateCcw, ChartPieIcon, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface KidActionsProps {
  id: string;
  name: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onResetPoints?: (id: string, name: string) => void;
  onViewWrongAnswers?: (id: string, name: string) => void;
  onResetWrongAnswers?: (id: string, name: string) => void;
}

const KidActions = ({ 
  id, 
  name, 
  onEdit, 
  onDelete, 
  onResetPoints,
  onViewWrongAnswers,
  onResetWrongAnswers
}: KidActionsProps) => {
  const { t } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 absolute top-2 right-2">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(id)}>
          <Pencil className="mr-2 h-4 w-4" />
          {t('edit')}
        </DropdownMenuItem>
        
        {onResetPoints && (
          <DropdownMenuItem onClick={() => onResetPoints(id, name)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('resetPoints')}
          </DropdownMenuItem>
        )}
        
        {onViewWrongAnswers && (
          <DropdownMenuItem onClick={() => onViewWrongAnswers(id, name)}>
            <ChartPieIcon className="mr-2 h-4 w-4" />
            {t('viewWrongAnswers')}
          </DropdownMenuItem>
        )}
        
        {onResetWrongAnswers && (
          <DropdownMenuItem onClick={() => onResetWrongAnswers(id, name)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('resetWrongAnswers')}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-red-600" 
          onClick={() => onDelete(id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default KidActions;
