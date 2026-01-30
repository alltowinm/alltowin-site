
document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const editor = document.getElementById('editor');
    const thumbInput = document.getElementById('thumbInput');
    const thumbPreviewBox = document.getElementById('thumbPreviewBox');
    const thumbImage = document.getElementById('thumbImage');
    const contentImgInput = document.getElementById('contentImgInput');

    let thumbnailData = '';

    // --- Toolbar Commands ---
    const toolBtns = document.querySelectorAll('.tool-btn[data-cmd]');
    toolBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cmd = btn.dataset.cmd;
            document.execCommand(cmd, false, null);
            updateToolbarStatus();
        });
    });

    const fontSelect = document.getElementById('fontFamily');
    const sizeSelect = document.getElementById('fontSize');

    fontSelect.addEventListener('change', () => {
        document.execCommand('fontName', false, fontSelect.value);
    });

    sizeSelect.addEventListener('change', () => {
        document.execCommand('fontSize', false, sizeSelect.value);
    });

    // Color Pickers
    const foreColor = document.getElementById('foreColor');
    const hiliteColor = document.getElementById('hiliteColor');

    foreColor.addEventListener('change', () => {
        document.execCommand('foreColor', false, foreColor.value);
        editor.focus();
    });

    hiliteColor.addEventListener('change', () => {
        document.execCommand('hiliteColor', false, hiliteColor.value);
        editor.focus();
    });

    // Update active status of toolbar buttons
    editor.addEventListener('keyup', updateToolbarStatus);
    editor.addEventListener('mouseup', updateToolbarStatus);

    function updateToolbarStatus() {
        toolBtns.forEach(btn => {
            const cmd = btn.dataset.cmd;
            if (document.queryCommandState(cmd)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Image Handling ---

    // Thumbnail Upload
    thumbInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbnailData = e.target.result;
                thumbImage.src = thumbnailData;
                thumbImage.style.display = 'block';
                thumbPreviewBox.querySelector('span').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Content Image Insert
    contentImgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Insert image at cursor
                document.execCommand('insertImage', false, e.target.result);
                // Optional: Resize inserted image if too large (CSS does max-width)
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Publish Logic ---
    const btnPublish = document.getElementById('btnPublish');
    const btnTempSave = document.getElementById('btnTempSave');
    const btnPreview = document.getElementById('btnPreview');

    btnPublish.addEventListener('click', () => {
        const title = document.getElementById('postTitle').value;
        const content = editor.innerHTML;
        const category = document.getElementById('postCategory').value;
        const isPinned = document.getElementById('isPinned').checked;
        const visibility = document.querySelector('input[name="visibility"]:checked').value;

        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }

        const newPost = {
            id: Date.now().toString(),
            title: title,
            date: new Date().toISOString().split('T')[0],
            pinned: isPinned,
            thumbnail: thumbnailData,
            content: content,
            category: category,
            visibility: visibility,
            status: 'published'
        };

        savePost(newPost);
        alert('발행되었습니다.');
        window.location.href = 'index.html#insights'; // Redirect to board
    });

    btnTempSave.addEventListener('click', () => {
        alert('임시저장 기능은 데모 버전에서 지원하지 않습니다. (로직은 준비됨)');
        // Logic would be similar to publish but status: 'draft'
    });

    btnPreview.addEventListener('click', () => {
        // Simple preview: open new window writing content
        const w = window.open('', '_blank');
        w.document.write(`
            <html>
            <head>
                <link rel="stylesheet" href="css/style.css">
                <style>body{padding:40px; background:#fff;} .container{max-width:800px; margin:0 auto;}</style>
            </head>
            <body>
                <div class="container">
                    <h1>${document.getElementById('postTitle').value || '제목 없음'}</h1>
                    <div style="color:#888; margin-bottom: 30px;">${new Date().toISOString().split('T')[0]}</div>
                    <hr>
                    <div style="margin-top:20px;">
                        ${editor.innerHTML}
                    </div>
                </div>
            </body>
            </html>
        `);
        w.document.close();
    });

    function getPosts() {
        return JSON.parse(localStorage.getItem('insight_posts') || '[]');
    }

    function savePost(post) {
        const posts = getPosts();
        posts.push(post);
        localStorage.setItem('insight_posts', JSON.stringify(posts));
    }

});
