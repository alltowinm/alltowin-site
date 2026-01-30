
document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postList = document.getElementById('postList');
    const resetBtn = document.getElementById('resetBtn');

    // Elements
    const inputTitle = document.getElementById('postTitle');
    const inputDate = document.getElementById('postDate');
    const inputPinned = document.getElementById('postPinned');
    const inputThumbnail = document.getElementById('postThumbnail');
    const thumbnailPreview = document.getElementById('thumbnailPreview');
    const hiddenId = document.getElementById('postId'); // For edits
    const hiddenThumb = document.getElementById('postThumbnailData'); // To store base64

    // Initial Load
    renderPostList();

    // Reset Form
    resetBtn?.addEventListener('click', clearForm);

    // Thumbnail Preview & Base64 Conversion
    inputThumbnail?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                thumbnailPreview.src = e.target.result;
                thumbnailPreview.style.display = 'block';
                hiddenThumb.value = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    // Form Submit
    postForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = hiddenId.value || Date.now().toString();
        const title = inputTitle.value;
        const date = inputDate.value;
        const pinned = inputPinned.checked;
        const thumbnail = hiddenThumb.value;

        if (!title || !date) {
            alert('제목과 날짜는 필수입니다.');
            return;
        }

        const newPost = {
            id,
            title,
            date,
            pinned,
            thumbnail
        };

        const posts = getPosts();

        if (hiddenId.value) {
            // Edit mode
            const index = posts.findIndex(p => p.id === hiddenId.value);
            if (index !== -1) {
                posts[index] = newPost;
            }
        } else {
            // New post
            posts.push(newPost);
        }

        savePosts(posts);
        clearForm();
        renderPostList();
        alert('저장되었습니다.');
    });

    // Helper: Get Posts
    function getPosts() {
        return JSON.parse(localStorage.getItem('insight_posts') || '[]');
    }

    // Helper: Save Posts
    function savePosts(posts) {
        localStorage.setItem('insight_posts', JSON.stringify(posts));
    }

    // Helper: Clear Form
    function clearForm() {
        hiddenId.value = '';
        inputTitle.value = '';
        inputDate.value = new Date().toISOString().split('T')[0];
        inputPinned.checked = false;
        inputThumbnail.value = ''; // Reset file input
        hiddenThumb.value = '';
        thumbnailPreview.src = '';
        thumbnailPreview.style.display = 'none';
        document.querySelector('button[type="submit"]').textContent = '글 작성 완료';
    }

    // Set default date
    if (inputDate && !inputDate.value) {
        inputDate.value = new Date().toISOString().split('T')[0];
    }

    // Render List
    function renderPostList() {
        if (!postList) return;

        const posts = getPosts();
        // Sort by date desc
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        postList.innerHTML = '';

        posts.forEach(post => {
            const tr = document.createElement('tr');

            // Format Pinned
            const pinnedBadge = post.pinned ? '<span class="badge-pinned">고정</span>' : '-';

            // Thumbnail
            const thumbDisplay = post.thumbnail
                ? `<img src="${post.thumbnail}" class="list-thumb" alt="thumb">`
                : '<div class="no-thumb">No Image</div>';

            tr.innerHTML = `
                <td>${pinnedBadge}</td>
                <td>${thumbDisplay}</td>
                <td class="text-left">${post.title}</td>
                <td>${post.date}</td>
                <td>
                    <button class="btn-edit" data-id="${post.id}">수정</button>
                    <button class="btn-delete" data-id="${post.id}">삭제</button>
                </td>
            `;
            postList.appendChild(tr);
        });

        // Attach events
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => loadPostForEdit(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => deletePost(e.target.dataset.id));
        });
    }

    // Delete Post
    function deletePost(id) {
        if (confirm('정말 삭제하시겠습니까?')) {
            const posts = getPosts().filter(p => p.id !== id);
            savePosts(posts);
            renderPostList();
        }
    }

    // Load for Edit
    function loadPostForEdit(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            hiddenId.value = post.id;
            inputTitle.value = post.title;
            inputDate.value = post.date;
            inputPinned.checked = post.pinned;
            hiddenThumb.value = post.thumbnail || '';

            if (post.thumbnail) {
                thumbnailPreview.src = post.thumbnail;
                thumbnailPreview.style.display = 'block';
            } else {
                thumbnailPreview.style.display = 'none';
            }

            document.querySelector('button[type="submit"]').textContent = '수정 완료';
            // Scroll to form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
});
