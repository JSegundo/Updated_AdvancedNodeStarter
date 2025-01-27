import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlog } from '../../actions';

const BlogShow = () => {
  const { _id } = useParams(); // Get id from URL
  console.log(_id);
  const dispatch = useDispatch();
  const blog = useSelector(state => state.blogs[_id]); // Get blog from Redux state
  console.log(blog);
  useEffect(() => {
    dispatch(fetchBlog(_id));
  }, [dispatch, _id]);

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h3>{blog.title}</h3>
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogShow;
