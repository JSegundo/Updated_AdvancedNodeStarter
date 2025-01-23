// BlogNew shows BlogForm and BlogFormReview
import React, { useState } from 'react';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

function BlogNew() {
  const [showFormReview, setShowFormReview] = useState(false);
  const [formData, setFormData] = useState(null);

  const renderContent = () => {
    if (showFormReview) {
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
          setFormData(data);
          setShowFormReview(true);
        }}
      />
    );
  };

  return <div>{renderContent()}</div>;
}

export default BlogNew;
