
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from '@/hooks/usePackagesData';
import { Edit, Trash2, Package as PackageIcon, Plus, MessageCircleQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PackagesListProps {
  packages: Package[];
  isLoading: boolean;
  onEditPackage: (id: string) => void;
  onDeletePackage: (id: string) => void;
  onAddPackage: () => void;
  alwaysShowAddCard?: boolean;
}

const PackagesList = ({ 
  packages, 
  isLoading, 
  onEditPackage, 
  onDeletePackage, 
  onAddPackage,
  alwaysShowAddCard = false
}: PackagesListProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-36 rounded-lg bg-muted animate-pulse"></div>
        ))}
      </div>
    );
  }
  
  if (packages.length === 0 && !alwaysShowAddCard) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No packages created yet.</p>
        <Button 
          variant="outline" 
          onClick={onAddPackage} 
          className="mt-4"
        >
          Create your first package
        </Button>
      </div>
    );
  }
  
  const AddNewPackageCard = () => (
    <Card 
      className="overflow-hidden transition-colors hover:shadow-md border-dashed flex items-center justify-center cursor-pointer hover:bg-accent/10"
      onClick={onAddPackage}
    >
      <div className="p-6 text-center">
        <div className="flex justify-center mb-2">
          <div className="bg-primary/10 p-3 rounded-full">
            <Plus className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h3 className="font-medium">Add New Package</h3>
        <p className="text-sm text-muted-foreground mt-1">Create a new collection of questions</p>
      </div>
    </Card>
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {packages.map((pkg) => (
        <Card key={pkg.id} className="overflow-hidden transition-colors hover:shadow-md">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-lg">{pkg.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEditPackage(pkg.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDeletePackage(pkg.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
            
            {pkg.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{pkg.description}</p>
            )}
            
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/questions/${pkg.id}`)}
                className="flex items-center gap-1"
              >
                <MessageCircleQuestion className="h-4 w-4" />
                <span>Manage Questions</span>
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      <AddNewPackageCard />
    </div>
  );
};

export default PackagesList;
