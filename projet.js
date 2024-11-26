
async function afficherProjets(filter) {
    document.querySelector(".gallery").innerHTML = ""
    const url = "http://localhost:5678/api/works"
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json()
        
        if (filter) {
            const filtered = json.filter((data) => data.categoryId === filter);
            for (let i = 0; i < filtered.length; i++) {
                setFigure(filtered[i]);
                setModalFigure(filtered[i])
            }
        } else {
            for (let i = 0; i < json.length; i++) {
                setFigure(json[i]);
                setModalFigure(json[i])
            }
        }

        //supprimer élément 

        const trashCans = document.querySelectorAll(".fa-trash-can")       
        console.log(trashCans)

        trashCans.forEach(e => e.addEventListener("click", (event) => deleteWork(event)))

        ajouterEcouteursSuppression();


    } catch (error) {
        console.error(error.message) 
    }
}

afficherProjets()

function setFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<div class="image-container">
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
    </div>`
    document.querySelector(".gallery").append(figure)
}

function setFigureModal(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<div class="image-container">
    <img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>
    <i id = ${data.id} class = "fa-solid fa-trash-can overlay-icon"></i>
    </div>`
    document.querySelector(".modal-gallery").append(figure)
}


document.addEventListener("DOMContentLoaded", () => {           //être sûr que toutes les images s'affichent au début
    afficherProjets();  


    const tousButton = document.querySelector(".tous");
        tousButton.addEventListener("click", () => afficherProjets());
});


afficherProjets();



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
    console.log(data)
    const div = document.createElement("div")
    div.className = data.id
    div.addEventListener("click", () => afficherProjets(data.id))
    div.innerHTML = `${data.name}`
    document.querySelector(".div-container").append(div)

}


function displayAdminMode() {
    if (sessionStorage.token){ 
        const editBanner = document.createElement('div')
        editBanner.className = "edit"
        editBanner.innerHTML = '<p><a href="#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>'
        document.body.prepend(editBanner)

    }
}

displayAdminMode()


// Modale

 let modal = null
const focusableSelector = "button, a, input, textarea"
let focusables = []

const openModal = function(e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute("href"))
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus()
    modal.style.display = null 
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

}


const stopPropagation = function(e) {
    e.stopPropagation()
     
}

function setModalFigure(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `
        <div class="image-container">
            <img src="${data.imageUrl}" alt="${data.title}">
            <figcaption>${data.title}</figcaption>
            <i data-id="${data.id}" class="fa-solid fa-trash-can overlay-icon"></i>
        </div>`;
                       
    document.querySelector(".gallery-modal").append(figure);
}

const closeModal = function(e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", true)
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal 
    .querySelector("js-modal-close")
    .removeEventListener("click", closeModal)
    modal
    .querySelector("js-modal-stop")
    .removeEventListener("click", stopPropagation)
    modal = null
}


const focusInModal = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else 
    index++
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

window.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e) 
    }
})

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

// fonction pour supprimer les éléments 

async function deleteWork(event) {
    event.stopPropagation();
   // const id = event.srcElement.id;
    const id = event.target.dataset.id
    const deleteApi = "http://localhost:5678/api/works/";
    const token = sessionStorage.getItem("token"); 
    
    try {
        let response = await fetch(deleteApi + id, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token, 
            }
        });
  
        if (response.status === 401 || response.status === 500) {
            const errorBox = document.createElement("div");
            errorBox.className = "error-login";
            errorBox.innerHTML = "Il y a eu une erreur";
            const modalContainer = document.querySelector(".modal-button-container");
            if (modalContainer) {
                modalContainer.prepend(errorBox);
            }
        } else {
           // let result = await response.json();    car message d'erreur avec cette ligne affiché disant qu'elle ne sert à rien
           // console.log(result);   car ligne du haut a été supprimée
            afficherProjets(); 
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
}


// Fonction pour ajouter les écouteurs aux icônes poubelle dans la modale
function ajouterEcouteursSuppression() {
    const trashIcons = document.querySelectorAll(".gallery-modal .fa-trash-can");
    trashIcons.forEach(icon => icon.addEventListener("click", deleteWork));
}

//écouteur du bouton ajouter photo 

document.addEventListener("DOMContentLoaded", () => {
    const addPhotoButton = document.querySelector(".add-photo-button");
    if (addPhotoButton) {
      addPhotoButton.addEventListener("click", switchModal);
    } else {
      console.error("Le bouton d'ajout de photo n'a pas été trouvé");
    }
});


//Ajouter une photo 


  const switchModal = function() {
    document.querySelector(".modal-wrapper").innerHTML = `
     <div class="modal-buttons-container">
      <button class="back-button">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
        <button class="js-modal-close">
          <i class="fa-solid fa-xmark"></i>
        </button>  
      </div>
     <h3>Ajout photo</h3>
            <div class="form add-photo-form">
            <form id="picture-form" action="#" method="post"> 
                <div class="blue-box">
                    <div class="image-placeholder">
                    <i class="fa-regular fa-image"></i>
                    <div>
                    <div class="file-section">
                        <div id="photo-container"></div>
                        <input type="file" id="file" style="display: none;" />
                        <button class="picture-add" for="file" id="triggerFileUpload">+ Ajouter photo</button>

                        <p class="picture-loaded">jpg, png : 4mo max</p>
                        </div> 
                    </div>  
                    
                        <label for="title">Titre</label>
                        <input type="text" name="title" id="title" />
                        <label for="category">Catégorie</label>
                        <select id="category" name="category" size="1">
                        <option value="1">Objets</option>
                        <option value="2">Appartements</option>
                        <option value="3">Hotels & restaurants</option>
                        </select>
                        <hr />
                        <input type="submit" value="Valider" />
                </form>
                </div> 
            </div>
            `

            document.getElementById("triggerFileUpload").addEventListener("click", function(event) {
                event.preventDefault(); // --> Empêche le rechargement de la page
                document.getElementById("file").click(); // Déclenche le clic sur l'input caché pour mettre photo
            });
            
      document.querySelector(".back-button").addEventListener("click", openModal);
      document.getElementById("picture-form").addEventListener("submit", handlePictureSubmit);
  };

 const addPhotoButton = document.querySelector(".add-photo-button")
 console.log(addPhotoButton);
 addPhotoButton.addEventListener("click", switchModal)  
 



 document.addEventListener("DOMContentLoaded", () => {
    const addPhotoButton = document.querySelector(".add-photo-button");
    if (addPhotoButton) {
      addPhotoButton.addEventListener("click", switchModal);
    } else {
      console.error("Le bouton d'ajout de photo n'a pas été trouvé");
    }
  });       


  //modal.querySelector(".back-button").addEventListener("click", openModal) 
  //modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
 





 

 const backButton = document.querySelector(".back-button");
 backButton.addEventListener("click", toggleModal);
 



 function toggleModal() {
    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");
  
    if (
      galleryModal.style.display === "block" ||
      galleryModal.style.display === ""
    ) {
      galleryModal.style.display = "none";
      addModal.style.display = "block";
    } else {
      galleryModal.style.display = "block";
      addModal.style.display = "none";
    }
  }  

 





// Gestion de l'ajout d'une nouvelle photo
function handlePictureSubmit() {
  const img = document.createElement("img");
  const fileInput = document.getElementById("file");
  let file; // On ajoutera dans cette variable la photo qui a été uploadée.
  fileInput.style.display = "none";
  fileInput.addEventListener("change", function (event) {
    file = event.target.files[0];
    const maxFileSize = 4 * 1024 * 1024;

    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size > maxFileSize) {
        alert("La taille de l'image ne doit pas dépasser 4 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
        img.alt = "Uploaded Photo";
        document.getElementById("photo-container").appendChild(img);
      };
      // Je converti l'image en une URL de donnees
      reader.readAsDataURL(file);
      document
        .querySelectorAll(".picture-loaded") // Pour enlever ce qui se trouvait avant d'upload l'image
        .forEach((e) => (e.style.display = "none"));
    } else {
      alert("Veuillez sélectionner une image au format JPG ou PNG.");
    }
  });

  const titleInput = document.getElementById("title");
  let titleValue = "";
  let selectedValue = "1";

  document.getElementById("category").addEventListener("change", function () {
    selectedValue = this.value;
  });

  titleInput.addEventListener("input", function () {
    titleValue = titleInput.value;
  });

  const addPictureForm = document.getElementById("picture-form");

  addPictureForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const hasImage = document.querySelector("#photo-container").firstChild;
    if (hasImage && titleValue) {
      const formData = new FormData();

      formData.append("image", file);
      formData.append("title", titleValue);
      formData.append("category", selectedValue);

      const token = sessionStorage.authToken;

      if (!token) {
        console.error("Token d'authentification manquant.");
        return;
      }

      let response = await fetch(`${url}/works`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      if (response.status !== 201) {
        const errorText = await response.text();
        console.error("Erreur : ", errorText);
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = `Il y a eu une erreur : ${errorText}`;
        document.querySelector("form").prepend(errorBox);
      }
    } else {
      alert("Veuillez remplir tous les champs");
    }
  });
}                  
