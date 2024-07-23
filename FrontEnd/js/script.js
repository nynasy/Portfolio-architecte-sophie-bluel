//class Work pour créer des objets de type travaux
class Work {
    constructor(jsonWork){
        jsonWork && Object.assign(this, jsonWork)
    }
}

//class Category pour créer des objets de type catégorie
class Category {
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
}


let token = localStorage.getItem("token");
let loginMenu =  document.getElementById("login");
let logoutMenu =  document.getElementById("logout");

loginMenu.onclick=function(){
    window.location.href = "login.html";
}

logoutMenu.onclick=function(){
    localStorage.clear();
    location.reload();
}

if(token){
    loginMenu.style.display= "none";
    logoutMenu.style.display= "block";
}
else{
    loginMenu.style.display= "block";
    logoutMenu.style.display= "none";
}

let currentCategoryId = 0;
    

//Catégorie 'Tous' pour afficher tous les travaux
const categoryAll = new Category(0, "Tous");

//on affiche les filtres de catégorie
displayCategoryFilters();

//au chargement de la page on affiche tous les travaux avec Catégorie 'Tous'
displayWorks(categoryAll);

//Fonction de chargement des catégories
function loadCategories(){
    //on recupere les categories (string)
    let listCategory = fetch("http://localhost:5678/api/categories")
    //on transforme les categories (string) en json 
    .then(data => data.json())
    //on transforme les categories json en objets de type Category
    .then(listJsonCategory => {	     
        let listCategory = [];
        for(let jsonCategory of listJsonCategory){
            let category = new Category(jsonCategory.id, jsonCategory.name);
            listCategory.push(category);      
        }
        return listCategory;
    }) ;
    return listCategory;
}

//Fonction de chargement des works
function loadWorks(){
    console.log("loadWorks");

    //on recupere les travaux (string)
    let listWorks = fetch("http://localhost:5678/api/works")
    //on transforme les travaux (string) en json 
    .then(data => data.json())
    //on transforme les travaux json en objets de type Work
    .then(listJsonWork => {
        let listWorks = [];       
        for(let jsonWork of listJsonWork){
            let work = new Work(jsonWork);   
            listWorks.push(work);       
        }
        console.log("listWorks : " + listWorks);
        return listWorks;
    });

    return listWorks;
}

//fonction d'affichage des filtres de catégorie
function displayCategoryFilters(){
    //on recupere les categories (string)
    loadCategories()
    //on crée les filtres de catégorie
    .then(listCategory => {	
        let listCategoryWithAll = [new Category(0, "Tous")];
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
    .then (listWorks => { 
        for(let work of listWorks){
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
        let listCategoryWithAll = [new Category(0, "Tous")];
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


function selectCategory(category){
  let filterSpans = document.querySelector(".filters").children;
    for(let span of filterSpans){
        span.classList.remove("filter-selected");
        if(span.innerText === category.name){
            span.classList.add("filter-selected");
        }
    }    
}

const modal = document.querySelector(".modal");
const editButton = document.querySelector("#editProject span");
const deleteWorks = document.querySelector(".deleteWorks");
const addWorks = document.querySelector(".addWorks");
const addButton = document.querySelector(".deleteWorks input");

editButton.addEventListener("click", (event) => { 
    event.preventDefault();
    modal.style.display = "block"; 
    deleteWorks.style.display = "block"; 
    addWorks.style.display = "none"; 
    displayWorksModal();   

})

addButton.onclick=function(){
    deleteWorks.style.display = "none"; 
    addWorks.style.display = "block"; 

}

const closeButton = document.querySelector(".modal .fa-close");
closeButton.addEventListener("click", (event) => { 
    event.preventDefault();
    modal.style.display = "none"; 
});   


document.addEventListener("click", function(event) {   
    event.preventDefault();      
    if (!event.target.closest("#modal,#editProject span")) {
        modal.style.display = "none";   
    }
});
  

 
    




 

