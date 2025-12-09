
"use client";

import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

const DashboardUI = ({ children, activePage }) => {
  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      <DashboardHeader />
      <div className="flex items-start">
        <DashboardSidebar activePage={activePage} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
           <div className="mx-auto max-w-7xl">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardUI;
