
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { WrongAnswer, GroupedWrongAnswer } from '../types';
import { groupWrongAnswers } from '../utils/wrongAnswersUtils';

export const useWrongAnswers = (kidId: string, isOpen: boolean) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [groupedWrongAnswers, setGroupedWrongAnswers] = useState<GroupedWrongAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wrong answers when the dashboard is opened
  useEffect(() => {
    if (isOpen && kidId) {
      fetchWrongAnswers();
    }
  }, [isOpen, kidId]);

  // Process and group wrong answers
  useEffect(() => {
    if (wrongAnswers.length > 0) {
      const groupedAnswers = groupWrongAnswers(wrongAnswers);
      setGroupedWrongAnswers(groupedAnswers);
    } else {
      setGroupedWrongAnswers([]);
    }
  }, [wrongAnswers]);

  const fetchWrongAnswers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching wrong answers for kid:', kidId);
      const { data, error } = await supabase
        .from('kid_wrong_answers')
        .select('*')
        .eq('kid_id', kidId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wrong answers:', error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('error')
        });
        throw error;
      }
      
      console.log('Wrong answers fetched:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('Sample wrong answer:', data[0]);
      }
      
      setWrongAnswers(data || []);
    } catch (error) {
      console.error('Error fetching wrong answers:', error);
      setWrongAnswers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetWrongAnswers = async () => {
    setIsLoading(true);
    try {
      console.log('Resetting wrong answers for kid:', kidId);
      
      // Make the database call to delete wrong answers
      const { error } = await supabase
        .from('kid_wrong_answers')
        .delete()
        .eq('kid_id', kidId);

      if (error) {
        console.error('Error resetting wrong answers:', error);
        toast({
          variant: "destructive",
          title: t('error'),
          description: t('errorResettingWrongAnswers')
        });
        throw error;
      }
      
      // Display success message
      toast({
        title: t('success'),
        description: t('wrongAnswersResetSuccess')
      });
      
      // Clear the local state
      setWrongAnswers([]);
      setGroupedWrongAnswers([]);
    } catch (error) {
      console.error('Error resetting wrong answers:', error);
      toast({
        variant: "destructive",
        title: t('error'),
        description: t('errorResettingWrongAnswers')
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wrongAnswers,
    groupedWrongAnswers,
    isLoading,
    resetWrongAnswers
  };
};
