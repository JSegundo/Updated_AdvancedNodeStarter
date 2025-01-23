// BlogFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import formFields from './formFields';
import * as actions from '../../actions';

function BlogFormReview({ onCancel, formData }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const renderFields = () => {
    return _.map(formFields, ({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formData[name]}</div>
        </div>
      );
    });
  };

  const renderButtons = () => {
    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text" onClick={handleSubmit}>
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(actions.submitBlog(formData, navigate));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>Please confirm your entries</h5>
      {renderFields()}
      {renderButtons()}
    </form>
  );
}

export default BlogFormReview;
