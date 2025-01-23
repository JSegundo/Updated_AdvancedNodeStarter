import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import BlogNew from './blogs/BlogNew';
import BlogShow from './blogs/BlogShow';
import BlogList from './blogs/BlogList';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blogs/new" element={<BlogNew />} />
          <Route path="/blogs/:_id" element={<BlogShow />} />
          <Route path="/blogs" element={<BlogList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default connect(null, actions)(App);
