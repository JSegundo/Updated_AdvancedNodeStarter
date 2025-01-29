import React, { useEffect } from 'react';
import map from 'lodash/map';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from '../../actions';

function BlogList() {
  const dispatch = useDispatch();
  const blogs = useSelector(state => state.blogs);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const renderBlogs = () => {
    return map(blogs, blog => {
      return (
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden" key={blog._id}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{blog.title}</h2>
            <p className="text-gray-600 mb-4">{blog.content}</p>
            <Link 
              to={`/blogs/${blog._id}`}
              className="text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Read More →
            </Link>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-4">
      {renderBlogs()}
    </div>
  );
}

export default BlogList;
