document.addEventListener("DOMContentLoaded", () => {

    const submit = document.querySelector(".initiatesession");

    submit.addEventListener("click", async () => {
        const username = document.querySelector(".user_name").value;
        const password = document.querySelector(".pass_word").value;
        const response = await fetch("http://localhost:8000/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token",data.token);
            alert(data.message);
            window.location.href = "dashboard.html";
        }
        else {
            alert(data.error);
        }
    })
});