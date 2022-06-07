// DOM Elements...
const loadCommentsBtn = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');
const addNewCommentFormElement = document.getElementById(
  'add-new-comment-form'
);
const newCommentTitleElement = document.getElementById('title');
const newCommentTextElement = document.getElementById('text');

// Functions...
const createCommentsList = (comments) => {
  const commentsOrderedList = document.createElement('ol');

  for (const comment of comments) {
    const commentListElement = document.createElement('li');
    commentListElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>`;

    commentsOrderedList.appendChild(commentListElement);
  }

  return commentsOrderedList;
};

const displayComments = (comments) => {
  if (comments && comments.length > 0) {
    const commentsOrderedList = createCommentsList(comments);
    commentsSectionElement.innerHTML = '';
    commentsSectionElement.appendChild(commentsOrderedList);

    newCommentTitleElement.value = '';
    newCommentTextElement.value = '';
  } else {
    commentsSectionElement.firstElementChild.textContent =
      'We could not find any comments! Maybe add one?';
  }
};

const getAllComments = async (postId) => {
  try {
    const response = await fetch(`/posts/${postId}/comments`);
    const fetchedComments = await response.json();

    displayComments(fetchedComments);
  } catch (err) {
    console.error(err);
  }
};

const saveNewComment = async (postId, newComment) => {
  try {
    await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(newComment),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    getAllComments(postId);
  } catch (err) {
    console.error(err);
  }
};

// Event Handlers...
const handleLoadCommentsBtnClick = (e) => {
  const postId = loadCommentsBtn.dataset.postid;
  getAllComments(postId);
};

const handleAddNewCommentSubmit = (e) => {
  e.preventDefault();

  const postId = addNewCommentFormElement.dataset.postid;
  const newComment = {
    title: newCommentTitleElement.value,
    text: newCommentTextElement.value,
  };

  saveNewComment(postId, newComment);
};

// Event Listeners...
loadCommentsBtn.addEventListener('click', handleLoadCommentsBtnClick);
addNewCommentFormElement.addEventListener('submit', handleAddNewCommentSubmit);
