const temaDark = () =>{
    document.querySelector("body").setAttribute("data-bs-theme","dark");
    document.querySelector("#dl-icon").setAttribute("class","bi bi-sun-fill");
}
const temaLight = () =>{
    document.querySelector("body").setAttribute("data-bs-theme","light");
    document.querySelector("#dl-icon").setAttribute("class","bi bi-moon-fill");
}
const changeTema = () => {
    document.querySelector("body").getAttribute("data-bs-theme") === "light" ?
    temaDark() : temaLight();
}

const pokemonContainer = document.querySelector(".pokemon-container");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search");

let offset = 0;
let limit = 9;

previous.style.display = "none";

previous.addEventListener("click", () => {
  if (offset >= limit) {
    offset -= limit;
    fetchPokemon(limit, offset);
    next.style.display = "block";
  }
  if (offset === 0) {
    previous.style.display = "none";
  }
});

next.addEventListener("click", () => {
  offset += limit;
  fetchPokemon(limit, offset);
  previous.style.display = "block";
});

function loadPokemons(pokemons) {
  pokemonContainer.innerHTML = "";
  pokemons.forEach((pokemon) => createPokemon(pokemon));
}

searchBtn.addEventListener("click", () => {
  const searchValue = searchInput.value.toLowerCase();
  if (!searchValue) return;

  fetch("https://pokeapi.co/api/v2/pokemon")
    .then((res) => res.json())
    .then((data) => {
      const filteredPokemons = data.results.filter((p) =>
        p.name.toLowerCase().startsWith(searchValue)
      );
      if (!filteredPokemons.length) return alert("Pokémon no encontrado");
      const pokemonUrls = filteredPokemons.map((pokemon) => pokemon.url);
      Promise.all(
        pokemonUrls.map((url) => fetch(url).then((res) => res.json()))
      ).then((pokemons) => {
        localStorage.setItem("pokemons", JSON.stringify(pokemons));
        loadPokemons(pokemons);
      });
    });
});

window.addEventListener("load", () => {
  const pokemons = JSON.parse(localStorage.getItem("pokemons"));
  if (pokemons) {
    loadPokemons(pokemons);
  }
});

function fetchPokemon(limit, offset) {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then((res) => res.json())
    .then((data) => {
      pokemonContainer.innerHTML = "";
      data.results.forEach((pokemon) => {
        fetch(pokemon.url)
          .then((res) => res.json())
          .then((data) => {
            createPokemon(data);
          });
      });
    });
}

const ContFavorite = document.querySelector("#favorite-cont");
const favorites = [];

function createPokemon(Pokemon) {
  const card = document.createElement("div");
  card.classList.add("pokemon-block");

  const spriteContainer = document.createElement("div");
  spriteContainer.classList.add("img-container");

  const sprite = document.createElement("img");
  sprite.src = Pokemon.sprites.front_default;

  spriteContainer.appendChild(sprite);

  const numero = document.createElement("p");
  numero.textContent = `#${Pokemon.id.toString().padStart(3, 0)}`;

  const name = document.createElement("p");
  name.classList.add("name");
  name.textContent = Pokemon.name;

  const favoriteButton = document.createElement("button");
  favoriteButton.textContent = "Favorito";
  favoriteButton.classList.add("favorite-button");
  favoriteButton.addEventListener("click", () => {
    favorites.push(Pokemon);
    ContFavorite.textContent = favorites.length;
    removeButton.style.display = "block";
    favoriteButton.style.display = "none"; 
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Quitar";
  removeButton.classList.add("remove-button");

  if (favorites.findIndex((p) => p.id === Pokemon.id) !== -1) {
    removeButton.style.display = "block";
  } else {
    removeButton.style.display = "none";
  }

  removeButton.addEventListener("click", () => {
    const index = favorites.findIndex((p) => p.id === Pokemon.id);
    if (index > -1) {
      favorites.splice(index, 1);
      ContFavorite.textContent = favorites.length;
    }
    if (favorites.length === 0) {
      removeButton.style.display = "none";
    }
    favoriteButton.style.display = "block"; 
  });

  card.appendChild(spriteContainer);
  card.appendChild(numero);
  card.appendChild(name);
  card.appendChild(favoriteButton);
  card.appendChild(removeButton);

  pokemonContainer.appendChild(card);
}

function showFavorites() {
  pokemonContainer.querySelectorAll(".pokemon-block").forEach((card) => {
    const pokemonName = card.querySelector(".name").textContent;
    const isFavorite = favorites.some((pokemon) => pokemon.name === pokemonName);
    if (isFavorite) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

document.querySelector("#favorite-cont").addEventListener("click", () => {
  showFavorites();
});

fetchPokemon(limit, offset);