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



// Fonction pour récupérer et afficher la galerie
async function afficherGalerie(categoryId = null) {

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
        
}

async function filters (categoryId = null) {

    const response = await fetch ('http://localhost:5678/api/categories')
    let categories = await response.json()

}


async function afficherFiltres() {
    try {
        // On récupère les catégories depuis l'API
        const response = await fetch('http://localhost:5678/api/categories');
        const filters = await response.json();

        // conteneur pour les filtres
        filtersContainer.innerHTML = ""; // Vider le conteneur pour ajouter les nouveaux boutons

        // Ajouter un bouton pour afficher tous les éléments
        const allButton = document.createElement("button");
        allButton.classList.add("filter-button", "active");
        allButton.dataset.category = "all";
        allButton.innerText = "Tous";
        filtersContainer.appendChild(allButton);

        // Définir les filtres manuellement 
        const categories = [
            { id: 'all', name: 'Tous' },
            { id: 'objets', name: 'Objets' },
            { id: 'appartements', name: 'Appartements' },
            { id: 'hotels-restaurants', name: 'Hotels & restaurants' }
        ];

        // Créer bouton pour chaque catégorie
        categories.forEach(category => {
            const button = document.createElement("button");
            button.classList.add("filter-button");
            button.dataset.category = category.id;
            button.innerText = category.name;
            filtersContainer.appendChild(button);
        });

        // Ajouter un événement pour chaque bouton de filtre
        filtersContainer.addEventListener("click", (event) => {

            if (event.target.classList.contains("filter-button")) {
                
                // Rendre le bouton actif et désactiver les autres
                document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
                event.target.classList.add("active");

                // Afficher la galerie filtrée selon la catégorie sélectionnée
                const categoryId = event.target.dataset.category === "all" ? null : parseInt(event.target.dataset.category);
                afficherGalerie(categoryId);
            }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
}






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
  