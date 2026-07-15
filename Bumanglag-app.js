// app.js

const input = document.getElementById("pokemon-input");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const historyToggleBtn = document.getElementById("history-toggle-btn");
const result = document.getElementById("result-container");

// Search History DOM Elements
const historyContainer = document.querySelector(".history-container");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

// Array para sa storage ng history (kumukuha sa localStorage kung may nakasave na)
let searchHistory = JSON.parse(localStorage.getItem('pokemonHistory')) || [];

// Pag-load pa lang ng page, i-render na ang dating history kung mayroon
renderHistory();

// ==========================================
// API REQUEST & DISPLAY LOGIC
// ==========================================

async function searchPokemon(name) {
    if (!name) {
        result.innerHTML = "<p class='error'>⚠️ Paki-type muna ang pangalan ng Pokémon.</p>";
        return;
    }

    result.innerHTML = "<p class='loading'>Loading...</p>";

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            throw new Error("Not Found");
        }

        const pokemon = await response.json();
        
        // Ipakita ang card ng Pokémon
        displayPokemon(pokemon);
        
        // I-save sa search history ang totoong pangalan ng Pokémon
        addToHistory(pokemon.name);

    } catch (error) {
        result.innerHTML = "<p class='error'>Pokémon not found.</p>";
    }
}

function displayPokemon(pokemon) {
    const types = pokemon.types.map(type => `
        <span class="type">${type.type.name}</span>
    `).join("");

    const abilities = pokemon.abilities.map(ability => ability.ability.name).join(", ");

    const stats = pokemon.stats.map(stat => `
        <div class="stat">
            <strong>${stat.stat.name}</strong>
            <div class="bar">
                <div class="fill" style="width:${Math.min(stat.base_stat, 100)}%;"></div>
            </div>
            ${stat.base_stat}
        </div>
    `).join("");

    result.innerHTML = `
        <div class="card">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <h3>#${pokemon.id}</h3>
            <div class="types">
                ${types}
            </div>
            <div class="info">
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>
                <p><strong>Abilities:</strong> ${abilities}</p>
            </div>
            <div class="stats">
                <h3>Base Stats</h3>
                ${stats}
            </div>
        </div>
    `;

    // Linisin ang input box pagkatapos mag-search
    input.value = "";
    // Kusa ring itago ang history window kapag nakahanap na ng bagong Pokémon
    historyContainer.classList.remove("active");
}

// ==========================================
// SEARCH HISTORY MANAGEMENT
// ==========================================

function addToHistory(name) {
    // Siguraduhing hindi mauulit ang parehong Pokémon sa listahan
    if (!searchHistory.includes(name)) {
        // Ilagay sa pinakaunahan ng listahan
        searchHistory.unshift(name);
        
        // Limitahan hanggang 5 items lang para malinis tingnan
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }

        // I-save sa browser memory at i-update ang UI
        localStorage.setItem('pokemonHistory', JSON.stringify(searchHistory));
        renderHistory();
    }
}

function renderHistory() {
    // Linisin muna ang listahan bago mag-update para walang duplikasyon sa screen
    historyList.innerHTML = '';

    searchHistory.forEach((pokemon, index) => {
        const li = document.createElement('li');
        
        // 1. Gumawa ng click-target para sa pangalan ng Pokémon
        const nameSpan = document.createElement('span');
        nameSpan.textContent = pokemon.charAt(0).toUpperCase() + pokemon.slice(1);
        nameSpan.style.flex = "1"; // Para makuha ang buong space maliban sa delete button
        nameSpan.addEventListener('click', () => {
            searchPokemon(pokemon);
        });

        // 2. Gumawa ng "×" button para sa pagbura ng partikular na item
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.classList.add('delete-item-btn');
        deleteBtn.title = 'Delete this search';
        
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Pigilan ang click na mag-trigger sa list item
            deleteHistoryItem(index);
        });

        // Pagsamahin sa loob ng <li>
        li.appendChild(nameSpan);
        li.appendChild(deleteBtn);
        historyList.appendChild(li);
    });
}

// Bagong function para burahin ang isang partikular na Pokémon sa listahan
function deleteHistoryItem(index) {
    searchHistory.splice(index, 1); // Tanggalin sa array gamit ang index nito
    localStorage.setItem('pokemonHistory', JSON.stringify(searchHistory)); // I-save ang bago
    renderHistory(); // I-render ulit ang natirang history
}

// Pagbura ng buong Search History
clearHistoryBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Pigilan ang event para hindi biglang magsara ang list box
    searchHistory = [];
    localStorage.removeItem('pokemonHistory');
    renderHistory();
});

// ==========================================
// SHOW / HIDE SEARCH HISTORY & EVENT LISTENERS
// ==========================================

// Bubukas o masasarado ang history box depende sa pag-click ng "🕒 button"
historyToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    historyContainer.classList.toggle("active");
});

// Kusa ring itatago ang history kapag nag-click ang user sa labas ng application box
document.addEventListener("click", (e) => {
    if (
        !historyContainer.contains(e.target) &&
        e.target !== input &&
        e.target !== historyToggleBtn
    ) {
        historyContainer.classList.remove("active");
    }
});

// Standard button and key listeners
searchBtn.addEventListener("click", () => {
    searchPokemon(input.value.trim().toLowerCase());
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchPokemon(input.value.trim().toLowerCase());
    }
});

randomBtn.addEventListener("click", () => {
    const randomID = Math.floor(Math.random() * 1025) + 1;
    searchPokemon(randomID);
});
