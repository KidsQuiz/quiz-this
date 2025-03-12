
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const uploadAvatar = async (
  avatarFile: File | null, 
  avatarUrl: string | null, 
  userId: string
): Promise<string | null> => {
  if (!avatarFile || !userId) return avatarUrl;
  
  const fileExt = avatarFile.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  try {
    const { error: uploadError } = await supabase.storage
      .from('kid-avatars')
      .upload(filePath, avatarFile);
      
    if (uploadError) throw uploadError;
    
    const { data } = supabase.storage
      .from('kid-avatars')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error: any) {
    console.error('Error uploading avatar:', error.message);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: "Avatar upload failed. Kid will be saved without an image."
    });
    return null;
  }
};

export const getMaxPosition = async (userId: string): Promise<number> => {
  if (!userId) return 0;
  
  try {
    const { data, error } = await supabase
      .from('kids')
      .select('position')
      .eq('parent_id', userId)
      .order('position', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    return data && data.length > 0 ? data[0].position + 1 : 0;
  } catch (error) {
    console.error('Error getting max position:', error);
    return 0;
  }
};

export const fetchKidData = async (kidId: string) => {
  try {
    const { data, error } = await supabase
      .from('kids')
      .select('*')
      .eq('id', kidId)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    console.error('Error fetching kid:', error.message);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to load kid information"
    });
    return null;
  }
};
