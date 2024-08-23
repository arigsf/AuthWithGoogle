document.addEventListener("DOMContentLoaded", () => {
    const loginGoogle = document.getElementById("login-google");
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const contentDiv = document.getElementById("content");
    const messageDiv = document.getElementById("message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("http://localhost:3030/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    messageDiv.textContent = "Login successful!";
                    window.location.href = "/success.html";
                } else {
                    messageDiv.textContent = "Login failed!";
                }
            } catch (error) {
                console.error("Error:", error);
                messageDiv.textContent = "An error occurred.";
            }
        });
    }
	if (loginGoogle) {
        loginGoogle.addEventListener("click", () => {
            window.location.href = "http://localhost:3030/api/users/login/google";
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                const response = await fetch("http://localhost:3030/api/users/logout", {
                    method: "GET"
                });

                if (response.ok) {
                    messageDiv.textContent = "Logout successful!";
                    window.location.href = "/login.html";
                } else {
                    messageDiv.textContent = "Logout failed!";
                }
            } catch (error) {
                console.error("Error:", error);
                messageDiv.textContent = "An error occurred.";
            }
        });
    }

    if (contentDiv) {
        (async () => {
            try {
                const response = await fetch("http://localhost:3030/api/users/protected", {
                    method: "GET"
                });

                if (response.ok) {
                    const data = await response.json();
                    contentDiv.textContent = data;
                } else {
                    contentDiv.textContent = "Access denied!";
                    window.location.href = "/login.html";
                }
            } catch (error) {
                console.error("Error:", error);
                contentDiv.textContent = "An error occurred.";
            }
        })();
    }
});
