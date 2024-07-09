const renderErrorState = (elements, i18n, value) => {
  elements.submitButton.removeAttribute('disabled');
  elements.feedbackText.textContent = i18n.t(value.at(-1));
  elements.inputForm.classList.add('is-invalid');
  elements.feedbackText.classList.remove('text-success');
  elements.feedbackText.classList.add('text-danger');
};

export default renderErrorState;
