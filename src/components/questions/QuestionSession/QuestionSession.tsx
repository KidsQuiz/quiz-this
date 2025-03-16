
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useQuestionSession } from './hooks/useQuestionSession';
import QuestionDisplay from './QuestionDisplay';
import CompletionScreen from './CompletionScreen';
import BoomEffect from './components/BoomEffect';
import RelaxAnimation from './components/RelaxAnimation';
import { QuestionSessionProps } from './types';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { supabase } from '@/integrations/supabase/client';

const QuestionSession: React.FC<QuestionSessionProps> = ({ kidId, kidName, onClose }) => {
  const {
    isLoading,
    currentQuestion,
    answerOptions,
    questions,
    currentQuestionIndex,
    timeRemaining,
    sessionComplete,
    correctAnswers,
    totalPoints,
    selectedAnswerId,
    answerSubmitted,
    isCorrect,
    showWowEffect,
    showBoomEffect,
    showRelaxAnimation,
    isModalOpen,
    handleSelectAnswer,
    handleDialogClose,
    setShowBoomEffect,
    loadQuestions
  } = useQuestionSession(kidId, kidName, onClose);

  // Render a loading state if currentQuestion is null but we're not at the completion screen
  const isLoadingOrMissingQuestion = isLoading || (!sessionComplete && !currentQuestion);

  // Handler for when the boom effect is complete or dismissed
  const handleBoomEffectComplete = () => {
    console.log("Boom effect complete, hiding animation");
    setShowBoomEffect(false);
  };

  // Auto-load all assigned packages for the kid
  useEffect(() => {
    const loadAssignedPackages = async () => {
      try {
        console.log(`Auto-loading packages for kid ${kidId}`);
        
        // Get all assigned packages for this kid
        const { data: assignedPackages, error } = await supabase
          .from('kid_packages')
          .select('package_id')
          .eq('kid_id', kidId);
          
        if (error) throw error;
        
        if (assignedPackages && assignedPackages.length > 0) {
          const packageIds = assignedPackages.map(p => p.package_id);
          console.log(`Found ${packageIds.length} assigned packages, loading questions:`, packageIds);
          await loadQuestions(packageIds);
        } else {
          console.warn(`No packages assigned to kid ${kidId}`);
        }
      } catch (error) {
        console.error('Error auto-loading assigned packages:', error);
      }
    };
    
    loadAssignedPackages();
  }, [kidId, loadQuestions]);

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] p-0 gap-0 border-0 overflow-hidden min-h-[600px]">
          {isLoadingOrMissingQuestion && (
            <DialogTitle asChild>
              <VisuallyHidden>Loading Questions</VisuallyHidden>
            </DialogTitle>
          )}
          
          {sessionComplete ? (
            <CompletionScreen 
              kidName={kidName}
              correctAnswers={correctAnswers} 
              totalQuestions={questions.length}
              totalPoints={totalPoints}
              onClose={onClose}
            />
          ) : isLoadingOrMissingQuestion ? (
            <div className="flex flex-col items-center justify-center p-12 h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-lg">Loading questions...</p>
            </div>
          ) : currentQuestion && (
            <QuestionDisplay
              currentQuestion={currentQuestion}
              answerOptions={answerOptions}
              currentQuestionIndex={currentQuestionIndex}
              questionsTotal={questions.length}
              timeRemaining={timeRemaining}
              selectedAnswerId={selectedAnswerId}
              answerSubmitted={answerSubmitted}
              isCorrect={isCorrect}
              showWowEffect={showWowEffect}
              showRelaxAnimation={showRelaxAnimation}
              handleSelectAnswer={handleSelectAnswer}
            />
          )}
        </DialogContent>
      </Dialog>

      {showBoomEffect && (
        <BoomEffect 
          isVisible={showBoomEffect} 
          onComplete={handleBoomEffectComplete} 
          totalPoints={totalPoints}
        />
      )}

      {showRelaxAnimation && (
        <RelaxAnimation show={showRelaxAnimation} />
      )}
    </>
  );
};

export default QuestionSession;
