// BlogForm shows a form for a user to add input
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import formFields from './formFields';

function BlogForm({ onBlogSubmit }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (formData) => {
    // Call the callback passed from BlogNew with the form data
    onBlogSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {_.map(formFields, ({ label, name }) => {
          return (
            <div key={name} className="input-field">
              <input
                {...register(name, { required: `${label} is required` })}
                placeholder={label}
                className={errors[name] ? 'invalid' : ''}
              />
              {errors[name] && (
                <span className="helper-text red-text">
                  {errors[name].message}
                </span>
              )}
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
