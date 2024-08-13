
const token = localStorage.getItem("token");

const loginMenu =  document.getElementById("login");
const logoutMenu =  document.getElementById("logout");
const filters = document.querySelector(".filters");
const modal = document.querySelector(".modal");
const editButton = document.querySelector("#editProject span");
const deleteWorks = document.querySelector(".deleteWorks");
const addWorks = document.querySelector(".addWorks");
const addButton = document.querySelector(".deleteWorks input");
const chooseFile = document.querySelector("#fileId");
const addImage = document.querySelector("#addImage");
const upload = document.querySelector("#upload");  
const imagePreview = document.querySelector("#imagePreview");    
const arrowLeft = document.querySelector("#icon-arrow-left");  
const formAddImage = document.querySelector(".addWorks form");
const editionMode = document.querySelector("#editionMode");

loginMenu.onclick=function(){
    window.location.href = "login.html";
}

logoutMenu.onclick=function(){
    localStorage.removeItem("token");
    location.reload();
}

if(token){
    loginMenu.style.display= "none";
    logoutMenu.style.display= "block";
    filters.style.display= "none";
    editButton.style.display= "block";
    editionMode.style.display= "flex";
} else {
    loginMenu.style.display= "block";
    logoutMenu.style.display= "none";
    editButton.style.display= "none";
    filters.style.display= "flex";
    editionMode.style.display= "none";
}

let currentCategoryId = 0;
    

//Catégorie 'Tous' pour afficher tous les travaux
const categoryAll = {"id": 0, "name": "Tous"}

//on affiche les filtres de catégorie
displayCategoryFilters();

//au chargement de la page on affiche tous les travaux avec Catégorie 'Tous'
displayWorks(categoryAll);

//Fonction de chargement des catégories
function loadCategories(){
    //on recupere les categories (string)
    let listCategory = fetch("http://localhost:5678/api/categories")
    //on transforme les categories (string) en json 
    .then(data => data.json());
  
    return listCategory;
}

//Fonction de chargement des works
function loadWorks(){
    console.log("loadWorks");

    //on recupere les travaux (string)
    let listWorks = fetch("http://localhost:5678/api/works")
    //on transforme les travaux (string) en json 
    .then(data => data.json());

    return listWorks;
}

//fonction d'affichage des filtres de catégorie
function displayCategoryFilters(){
    loadCategories()
    //on crée les filtres de catégorie
    .then(listCategory => {	
        let listCategoryWithAll = [categoryAll];
        listCategoryWithAll.push(...listCategory);
        console.log("listCategoryWithAll : " + listCategoryWithAll);         
        for(let category of listCategoryWithAll){  
            // on crée une balise span
            let span = document.createElement("span");
            // on lui ajoute la class "filter-title"
            span.classList.add("filter-title");
            span.innerText = category.name;
            // on ajoute l'élément span à la div "filter-title"
            document.querySelector(".filters").appendChild(span);

            span.onclick = function () {
                console.log("clique sur la categorie " + category.name);
                displayWorks(category);
                selectCategory(category);
            } 
        }
        selectCategory(categoryAll);
    });
}

// fonction d'affichage des travaux en fontion de la catégorie
function displayWorks(category){
    console.log("displayWorks  + category : " + category.name);

    //on efface les travaux dans le html
    document.querySelector(".gallery").innerHTML = "";

    //on appelle la fonction de chargement des works
    loadWorks()
    .then (listJsonWorks => { 
        for(let work of listJsonWorks){
            //console.log(work);  
            //on n'affiche le travail que si la catégorie sélectionnée est 'Tous' 
            //OU si la catégorie sélectionnée est égale à la catégorie du travail       
            if(category.id === 0 || category.id === work.category.id){                
                document.querySelector(".gallery").innerHTML +=
                    `<figure>
                        <img src=${work.imageUrl} alt=${work.title}>
                        <figcaption>${work.title}</figcaption>
                    </figure>`
            }
        }
    });
}

//fonction d'affichage des travaux à supprimer dans la modale
function displayWorksModal(){
    console.log("displayWorksModal...");

    //on efface les travaux dans le html
    document.querySelector(".images").innerHTML = "";

    //on appelle la fonction de chargement des works
    loadWorks()
    .then (listWorks => { 
        let divImages =  document.querySelector(".images");    
        for(let work of listWorks){ 
            let divImageItem = document.createElement("div");  
            divImageItem.classList.add("imageItem");

            let img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            img.id = work.id;

            let i = document.createElement("icon");
            i.classList.add("fa","fa-trash");

            divImageItem.appendChild(img);
            divImageItem.appendChild(i);

            divImages.appendChild(divImageItem);

            i.onclick = function () {
                console.log("clique sur icone supprimer de l'id : " + work.id);

                fetch("http://localhost:5678/api/works/" + work.id, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })               
                .then(response => {                    
                    if(response.ok){
                        alert("Suppression réussie !");  
                        displayWorksModal();
                        displayWorks(categoryAll);
                    }             
                    else {
                        alert("Erreur de suppression !");        
                    }              
         
                })
                .catch(error => {
                    console.log("Erreur de suppression : ", error);
                    alert("Erreur de suppression : " + error);
                });
               
            } 
                
        }
    });
}

//fonction d'affichage des catégories dans la modale
function displayCategoryModal(){
    //on recupere les categories (string)
    loadCategories()
    //on crée les filtres de catégorie
    .then(listCategory => {	      
        console.log("listCategory : " + listCategory);   
        let selectCategory = document.querySelector("#category");
        selectCategory.innerHTML = `<option value=""></option>`;     
        for(let category of listCategory){             
            selectCategory.innerHTML += `<option value=${category.id}>${category.name}</option>`;  
        }
        
    });
}


function selectCategory(category){
  let filterSpans = document.querySelector(".filters").children;
    for(let span of filterSpans){
        span.classList.remove("filter-selected");
        if(span.innerText === category.name){
            span.classList.add("filter-selected");
        }
    }    
}


formAddImage.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    console.log("formulaire d'ajout de photo soumis");
    
    // On récupère les deux champs et on affiche leur valeur
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const file = chooseFile.files[0];
    console.log(file);
    console.log(title);
    console.log(category);   
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.status);
        }
      })
      .then(data => {        
        console.log('Server response:', data);
        alert("Ajout d'image réussi");
        formAddImage.reset();
        imagePreview.style.display = "none"; 
        upload.style.display = "flex"; 
        displayWorksModal();
        displayWorks(categoryAll);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        alert("Erreur lors de l'ajout de l'image : " + error);
      });    

    });


editButton.addEventListener("click", (event) => { 
    event.preventDefault();
    modal.style.display = "flex"; 
    deleteWorks.style.display = "flex"; 
    addWorks.style.display = "none"; 
    arrowLeft.style.visibility = "hidden";    
    displayWorksModal();   

});

addButton.onclick=function(){
    deleteWorks.style.display = "none"; 
    addWorks.style.display = "block"; 
    arrowLeft.style.visibility = "visible";
    displayCategoryModal();
}

arrowLeft.onclick=function(){
    deleteWorks.style.display = "flex"; 
    addWorks.style.display = "none"; 
    arrowLeft.style.visibility = "hidden";
}

imagePreview.onclick=function(){
    chooseFile.click();
}


addImage.onclick=function(){
    chooseFile.click();
}

const previewImage = () => {
    const file = chooseFile.files;
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            imagePreview.setAttribute("src", event.target.result);
        }
        fileReader.readAsDataURL(file[0]);
        
        imagePreview.style.display = "block"; 
        upload.style.display = "none";  
    }
}
chooseFile.addEventListener("change", previewImage);

const closeButton = document.querySelector(".modal .fa-close");
closeButton.addEventListener("click", (event) => { 
    event.preventDefault();
    modal.style.display = "none"; 
});   


document.addEventListener("click", function(event) {   
    //event.preventDefault();      
    if (!event.target.closest("#modal,#editProject span")) {
        modal.style.display = "none";   
    }
});
  


 
    




 

