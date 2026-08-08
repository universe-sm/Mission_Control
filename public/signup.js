document.addEventListener("DOMContentLoaded", () => {
    const submit = document.querySelector(".initiatesession");
    submit.addEventListener("click", async () => {
        const codesmatch = document.querySelector(".codesmatch");
        codesmatch.style.display = "none";
        const username = document.querySelector(".user_name").value;
        const email = document.querySelector(".e_mail").value;
        const password = document.querySelector(".pass_word").value;
        const confirmpassword = document.querySelector(".confirm_password").value;
        if (password != confirmpassword) {
            codesmatch.style.display = "block";
            return;
        }
        const response = await fetch("http://localhost:8000/users/signup",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            }
        )
        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            window.location.href = "login.html";
        }
        else {
            alert(data.error);
        }


    })
})