const form = document.querySelector("#login form");

// Quand on submit
form.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    console.log("formulaire de login soumis");
    
    // On récupère les deux champs et on affiche leur valeur
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(email);
    console.log(password);

    //on appelle le service de login
    fetch("http://localhost:5678/api/users/login" , {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
            "email": email,
            "password": password
            }
        )
    })
    //on transforme la reponse en json 
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(responseJson => {
        console.log("Response Json : " + responseJson.body);
        console.log("Response status  : " + responseJson.status);
        //reponse OK
        if(responseJson.status === 200){
            console.log("Response token : " + responseJson.body.token);
            
            localStorage.setItem("token", responseJson.body.token);
            window.location.href = "index.html";
        } 

        else if(responseJson.status === 401){
            alert("Erreur dans l’identifiant");        
        } 
        
        else if(responseJson.status === 404){
            alert("Page non trouvé");
        }
    
    })

});
 


