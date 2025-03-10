import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import BlogNew from './blogs/BlogNew';
import BlogShow from './blogs/BlogShow';
import BlogList from './blogs/BlogList';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchUser());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <div>
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blogs/new" element={<BlogNew />} />
              <Route path="/blogs/:_id" element={<BlogShow />} />
              <Route path="/blogs" element={<BlogList />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
