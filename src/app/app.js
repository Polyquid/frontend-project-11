import onChange from 'on-change';
import { object, string } from 'yup';

const urlSchema = object({
  urlInput: string().url().required(),
});

export default () => {
  const state = {
    urlInput: null,
    isValid: null,
  };
  const watchedState = onChange(state, () => {
    console.log(watchedState);
  });
  const inputForm = document.querySelector('form .form-control');
  const rssForm = document.querySelector('.rss-form');
  inputForm.addEventListener('input', (e) => {
    watchedState.urlInput = e.target.value.trim();
  });
  rssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    urlSchema.validate(watchedState)
      .then(() => {
        watchedState.isValid = true;
      })
      .catch(() => {
        watchedState.isValid = false;
      });
  });
};
