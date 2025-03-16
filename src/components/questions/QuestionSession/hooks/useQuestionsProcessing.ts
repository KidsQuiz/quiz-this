
import { useCallback } from 'react';
import { Question } from '@/hooks/questionsTypes';

type PackageOrder = {
  packageId: string;
  order: 'sequential' | 'shuffle';
};

export const useQuestionsProcessing = () => {
  const processQuestions = useCallback((
    questionsData: Question[],
    selectedPackageIds: string[],
    packagePresentationOrders: PackageOrder[]
  ): Question[] => {
    if (questionsData.length === 0) return [];
    
    console.log(`Processing ${questionsData.length} total questions from all packages`);
    
    // Convert package orders to a map for easier lookup
    const orderMap: Record<string, 'sequential' | 'shuffle'> = {};
    packagePresentationOrders.forEach(result => {
      orderMap[result.packageId] = result.order;
    });
    
    // Group questions by package_id
    const questionsByPackage: Record<string, Question[]> = {};
    questionsData.forEach(question => {
      if (!questionsByPackage[question.package_id]) {
        questionsByPackage[question.package_id] = [];
      }
      questionsByPackage[question.package_id].push(question);
    });
    
    // Process and order questions by package
    let allQuestions: Question[] = [];
    
    for (const packageId of selectedPackageIds) {
      const packageQuestions = questionsByPackage[packageId] || [];
      
      // If this package is set to shuffle, randomize its questions
      if (orderMap[packageId] === 'shuffle') {
        packageQuestions.sort(() => Math.random() - 0.5);
      } else {
        // For sequential packages, sort by created_at
        packageQuestions.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      
      allQuestions = [...allQuestions, ...packageQuestions];
    }
    
    // Deduplicate questions by ID
    const uniqueQuestionsMap = new Map<string, Question>();
    allQuestions.forEach(question => {
      if (!uniqueQuestionsMap.has(question.id)) {
        uniqueQuestionsMap.set(question.id, question);
      }
    });
    
    // Convert back to array
    const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
    
    console.log(`Processed ${uniqueQuestions.length} unique questions across all packages`);
    
    // Always shuffle questions across different packages
    return [...uniqueQuestions].sort(() => Math.random() - 0.5);
  }, []);

  return { processQuestions };
};
