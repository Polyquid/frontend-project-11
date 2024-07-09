const renderSuccessfulState = (elements, i18n) => {
  elements.submitButton.removeAttribute('disabled');
  elements.inputForm.classList.remove('is-invalid');
  elements.feedbackText.textContent = i18n.t('form.feedback.ok');
  elements.feedbackText.classList.add('text-success');
  elements.feedbackText.classList.remove('text-danger');
};

export default renderSuccessfulState;
