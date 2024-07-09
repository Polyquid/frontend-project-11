const renderSendingState = (elements) => {
  elements.submitButton.setAttribute('disabled', '');
  elements.feedbackText.textContent = '';
  elements.inputForm.classList.remove('is-invalid');
};

export default renderSendingState;
