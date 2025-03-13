
import React from 'react';
import KidsManager from './KidsManager';
import PackagesManager from './packages/PackagesManager';

const Dashboard = ({ activeTab }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {activeTab === 'kids' && <KidsManager />}
      {activeTab === 'packages' && <PackagesManager />}
    </div>
  );
};

export default Dashboard;
