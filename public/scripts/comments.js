// DOM Elements...
const loadCommentsBtn = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');

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
  };

  return commentsOrderedList;
};

const displayComments = (comments) => {
  const commentsOrderedList = createCommentsList(comments);
  commentsSectionElement.innerHTML = '';
  commentsSectionElement.appendChild(commentsOrderedList);
};

// Event Handlers...
const handleLoadCommentsBtnClick = async (e) => {
  const postId = loadCommentsBtn.dataset.postid;

  try {
    const response = await fetch(`/posts/${postId}/comments`);
    const fetchedComments = await response.json();

    displayComments(fetchedComments);
  } catch (err) {
    console.error(err);
  }
};

// Event Listeners...
loadCommentsBtn.addEventListener('click', handleLoadCommentsBtnClick);
