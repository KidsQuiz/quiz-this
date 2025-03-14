import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMilestonesData, Milestone } from '@/hooks/useMilestonesData';
import { Plus, Edit, Trash2, Trophy } from 'lucide-react';
import MilestoneForm from './MilestoneForm';
import { Progress } from '@/components/ui/progress';

interface MilestonesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  kidId: string;
  kidName: string;
  kidPoints: number;
}

const MilestonesDialog = ({ isOpen, onClose, kidId, kidName, kidPoints }: MilestonesDialogProps) => {
  const { t } = useLanguage();
  const { 
    milestones, 
    isLoading, 
    fetchMilestones, 
    addMilestone, 
    updateMilestone, 
    deleteMilestone,
    getCurrentMilestone,
    getNextMilestone,
    getMilestoneProgress
  } = useMilestonesData(kidId);
  
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>(undefined);
  
  useEffect(() => {
    if (isOpen) {
      fetchMilestones();
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (milestones.length > 0 && kidPoints !== undefined) {
      setCurrentMilestone(getCurrentMilestone(kidPoints));
      setNextMilestone(getNextMilestone(kidPoints));
      setProgressPercentage(getMilestoneProgress(kidPoints));
    }
  }, [milestones, kidPoints]);
  
  const handleOpenAddForm = () => {
    setSelectedMilestone(undefined);
    setIsFormOpen(true);
  };
  
  const handleOpenEditForm = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedMilestone(undefined);
  };
  
  const handleSaveMilestone = async (data: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    if (selectedMilestone) {
      await updateMilestone(selectedMilestone.id, data);
    } else {
      await addMilestone(data);
    }
    fetchMilestones();
  };
  
  const handleDeleteMilestone = async (id: string) => {
    if (confirm(t('confirmDeleteMilestone'))) {
      await deleteMilestone(id);
    }
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('milestones')} - {kidName}</DialogTitle>
            <DialogDescription>
              {t('milestonesDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">{t('currentStatus')}</h3>
              <div className="flex items-center mb-3">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">{kidPoints} {t('points')}</span>
              </div>
              
              {currentMilestone ? (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground">
                    {t('currentMilestone')}: <span className="font-medium">{currentMilestone.name}</span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-2">{t('noMilestoneReached')}</p>
              )}
              
              {nextMilestone && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{kidPoints} {t('points')}</span>
                    <span>{nextMilestone.points_required} {t('points')}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {nextMilestone.points_required - kidPoints} {t('pointsToNextMilestone')}: <span className="font-medium">{nextMilestone.name}</span>
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">{t('allMilestones')}</h3>
                <Button size="sm" onClick={handleOpenAddForm}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('addMilestone')}
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">{t('loading')}...</p>
                </div>
              ) : milestones.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">{t('noMilestones')}</p>
                  <Button variant="outline" className="mt-4" onClick={handleOpenAddForm}>
                    {t('addFirstMilestone')}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {milestones.map((milestone) => (
                    <li 
                      key={milestone.id} 
                      className={`flex items-center justify-between p-3 rounded-md border ${
                        currentMilestone?.id === milestone.id ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 mr-3">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{milestone.name}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.points_required} {t('points')}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditForm(milestone)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMilestone(milestone.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <MilestoneForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveMilestone}
        kidId={kidId}
        milestone={selectedMilestone}
      />
    </>
  );
};

export default MilestonesDialog;
