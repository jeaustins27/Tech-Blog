const addCommentFormHandler = async (event) => {
    event.preventDefault();
    const commentTitle = document.querySelector('#comment-title-input').value.trim();
    const commentText = document.querySelector('#comment-text-input').value.trim();
    const postId = document.querySelector('#update-comment-form').getAttribute('post-id');

    if (commentTitle && commentText) {
        const response = await fetch(`/api/comment/`, {
            method: 'POST',
            body: JSON.stringify({ commentTitle, commentText, postId }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace(`/post/${postId}`);
        } else {
            alert('Failed to add comment.');
        }
    }
};

document
    .querySelector('#update-comment-form')
    .addEventListener('submit', addCommentFormHandler);