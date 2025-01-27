import axios from 'axios';
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from './types';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const fetchUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: res.data });
  } catch (error) {
    dispatch({ type: FETCH_USER, payload: false });
  }
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, navigate) => async dispatch => {
  try {
    console.log('Submitting blog to server:', values);
    const res = await axios.post('/api/blogs', values);
    
    dispatch({ type: FETCH_BLOG, payload: res.data });
    navigate('/blogs'); // Navigate after successful submission
    
    return res.data; // Return the response data
  } catch (error) {
    console.error('Error submitting blog:', error);
    throw error; // Re-throw the error to be handled by the component
  }
};

export const fetchBlogs = () => async dispatch => {
  try {
    const res = await axios.get('/api/blogs');  // Changed to relative path
    console.log('Blogs fetched:', res.data);
    dispatch({ type: FETCH_BLOGS, payload: res.data });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    dispatch({ type: FETCH_BLOGS, payload: [] });
  }
};

export const fetchBlog = id => async dispatch => {
  try {
    const res = await axios.get(`/api/blogs/${id}`);
    dispatch({ type: FETCH_BLOG, payload: res.data });
  } catch (error) {
    console.error('Error fetching blog:', error);
    dispatch({ type: FETCH_BLOG, payload: null });
  }
};
