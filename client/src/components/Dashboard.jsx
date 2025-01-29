import React from 'react';
import { Link } from 'react-router-dom';
import BlogList from './blogs/BlogList';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <BlogList />
      <div className="fixed bottom-8 right-8">
        <Link 
          to="/blogs/new" 
          className="bg-red-500 hover:bg-red-700 text-white rounded-full p-4 flex items-center justify-center shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
