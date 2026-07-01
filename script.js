// ===== HÀM QUẢN LÝ TÀI KHOẢN =====
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('zaloUsers')) || {};
    } catch {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem('zaloUsers', JSON.stringify(users));
}

function getCurrentUser() {
    return localStorage.getItem('zaloCurrentUser');
}

function setCurrentUser(username) {
    localStorage.setItem('zaloCurrentUser', username);
}

// ===== HÀM XỬ LÝ LOGIN =====
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    const users = getUsers();
    if (!users[username]) {
        alert('Tên đăng nhập không tồn tại!');
        return;
    }

    if (users[username] !== password) {
        alert('Mật khẩu không đúng!');
        return;
    }

    setCurrentUser(username);
    window.location.href = 'dashboard.html';
}

// ===== HÀM XỬ LÝ REGISTER =====
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const confirmPassword = document.getElementById('regConfirmPassword').value.trim();

    if (!username || !password || !confirmPassword) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    if (username.length < 3) {
        alert('Tên đăng nhập phải có ít nhất 3 ký tự!');
        return;
    }

    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    const users = getUsers();
    if (users[username]) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }

    users[username] = password;
    saveUsers(users);
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    
    // Chuyển về form login
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('showRegister').style.display = 'inline';
}

// ===== HÀM CHUYỂN ĐỔI FORM =====
function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('showRegister').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('showRegister').style.display = 'inline';
}

// ===== HÀM KHỞI TẠO TRANG LOGIN =====
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    const showRegisterBtn = document.getElementById('showRegister');
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    const showLoginBtn = document.getElementById('showLogin');
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Kiểm tra đã đăng nhập chưa
    const currentUser = getCurrentUser();
    if (currentUser && window.location.pathname.includes('dashboard.html')) {
        // Đã đăng nhập
    } else if (currentUser && !window.location.pathname.includes('dashboard.html')) {
        // Chuyển đến dashboard
        window.location.href = 'dashboard.html';
    }
}

// ===== HÀM KHỞI TẠO DASHBOARD =====
function initDashboard() {
    // Kiểm tra đăng nhập
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // ===== HÀM HIỂN THỊ MENU =====
    function toggleMenu() {
        const menu = document.getElementById('dropdownMenu');
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }

    // ===== HÀM HIỂN THỊ ADMIN INFO =====
    function showAdminInfo() {
        const modal = document.getElementById('adminModal');
        modal.style.display = 'flex';
        document.getElementById('dropdownMenu').style.display = 'none';
    }

    // ===== HÀM ĐĂNG XUẤT =====
    function logout() {
        localStorage.removeItem('zaloCurrentUser');
        window.location.href = 'index.html';
    }

    // ===== HÀM MÔ PHỎNG QUÉT QR =====
    function simulateQRLogin() {
        return new Promise((resolve) => {
            const states = [
                { status: 'waiting', msg: 'Chờ quét QR...' },
                { status: 'scanned', msg: 'Đã quét QR, chờ xác nhận...' },
                { status: 'confirmed', msg: 'Đã xác nhận!' }
            ];

            let index = 0;
            const statusBtns = {
                waiting: document.getElementById('statusWaiting'),
                scanned: document.getElementById('statusScanned'),
                confirmed: document.getElementById('statusConfirmed')
            };

            // Reset trạng thái
            Object.values(statusBtns).forEach(btn => {
                btn.classList.remove('active', 'completed');
            });

            const interval = setInterval(() => {
                if (index > 0) {
                    const prevBtn = Object.values(statusBtns)[index - 1];
                    if (prevBtn) {
                        prevBtn.classList.remove('active');
                        prevBtn.classList.add('completed');
                    }
                }

                if (index < 3) {
                    const currentBtn = Object.values(statusBtns)[index];
                    if (currentBtn) {
                        currentBtn.classList.add('active');
                    }
                    index++;
                } else {
                    clearInterval(interval);
                    resolve({
                        imei: 'IMEI_' + Math.random().toString(36).substring(2, 15),
                        cookiePython: {
                            url: 'https://chat.zalo.me',
                            cookies: [
                                { name: 'zpw_sek', value: 'sek_' + Math.random().toString(36).substring(2, 20) },
                                { name: 'session_id', value: 'sid_' + Math.random().toString(36).substring(2, 15) },
                                { name: 'user_id', value: 'uid_' + Math.random().toString(36).substring(2, 10) }
                            ]
                        },
                        cookieJs: {
                            url: 'https://chat.zalo.me',
                            cookies: [
                                { name: 'zpw_sek', value: 'sek_' + Math.random().toString(36).substring(2, 20) },
                                { name: 'session_id', value: 'sid_' + Math.random().toString(36).substring(2, 15) },
                                { name: 'user_id', value: 'uid_' + Math.random().toString(36).substring(2, 10) }
                            ]
                        }
                    });
                }
            }, 2000);
        });
    }

    // ===== HÀM HIỂN THỊ KẾT QUẢ =====
    function displayResult(data) {
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.style.display = 'block';

        document.getElementById('imeiResult').textContent = data.imei;

        // Cookie Python
        const pythonCookies = data.cookiePython.cookies.map(c => 
            `${c.name}=${c.value}`
        ).join('; ');
        document.getElementById('cookiePythonResult').value = pythonCookies;

        // Cookie JS (giữ nguyên cấu trúc)
        document.getElementById('cookieJsResult').value = JSON.stringify(data.cookieJs, null, 2);

        // Scroll đến kết quả
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // ===== HÀM DOWNLOAD TXT =====
    function downloadTxt() {
        const imei = document.getElementById('imeiResult').textContent;
        const pythonCookie = document.getElementById('cookiePythonResult').value;
        const jsCookie = document.getElementById('cookieJsResult').value;

        const content = `===== ZALO IMEI & COOKIE =====
Thời gian: ${new Date().toLocaleString()}

--- IMEI ---
${imei}

--- Cookie (Python) ---
${pythonCookie}

--- Cookie (JS) ---
${jsCookie}
`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zalo_imei_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // ===== HÀM COPY =====
    function setupCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.dataset.target;
                const element = document.getElementById(targetId);
                let text = '';

                if (element.tagName === 'TEXTAREA') {
                    text = element.value;
                } else {
                    text = element.textContent;
                }

                navigator.clipboard.writeText(text).then(() => {
                    const originalText = this.textContent;
                    this.textContent = '✅ Đã copy!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                }).catch(() => {
                    // Fallback
                    const range = document.createRange();
                    range.selectNode(element);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                    document.execCommand('copy');
                    const originalText = this.textContent;
                    this.textContent = '✅ Đã copy!';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 2000);
                });
            });
        });
    }

    // ===== HÀM XỬ LÝ START =====
    async function handleStart() {
        const startBtn = document.getElementById('startBtn');
        const qrContainer = document.getElementById('qrContainer');
        const resultContainer = document.getElementById('resultContainer');

        // Reset
        startBtn.disabled = true;
        startBtn.textContent = '⏳ Đang xử lý...';
        resultContainer.style.display = 'none';
        document.getElementById('dropdownMenu').style.display = 'none';

        // Hiển thị QR (mô phỏng)
        qrContainer.style.display = 'flex';
        
        // Tạo QR code giả (dùng API)
        const qrText = 'zalo_login_' + Math.random().toString(36).substring(2, 10);
        const qrImage = document.getElementById('qrImage');
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${qrText}`;
        qrImage.alt = 'QR Code Zalo';

        try {
            // Chạy mô phỏng QR login
            const result = await simulateQRLogin();
            
            // Ẩn QR
            qrContainer.style.display = 'none';
            
            // Hiển thị kết quả
            displayResult(result);
            
            startBtn.textContent = '✅ Hoàn thành!';
        } catch (error) {
            alert('Có lỗi xảy ra: ' + error.message);
            startBtn.textContent = '▶ Bắt đầu';
            startBtn.disabled = false;
            qrContainer.style.display = 'none';
        }
    }

    // ===== GÁN SỰ KIỆN =====
    // Menu
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);

    // Admin Info
    document.getElementById('viewAdminInfo').addEventListener('click', showAdminInfo);

    // Dashboard
    document.getElementById('viewDashboard').addEventListener('click', () => {
        document.getElementById('dropdownMenu').style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Start
    document.getElementById('startBtn').addEventListener('click', handleStart);

    // Download
    document.getElementById('downloadBtn').addEventListener('click', downloadTxt);

    // Modal close
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('adminModal').style.display = 'none';
    });

    // Click outside modal
    document.getElementById('adminModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('adminModal').style.display = 'none';
        }
    });

    // Copy buttons
    setupCopyButtons();

    // Click outside menu to close
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('dropdownMenu');
        const menuBtn = document.getElementById('menuToggle');
        if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
}

// ===== KHỞI TẠO TRANG =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    } else {
        initLoginPage();
    }
});
