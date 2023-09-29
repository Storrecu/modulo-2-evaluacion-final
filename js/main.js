'use strict';

//Elementos de HTML que nos traemos a JS:
const input = document.querySelector('.js-input-search'); // casilla de búsqueda
const btnSearch = document.querySelector('.js-btn-search'); // botón para buscar
const listForm = document.querySelector('.js-form-list'); // lista que muestra la serie que has buscado
const listFav = document.querySelector('.js-fav-list'); // lista que almacenará los favoritos

//Otras variables:
const defaultImageHTML =
  '<img class="search_img" src="//via.placeholder.com/210x295/ffffff/666666/?text=TV'; // Imágen de respaldo
const URL = '//api.tvmaze.com/search/shows?q='; //URL de la API
let favList = [];
let showsList = [];

//Funciones:
function renderShow() {
  const inputValue = input.value;
  const URL = `//api.tvmaze.com/search/shows?q=${inputValue}`;

  if (inputValue !== '') {
    fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        showsList = data;
        //Compruebo que lo buscado coincide con los datos que contiene la respuesta
        listForm.innerHTML = '';
        if (data.length === 0) {
          listForm.innerHTML = 'No matches found.Try a diferent TV show';
        } else {
          //En caso que lo que busco, coincida con la info que tiene la respuesta lo pinto en el HTML
          listForm.innerHTML = '';
          for (const item of showsList) {
            let showElement = '';
            showElement += `
            <div id="${item.show.id}" class="js-card" >
            <img src="${
              item.show.image
                ? item.show.image.medium
                : '//via.placeholder.com/210x295/ffffff/666666/?text=TV'
            }"/> 
            <h2> ${item.show.name} </h2>`;
            showElement += '</div>';
            listForm.innerHTML += showElement; // a la sección le pongo como hijo la caja que acabo de crear
          }
          addToFavourites();
        }
      });
  } else {
    listForm.innerHTML = 'Write any TV show to start';
  }
}

function renderFavouriteShows(favoritesShows) {
  listFav.innerHTML = '';
  for (const item of favoritesShows) {
    listFav.innerHTML += renderShow(item);
  }
}

function handleClickShow(event) {
  const idShow = event.currentTarget.id;
  console.log(idShow);
  let foundShow = showsList.find((item) => item.show.id.toString() === idShow);
  console.log(foundShow);
  const indexFav = favList.findIndex(
    (item) => item.show.id === foundShow.show.id
  );
  console.log(indexFav);
  //Si no está (-1) lo añade
  if (indexFav === -1) {
    favList.push(foundShow);

    //Si está lo eliminará
  } else {
    favList.splice(indexFav, 1);
  }
  renderFavouriteShows(favList);
}

//llamamos a todos los div con clase js-card, se les añade evento listener click.
const addToFavourites = () => {
  const allShows = document.querySelectorAll('.js-card');
  for (const item of allShows) {
    item.addEventListener('click', handleClickShow);
  }
};

//Funciones manejadoras:
function handleSearchButton(event) {
  event.preventDefault();
  renderShow();
}

// así quitamos el mensaje de error, si se inicia búsqueda sin rellenar input
function handleInput() {
  listForm.innerHTML = '';
}

//Eventos:
btnSearch.addEventListener('click', handleSearchButton);
input.addEventListener('change', handleInput);
