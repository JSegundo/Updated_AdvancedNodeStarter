// BlogForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BlogField from './BlogField';
import formFields from './formFields';
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'

function BlogForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    // Your submit logic here
    // dispatch(createBlog(data))
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {_.map(formFields, ({ label, name }) => {
          return (
            <div key={name}>
              <input
                {...register(name, { required: `${label} is required` })}
                placeholder={label}
              />
              {errors[name] && <span>{errors[name].message}</span>}
            </div>
          );
        })}
        <Link to="/blogs" className="red btn-flat white-text">
          Cancel
        </Link>
        <button type="submit" className="teal btn-flat right white-text">
          Next
          <i className="material-icons right">done</i>
        </button>
      </form>
    </div>
  );
}

export default BlogForm;
