
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuestionImport } from '@/hooks/questions/useQuestionImport';
import { Upload, File } from 'lucide-react';

interface ImportQuestionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packageId: string;
}

const ImportQuestionsDialog = ({ isOpen, onClose, onSuccess, packageId }: ImportQuestionsDialogProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isImporting, processCSVFile } = useQuestionImport(packageId, onSuccess);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleImport = async () => {
    if (selectedFile) {
      await processCSVFile(selectedFile, user?.id);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('importQuestions')}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              {t('importQuestionsInstructions')}
            </p>
            <ul className="list-disc text-sm text-muted-foreground pl-5 space-y-1">
              <li>{t('csvMustContain')}</li>
              <li>{t('csvExample')}</li>
              <li>{t('correctAnswerNote')}</li>
            </ul>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          
          <div className="flex items-center justify-center w-full">
            <div 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 p-4"
              onClick={handleSelectFile}
            >
              <File className="w-8 h-8 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                {selectedFile ? selectedFile.name : t('clickToSelectCSV')}
              </p>
              <p className="text-xs text-gray-500">{t('onlyCSVSupported')}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isImporting}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
          >
            {isImporting ? (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4 animate-spin" />
                {t('importing')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {t('import')}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportQuestionsDialog;
