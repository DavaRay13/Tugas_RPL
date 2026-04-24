// Simulasi Database pakai localStorage (inget ya bro, ini cuma buat latihan!)
const USERS_DB_KEY = 'app_users_demo';

// Mengambil data user dari localStorage
function getUsers() {
    const users = localStorage.getItem(USERS_DB_KEY);
    return users ? JSON.parse(users) : [];
}

// Menyimpan data user ke localStorage
function saveUser(username, password) {
    const users = getUsers();
    // Cek apakah username sudah ada
    if (users.find(u => u.username === username)) {
        return false; // Gagal, username terpakai
    }
    users.push({ username, password });
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    return true; // Berhasil daftar
}

// Cek kecocokan login
function checkLogin(username, password) {
    const users = getUsers();
    return users.find(u => u.username === username && u.password === password);
}

// Fungsi Custom Alert / Toast (Pengganti alert() bawaan)
function showAlert(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Tentukan warna berdasarkan tipe
    const bgColor = type === 'success' ? 'bg-green-500' : (type === 'error' ? 'bg-red-500' : 'bg-blue-500');
    
    toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg font-semibold flex items-center toast-enter`;
    
    // Tambah ikon
    const icon = type === 'success' ? '✓ ' : '✕ ';
    toast.innerText = icon + message;

    toastContainer.appendChild(toast);

    // Hilangkan toast setelah 3 detik
    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300); // Tunggu animasi exit selesai
    }, 3000);
}

// Fungsi Toggle antara Login dan Register view
function toggleView(view) {
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    if (view === 'register') {
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
    } else {
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
    }
}

// Handle Form Pendaftaran
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('reg-username').value.trim();
    const passwordInput = document.getElementById('reg-password').value;

    if (usernameInput === '' || passwordInput === '') {
        showAlert('Isi data yang bener dong bro!', 'error');
        return;
    }

    const success = saveUser(usernameInput, passwordInput);
    if (success) {
        showAlert('Mantap! Akun berhasil dibikin. Silakan login.', 'success');
        this.reset();
        toggleView('login');
    } else {
        showAlert('Waduh, username itu udah dipakai. Cari yang lain!', 'error');
    }
});

// Handle Form Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('login-username').value.trim();
    const passwordInput = document.getElementById('login-password').value;

    const user = checkLogin(usernameInput, passwordInput);

    if (user) {
        // LOGIC KETIKA LOGIN BERHASIL
        showAlert('Asik, berhasil masuk!', 'success');
        showDashboard(user.username);
    } else {
        // LOGIC KETIKA LOGIN GAGAL
        showAlert('Gagal login nih. Username atau password salah!', 'error');
        
        // Kasih efek getar dikit di form
        const authContainer = document.getElementById('auth-container');
        authContainer.classList.add('animate-pulse');
        setTimeout(() => authContainer.classList.remove('animate-pulse'), 500);
    }
});

// Fungsi nampilin halaman selamat & confetti
function showDashboard(username) {
    // Sembunyiin form
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('login-form').reset();
    
    // Tunjukin dashboard
    const dashboard = document.getElementById('dashboard-container');
    dashboard.classList.remove('hidden');
    document.getElementById('welcome-message').innerText = `Halo, ${username}! Selamat datang.`;

    // Tembak Confetti
    fireConfetti();
}

// Fungsi Logout
function logout() {
    document.getElementById('dashboard-container').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    
    // Bersihin sisa confetti
    document.getElementById('confetti-container').innerHTML = '';
    showAlert('Udah keluar. Sampai jumpa lagi bro!', 'info');
}

// Efek Confetti Custom (Bikin partikel pakai JS murni)
function fireConfetti() {
    const container = document.getElementById('confetti-container');
    container.innerHTML = ''; // Reset
    
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const amount = 100; // Jumlah kertas confetti

    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize properti
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animationDuration = Math.random() * 3 + 2 + 's';
        const animationDelay = Math.random() * 2 + 's';
        
        confetti.style.backgroundColor = color;
        confetti.style.left = left;
        confetti.style.animation = `fall ${animationDuration} ${animationDelay} linear infinite`;
        
        // Variasi bentuk (lingkaran atau kotak)
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }

        container.appendChild(confetti);
    }

    // Hentikan confetti setelah 6 detik biar browser gak berat
    setTimeout(() => {
        container.innerHTML = '';
    }, 6000);
}
