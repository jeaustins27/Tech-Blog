const writePostFormHandler = async (event) => {
    const postTitle = document.querySelector('#post-title-input').value.trim();
    const postText = document.querySelector('#post-text-input').value.trim();
    event.preventDefault();

    if (postTitle && postText) {
        const response = await fetch(`/api/post/`, {
            method: 'POST',
            body: JSON.stringify({ postTitle, postText }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to write post.');
        }
    }
};

document
    .querySelector('#write-post-form')
    .addEventListener('submit', writePostFormHandler);