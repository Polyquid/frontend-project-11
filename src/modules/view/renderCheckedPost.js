const renderCheckedPost = (watchedState, elements, value) => {
  const checkedPost = document.querySelector(`a[data-id="${value.at(-1)}"]`);
  checkedPost.classList.remove('fw-bold');
  checkedPost.classList.add('fw-normal', 'link-secondary');
};

export default renderCheckedPost;
