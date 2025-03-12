
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface KidFormFieldsProps {
  name: string;
  age: string;
  points: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onPointsChange: (value: string) => void;
}

const KidFormFields = ({ 
  name, 
  age, 
  points, 
  isLoading, 
  onNameChange, 
  onAgeChange, 
  onPointsChange 
}: KidFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Child's name"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          placeholder="Child's age"
          min="0"
          max="18"
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="points">Points</Label>
        <Input
          id="points"
          type="number"
          value={points}
          onChange={(e) => onPointsChange(e.target.value)}
          placeholder="Points"
          min="0"
          disabled={isLoading}
          required
        />
      </div>
    </>
  );
};

export default KidFormFields;
