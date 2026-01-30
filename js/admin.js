document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMsg = document.getElementById('loginError');

    // Admin Credentials (Simulated as per prompt instructions)
    // ID: admin
    // PW: adm8764
    const ADMIN_ID = 'admin';
    const ADMIN_PW = 'adm8764';

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputId = document.getElementById('adminId').value;
            const inputPw = document.getElementById('adminPw').value;

            if (inputId === ADMIN_ID && inputPw === ADMIN_PW) {
                // Successful Login
                sessionStorage.setItem('adminAuth', 'true');
                sessionStorage.setItem('loginSuccess', 'true');
                window.location.href = 'index.html';
            } else {
                // Failed Login
                errorMsg.style.display = 'block';
                // Shake animation or focus reset could be added here
                document.getElementById('adminPw').value = '';
                document.getElementById('adminPw').focus();
            }
        });
    }
});
