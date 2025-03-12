
import React from 'react';
import Card from './Card';
import Avatar from './Avatar';
import { Trophy } from 'lucide-react';

interface UserData {
  name: string;
  points: number;
  avatarUrl: string;
}

interface DashboardProps {
  userData: UserData;
}

const Dashboard = ({ userData }: DashboardProps) => {
  const { name, points, avatarUrl } = userData;
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-balance">
          Welcome to your Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          View and manage your profile information and activity stats.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Name Card */}
        <Card title="Name" delay={100}>
          <div className="mt-2 text-2xl font-semibold">{name}</div>
          <div className="text-sm text-muted-foreground mt-1">Your profile name</div>
        </Card>
        
        {/* Points Card */}
        <Card title="Points" className="relative overflow-visible" delay={200}>
          <div className="flex items-center mt-2">
            <div className="text-2xl font-semibold">{points.toLocaleString()}</div>
            <div className="ml-2 bg-primary/10 text-primary p-1 rounded-full">
              <Trophy size={16} className="animate-float" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground mt-1">Total earned points</div>
          
          {/* Decorative element */}
          <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-full bg-primary/5 blur-xl" />
        </Card>
        
        {/* Avatar Card */}
        <Card title="Avatar" delay={300}>
          <div className="flex justify-center items-center min-h-[100px] mt-2">
            <Avatar src={avatarUrl} alt={name} size="lg" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
