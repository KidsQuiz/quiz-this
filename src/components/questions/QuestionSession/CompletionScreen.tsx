
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CompletionScreenProps {
  kidName: string;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  onClose: () => void;
}

const CompletionScreen = ({
  kidName,
  totalPoints,
  correctAnswers,
  totalQuestions,
  onClose
}: CompletionScreenProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Session Complete!</DialogTitle>
        <DialogDescription>
          Great job, {kidName}!
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-6 space-y-4 text-center">
        <div className="text-5xl font-bold text-primary">{totalPoints}</div>
        <p className="text-lg">Total Points Earned</p>
        
        <div className="bg-primary/10 p-4 rounded-lg">
          <p>You answered {correctAnswers} out of {totalQuestions} questions correctly.</p>
        </div>
      </div>
      
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </>
  );
};

export default CompletionScreen;
