document.addEventListener("DOMContentLoaded", () => {      //car ne détecte pas le loginform du html

    const loginApi = "http://localhost:5678/api/users/login"


    document. getElementById("loginform").addEventListener ("submit", handleSubmit)

    async function handleSubmit(event) {

        event.preventDefault()

        let user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }

            
        let response = await fetch(loginApi, {
            method: "POST",
            headers: {
            "Content-Type" : "application/json"
            },
            body: JSON.stringify(user),
        }) 

        console.log(response)

        if (response.status != 200) {
            const errorBox = document.createElement("div")
            errorBox.className = "error-login"
            errorBox.innerHTML = "Erreur de mail ou de mot de passe"
            document.querySelector('form').prepend(errorBox)
        } else {
        
        let result = await response.json()
        console.log(result)
        console.log("E-mail:", email)
        console.log("Mot de passe:", password)

        sessionStorage.setItem("token", result.token)

        window.location.href = "index.html"
        }
    }
})