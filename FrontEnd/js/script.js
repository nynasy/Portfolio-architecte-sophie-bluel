
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

let currentCategoryId = 0;
    

//Catégorie 'Tous' pour afficher tous les travaux
const categoryAll = new Category(0, "Tous");

//au chargement de la page on affiche tous les travaux avec Catégorie 'Tous'
loadWorks(categoryAll);

//Fonction de chargement et d'affichage des travaux filtrés par la catégorie passée en paramétre
function loadWorks(category){
    console.log("loadWorks  + category : " + category.name);
    //on efface les travaux dans le html
    document.querySelector(".gallery").innerHTML = "";
    //on recupere les travaux (string)
    fetch("http://localhost:5678/api/works")
    //on transforme les travaux (string) en json 
    .then(data => data.json())
    //on transforme les travaux json en objets de type Work
    .then(listJsonWork => {
        for(let jsonWork of listJsonWork){
            let work = new Work(jsonWork);
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

//on recupere les categories (string)
fetch("http://localhost:5678/api/categories")
//on transforme les categories (string) en json 
.then(data => data.json())
//on transforme les categories json en objets de type Category
.then(listJsonCategory => {	
    let listCategory = [new Category(0, "Tous")];
    for(let jsonCategory of listJsonCategory){
        let category = new Category(jsonCategory.id, jsonCategory.name);
        listCategory.push(category);      
    }
    return listCategory;
})
//on crée les filtres de catégorie
.then(listCategory => {	
    console.log("listCategory : " + listCategory);         
    for(let category of listCategory){  
        // on crée une balise span
        let span = document.createElement("span");
        // on lui ajoute la class "filter-title"
        span.classList.add("filter-title");
        span.innerText = category.name;
        // on ajoute l'élément span à la div "filter-title"
        document.querySelector(".filters").appendChild(span);

        span.onclick = function () {
            console.log("clique sur la categorie " + category.name);
            loadWorks(category);
            selectCategory(category);
        } 
    }
    selectCategory(categoryAll);
});
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
editButton.addEventListener("click", (event) => { 
    event.preventDefault();
    modal.style.display = "block";    

});

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
  

 
    




 

