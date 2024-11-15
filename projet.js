async function afficherGalerie(categoryId = null)
{
    /*
    fetch('http://localhost:5678/api/works')
      .then(response => response.json())
      .then(json => console.log(json))
    */
    //on récupère la liste des travaux depuis le backend 
    const response = await fetch('http://localhost:5678/api/works')
    let works = await response.json()

    //on filtre si nécessaire : que si on nous donne un category Id (clique sur un bouton de filtre)

    if (categoryId) {
        console.log('on filtre sur la catégorie n°:'+ categoryId) 
        works =  works.filter(work => work.categoryId == categoryId)
    }

    works.forEach(work => {
        console.log(`ID: ${work.id}, Catégorie: ${work.categoryId}, Titre: ${work.title}, Image URL: ${work.imageUrl}`);
    })



    //on récupère la galerie 
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""  //vider la galerie 

    //on insère les travaux dans la galerie 
    for (const work of works) {
       // console.log(work)
     /*   <figure>
				<img src="assets/images/appartement-paris-v.png" alt="Appartement Paris V">
				<figcaption>Appartement Paris V</figcaption>
			</figure> */

        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = work.imageUrl
        img.alt = work.title 
        figure.appendChild(img)
        const figcaption = document.createElement("figcaption")
        figcaption.innerText = work.title
        figure.appendChild(figcaption)
        //console.log(figure)
        gallery.appendChild(figure)
    }
}

afficherGalerie()

async function getCategories() {

    const url = "http://localhost:5678/api/categories"
    
    try {
        const response = await fetch (url) 
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        console.log(json)

        for (let i = 0; i < json.length ; i++) {
            setFilter(json[i])
        } 
    }
    catch (error){
        console.error(error.message)
    }

}

getCategories()



function setFilter(data) {

    const div = document.createElement("div")
    div.innerHTML = `${data.name}`

    
    document.querySelector(".div-container").append(div)

}


















// Fonction pour récupérer et afficher la galerie

/*
async function afficherGalerie(categoryId) {

        // Récupérer la liste des travaux depuis l'API
        const response = await fetch('http://localhost:5678/api/works');
        let works = await response.json();

        // Filtrer les travaux selon la catégorie si `categoryId` est spécifié
        if (categoryId) {
            works = works.filter(work => work.categoryId === categoryId);
        }

        // Sélectionner la galerie et la vider
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";

        // Ajouter chaque travail à la galerie
        works.forEach(work => {
            const figure = document.createElement("figure");
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        });

}  */



































/* 
async function recupererDonnees() {
    try { 
        const [travauxResponse, categoriesResponse] = await Promise.all ({fetch ("http://localhost/5678/api/works")
        fetch ("http://localhost5678/api/categories")}

        if (!travauxResponse.ok || !categoriesResponse.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        const travaux = await travauxResponse.json()
        const categories = await categoriesResponse.json() }
        afficherTravaux(travaux)
        afficherCategories(categories);

    catch (error) {
        console.error("Erreur :", error)}
        function afficherTravaux(travaux) {
            const conteneurTravaux = document.getElementById("conteneur-travaux")
            conteneurTravaux.innerHTML = ""
        
            travaux.forEach(travail => {
                const travailElement = document.createElement("div");
                travailElement.innerHTML = `<h3>${travail.title}</h3><p>${travail.description}</p>`;
                conteneurTravaux.appendChild(travailElement);
            })}

            function afficherCategories(categories) {
                const conteneurCategories = document.getElementById("conteneur-categories");
                conteneurCategories.innerHTML = ""
            
                categories.forEach(categorie => {
                    const categorieElement = document.createElement("div")
                    categorieElement.innerHTML = `<h4>${categorie.name}</h4>`
                    conteneurCategories.appendChild(categorieElement);
                })}

    }
    */
  