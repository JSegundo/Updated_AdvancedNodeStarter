// BlogNew shows BlogForm and BlogFormReview
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

function BlogNew() {
  const [showFormReview, setShowFormReview] = useState(false);
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  const renderContent = () => {
    console.log('showFormReview:', showFormReview);
    console.log('formData:', formData);

    if (showFormReview && formData) {
      return (
        <BlogFormReview
          onCancel={() => setShowFormReview(false)}
          formData={formData}
        />
      );
    }

    return (
      <BlogForm
        onBlogSubmit={(data) => {
          console.log('Form data received:', data);
          setFormData(data);
          setShowFormReview(true);
        }}
      />
    );
  };

  return (
    <div className="container">
      <h3>Create New Blog</h3>
      {renderContent()}
    </div>
  );
}

export default BlogNew;
