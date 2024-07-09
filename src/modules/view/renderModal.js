const renderModal = (watchedState, elements, value) => {
  const { _element: modalNode } = elements.modal;
  const readAllButton = modalNode.querySelector('.modal-footer>a');
  const titleNode = modalNode.querySelector('.modal-title');
  const descriptionNode = modalNode.querySelector('.modal-body');
  const modalData = watchedState.posts.find((post) => post.id === value);
  titleNode.textContent = modalData.title;
  descriptionNode.textContent = modalData.description;
  readAllButton.setAttribute('href', `${modalData.link}`);
};

export default renderModal;
