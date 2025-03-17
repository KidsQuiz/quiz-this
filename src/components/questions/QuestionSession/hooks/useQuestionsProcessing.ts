
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
    console.log('Package presentation orders:', packagePresentationOrders);
    
    // Convert package orders to a map for easier lookup
    const orderMap: Record<string, 'sequential' | 'shuffle'> = {};
    packagePresentationOrders.forEach(result => {
      orderMap[result.packageId] = result.order;
      console.log(`Package ${result.packageId} presentation order: ${result.order}`);
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
      console.log(`Package ${packageId} has ${packageQuestions.length} questions with order ${orderMap[packageId]}`);
      
      // If this package is set to shuffle, randomize its questions
      if (orderMap[packageId] === 'shuffle') {
        console.log(`Shuffling questions for package ${packageId}`);
        // Use Fisher-Yates shuffle for better randomization
        for (let i = packageQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [packageQuestions[i], packageQuestions[j]] = [packageQuestions[j], packageQuestions[i]];
        }
      } else {
        // For sequential packages, sort by created_at
        console.log(`Ordering questions sequentially for package ${packageId}`);
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
    
    console.log(`Final question order: ${uniqueQuestions.map(q => q.id).join(', ')}`);
    console.log(`Processed ${uniqueQuestions.length} unique questions across all packages`);
    
    return uniqueQuestions;
  }, []);

  return { processQuestions };
};
