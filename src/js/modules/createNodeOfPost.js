const handleClick = (node, title, description, link, watchedState) => () => {
  watchedState.modal = {
    ...watchedState.modal,
    title,
    description,
    link,
  };
  watchedState.modal.isShown = true;
  watchedState.checkedPosts = node;
};

export default (data, i18n, watchedState) => {
  const li = document.createElement('li');
  li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.setAttribute('href', `${data.link}`);
  link.setAttribute('data-id', `${data.postId}`);
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
  link.textContent = data.title;
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.setAttribute('type', 'button');
  button.setAttribute('data-id', `${data.postId}`);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#modal');
  button.addEventListener('click', handleClick(link, data.title, data.description, data.link, watchedState));
  button.textContent = i18n.t('posts.watch');
  li.append(link);
  li.append(button);
  return li;
};
