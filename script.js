let offset = 0;
const limit = 30;
let allCards = "";
let currentOverlayIndex = 0;
let allPokemonData = [];
const loadedPokemon = [];

async function getPokemonList() {
    try {
        const pokemonArray = await fetchPokemonArray(limit, offset);
        await renderPokemonList(pokemonArray);
        offset += limit;
    } catch (error) {
        console.log("Fehler beim Laden der Liste:", error);
    }
}

async function fetchPokemonArray(limit, offset) {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();
    return data.results;
}

async function renderPokemonList(pokemonArray) {
    for (const pokemon of pokemonArray) {
        const details = await fetchPokemonDetails(pokemon.url);
        allPokemonData.push(details);
        allCards += generateCard(details);
    }
    document.getElementById("pokedex").innerHTML = allCards;
}

async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    const pokemon = await response.json();

    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();

    pokemon.color = speciesData.color.name;
    return pokemon;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function loadMore() {
    getPokemonList();
}

async function searchPokemon() {
    const input = getInputValue("search");
    if (!isValidInput(input)) {
        showSearchError("Bitte mindestens 3 Buchstaben eingeben.");
        return;
    }
    try {
        const filtered = await getFilteredPokemon(input);
        if (filtered.length === 0) {
            showNoResults();
            return;
        }
        await renderSearchResults(filtered);
    } catch (error) {
        showSearchError("Es wurden keine Pokémon gefunden.");
    }
}

function getInputValue(id) {
    return document.getElementById(id).value.trim().toLowerCase();
}

function isValidInput(input) {
    return input.length >= 3;
}

function showSearchError(message) {
    document.getElementById("pokedex").innerHTML = `<p>${message}</p>`;
}

async function getFilteredPokemon(input) {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1000"
    );
    const data = await response.json();
    return data.results.filter((p) => p.name.startsWith(input));
}

async function renderSearchResults(pokemonArray) {
    let resultCards = "";
    for (const poke of pokemonArray) {
        const details = await fetchPokemonDetails(poke.url);
        resultCards += generateCard(details);
    }
    document.getElementById("pokedex").innerHTML = resultCards;
}

function showOverlay(id) {
    const p = allPokemonData.find((pokemon) => pokemon.id === id);
    if (!p) return;
    currentOverlayIndex = allPokemonData.indexOf(p);
    showOverlayByIndex(currentOverlayIndex);
}

function showOverlayByIndex(index) {
    const p = allPokemonData[index];
    if (!p) return;

    currentOverlayIndex = index;
    const stats = getStats(p);
    const html = generateOverlayHTML(p, stats);
    document.getElementById("overlayDetails").innerHTML = html;
    document.getElementById("overlay").classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function getStats(pokemon) {
    const stats = {};
    for (const s of pokemon.stats) {
        stats[s.stat.name] = s.base_stat;
    }
    return stats;
}

function hideOverlay() {
    document.getElementById("overlay").classList.add("hidden");
    document.body.classList.remove("no-scroll");
}

function closeOverlay(event) {
    hideOverlay();
}

function nextPokemon() {
    let i = currentOverlayIndex + 1;
    if (i >= allPokemonData.length) i = 0;
    showOverlayByIndex(i);
}

function prevPokemon() {
    let i = currentOverlayIndex - 1;
    if (i < 0) i = allPokemonData.length - 1;
    showOverlayByIndex(i);
}
