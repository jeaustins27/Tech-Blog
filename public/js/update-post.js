const postId = document.querySelector('#update-post-form').getAttribute('post-id')
const updatePostFormHandler = async (event) => {
  event.preventDefault();
  const postTitle = document.querySelector('#post-title-input').value.trim();
  const postText = document.querySelector('#post-text-input').value.trim();
console.log(postTitle)
console.log(postText)
  if (postTitle && postText) {
    const response = await fetch(`/api/post/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({ postTitle, postText, postId}),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace(`/post/${postId}`);
    } else {
      alert('Failed to log in.');
    }
  }
};

const deletePost = async function () {
  await fetch(`/api/post/${postId}`, {
    method: "DELETE",
  })
    .then(async (response) => await response.json())
    .then(function async(data) {
      location.href = `/dashboard/`;
    });
};

document
  .querySelector('#update-post-form')
  .addEventListener('submit', updatePostFormHandler);

document
  .querySelector('#delete-post-btn')
  .addEventListener('click', deletePost);