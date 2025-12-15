document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("authModal");
    const closeBtn = document.getElementById("authClose");
    const errorBox = document.getElementById("authError");

    const tabs = document.querySelectorAll(".auth-tab");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    const regUsername = document.getElementById("regUsername");
    const regPassword = document.getElementById("regPassword");
    const regPassword2 = document.getElementById("regPassword2");

    const logUsername = document.getElementById("logUsername");
    const logPassword = document.getElementById("logPassword");

    const hintUsername = document.getElementById("hint-username");
    const hintPassword = document.getElementById("hint-password");
    const hintPassword2 = document.getElementById("hint-password2");

    /* открыть модалку по кнопке регистрации */
    document.querySelector(".register-btn").addEventListener("click", e => {
        e.preventDefault();
        modal.style.display = "flex";

        // сразу вкладка регистрации
        tabs.forEach(t => t.classList.remove("active"));
        document.querySelector('[data-tab="register"]').classList.add("active");
        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });

    /* открыть модалку по кнопке "Войти" в шапке */
    document.querySelector(".login-btn").addEventListener("click", e => {
        e.preventDefault();
        modal.style.display = "flex";

        // сразу вкладка входа
        tabs.forEach(t => t.classList.remove("active"));
        document.querySelector('[data-tab="login"]').classList.add("active");
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");
    });

    /* закрыть модалку */
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        errorBox.textContent = "";
    });

    /* переключение вкладок */
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            if (tab.dataset.tab === "register") {
                registerForm.classList.remove("hidden");
                loginForm.classList.add("hidden");
            } else {
                registerForm.classList.add("hidden");
                loginForm.classList.remove("hidden");
            }

            errorBox.textContent = "";
        });
    });

    /* ============================
       HELPERS
    ============================= */

    function showError(input, hint, message) {
        input.classList.add("input-error");
        hint.textContent = message;
        hint.classList.add("error");
        hint.classList.remove("success");
    }

    function showSuccess(input, hint, message = "") {
        input.classList.remove("input-error");
        hint.textContent = message;
        hint.classList.remove("error");
        hint.classList.add("success");
    }

    function validateUsernameValue(username) {
        const hasLetter = /[a-zA-Z]/.test(username);
        const allowed = /^[a-zA-Z0-9!@#$%^&*._-]+$/.test(username);
        return username.length >= 2 && hasLetter && allowed;
    }

    function validatePasswordValue(pass) {
        return /^[a-zA-Z0-9]{8,}$/.test(pass);
    }

    /* ============================
       LIVE ВАЛИДАЦИЯ ПОЛЕЙ
    ============================= */

    /* ---- username ---- */
    regUsername.addEventListener("input", e => {
        const v = e.target.value.trim();

        if (!v) {
            showError(regUsername, hintUsername, "Поле обязательно для заполнения.");
            return;
        }

        if (v.length < 2) {
            showError(regUsername, hintUsername, "Минимум 2 символа.");
            return;
        }

        if (!/[a-zA-Z]/.test(v)) {
            showError(regUsername, hintUsername, "Имя должно содержать хотя бы одну букву.");
            return;
        }

        if (!/^[a-zA-Z0-9!@#$%^&*._-]+$/.test(v)) {
            showError(regUsername, hintUsername, "Разрешены только латинские буквы, цифры и спецсимволы.");
            return;
        }

        showSuccess(regUsername, hintUsername, "Имя корректно ✔");
    });

    /* ---- password ---- */
    regPassword.addEventListener("input", e => {
        const v = e.target.value;

        if (!v) {
            showError(regPassword, hintPassword, "Поле обязательно для заполнения.");
            return;
        }

        if (!validatePasswordValue(v)) {
            showError(regPassword, hintPassword, "Минимум 8 символов, только латиница и цифры.");
            return;
        }

        showSuccess(regPassword, hintPassword, "Пароль подходит ✔");
    });

    /* ---- confirm password ---- */
    regPassword2.addEventListener("input", () => {
        const p1 = regPassword.value;
        const p2 = regPassword2.value;

        if (!p2) {
            showError(regPassword2, hintPassword2, "Поле обязательно для заполнения.");
            return;
        }

        if (p1 !== p2) {
            showError(regPassword2, hintPassword2, "Пароли должны совпадать.");
            return;
        }

        showSuccess(regPassword2, hintPassword2, "Пароли совпадают ✔");
    });

    /* ============================
       LocalStorage USERS
    ============================= */

    function loadUsers() {
        return JSON.parse(localStorage.getItem("users") || "{}");
    }

    function saveUsers(data) {
        localStorage.setItem("users", JSON.stringify(data));
    }

    /* ============================
       РЕГИСТРАЦИЯ
    ============================= */

    registerForm.addEventListener("submit", e => {
        e.preventDefault();

        const username = regUsername.value.trim();
        const pass = regPassword.value;
        const pass2 = regPassword2.value;

        if (!validateUsernameValue(username)) {
            return errorBox.textContent = "Имя пользователя введено некорректно.";
        }

        if (!validatePasswordValue(pass)) {
            return errorBox.textContent = "Пароль введён некорректно.";
        }

        if (pass !== pass2) {
            return errorBox.textContent = "Пароли не совпадают.";
        }

        const users = loadUsers();

        if (users[username]) {
            return errorBox.textContent = "Такой пользователь уже существует.";
        }

        users[username] = pass;
        saveUsers(users);

        /* === автологин === */
        localStorage.setItem("currentUser", username);

        modal.style.display = "none";
        console.log("Вход выполнен:", username);
    });

    /* ============================
       ВХОД
    ============================= */

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        const username = logUsername.value.trim();
        const pass = logPassword.value;

        const users = loadUsers();

        if (!users[username]) {
            return errorBox.textContent = "Пользователь не найден.";
        }

        if (users[username] !== pass) {
            return errorBox.textContent = "Неверный пароль.";
        }

        localStorage.setItem("currentUser", username);
        modal.style.display = "none";

        console.log("Вход выполнен:", username);
    });
});
