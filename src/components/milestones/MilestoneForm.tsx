import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Trophy, Award, Star, Medal, Gift, Badge, Flag, Gem } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Milestone } from '@/hooks/useMilestonesData';

interface MilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => void;
  kidId: string;
  milestone?: Milestone;
}

const MILESTONE_ICONS = [
  { name: 'Trophy', icon: <Trophy className="h-12 w-12" /> },
  { name: 'Award', icon: <Award className="h-12 w-12" /> },
  { name: 'Star', icon: <Star className="h-12 w-12" /> },
  { name: 'Medal', icon: <Medal className="h-12 w-12" /> },
  { name: 'Gift', icon: <Gift className="h-12 w-12" /> },
  { name: 'Badge', icon: <Badge className="h-12 w-12" /> },
  { name: 'Flag', icon: <Flag className="h-12 w-12" /> },
  { name: 'Gem', icon: <Gem className="h-12 w-12" /> },
];

const MilestoneForm = ({ isOpen, onClose, onSave, kidId, milestone }: MilestoneFormProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [pointsRequired, setPointsRequired] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Trophy');
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = !!milestone;
  
  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setPointsRequired(milestone.points_required.toString());
      if (milestone.image_url) {
        const iconName = milestone.image_url.split('/').pop()?.split('.')[0];
        if (iconName && MILESTONE_ICONS.some(i => i.name.toLowerCase() === iconName.toLowerCase())) {
          setSelectedIcon(iconName.charAt(0).toUpperCase() + iconName.slice(1));
        }
      }
    } else {
      setName('');
      setPointsRequired('');
      setSelectedIcon('Trophy');
    }
  }, [milestone, isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !pointsRequired) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: "Please fill all required fields"
      });
      return;
    }
    
    setIsLoading(true);
    
    const points = parseInt(pointsRequired);
    if (isNaN(points) || points < 0) {
      toast({
        variant: "destructive",
        title: t("error"),
        description: "Points must be a positive number"
      });
      setIsLoading(false);
      return;
    }
    
    const iconUrl = `/icons/${selectedIcon.toLowerCase()}.svg`; 
    
    const milestoneData = {
      name,
      points_required: points,
      image_url: iconUrl,
      kid_id: kidId
    };
    
    onSave(milestoneData);
    onClose();
    setIsLoading(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? t('editMilestone') : t('addMilestone')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('milestoneName')}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="points">{t('pointsRequired')}</Label>
            <Input
              id="points"
              type="number"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(e.target.value)}
              placeholder="100"
              min="0"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('icon')}</Label>
            <div className="grid grid-cols-4 gap-3">
              {MILESTONE_ICONS.map((icon) => (
                <div 
                  key={icon.name}
                  className={`p-2 border rounded-md cursor-pointer flex flex-col items-center justify-center hover:bg-accent transition-colors ${
                    selectedIcon === icon.name ? 'border-primary bg-accent' : 'border-border'
                  }`}
                  onClick={() => setSelectedIcon(icon.name)}
                >
                  {icon.icon}
                  <span className="mt-1 text-xs">{icon.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('cancel')}
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t('loading') : (isEditMode ? t('update') : t('create'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MilestoneForm;
