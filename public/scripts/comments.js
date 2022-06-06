// DOM Elements...
const loadCommentsBtn = document.getElementById('load-comments-btn');

// Event Handlers...
const handleLoadCommentsBtnClick = async (e) => {
  const postId = loadCommentsBtn.dataset.postid;

  try {
    const response = await fetch(`/posts/${postId}/comments`);
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

// Event Listeners...
loadCommentsBtn.addEventListener('click', handleLoadCommentsBtnClick);
