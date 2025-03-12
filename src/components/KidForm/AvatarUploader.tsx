
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AvatarUploaderProps {
  avatarUrl: string | null;
  isLoading: boolean;
  onFileChange: (file: File | null) => void;
}

const AvatarUploader = ({ avatarUrl, isLoading, onFileChange }: AvatarUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileChange(file);
      
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Avatar</Label>
      <Input
        id="avatar"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
        className="cursor-pointer"
      />
      
      {(previewUrl || avatarUrl) && (
        <div className="mt-2 flex justify-center">
          <img 
            src={previewUrl || avatarUrl || ''} 
            alt="Avatar preview" 
            className="h-24 w-24 rounded-full object-cover border" 
          />
        </div>
      )}
    </div>
  );
};

export default AvatarUploader;
