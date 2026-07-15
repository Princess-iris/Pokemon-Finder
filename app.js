const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('result-container');

// Main Function to Fetch Pokémon Data
async function getPokemonData(targetQuery) {
    // If no targetQuery is provided, use the value from the input field.
    const query = targetQuery || pokemonInput.value.trim().toLowerCase();

    if (!query && !targetQuery) {
        renderError('Please enter a Pokémon name or ID first.');
        return;
    }

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${query}`;

    try {
        renderLoading();

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Pokémon "${query}" not found. Check your spelling!`);
        }

        const data = await response.json();

        // Display the Pokémon information
        displayPokemon(data);

        // Clear the input field after a successful search
        pokemonInput.value = '';

    } catch (error) {
        console.error('API Error:', error);
        renderError(error.message);
    }
}

// Display Loading Screen
function renderLoading() {
    resultContainer.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Scanning Pokédex database, please wait...</p>
        </div>
    `;
}

// Display Error Message
function renderError(message) {
    resultContainer.innerHTML = `
        <div class="error-card animate-fade">
            <span class="error-icon">❌</span>
            <h3>Data Fetch Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Display Pokémon Information
function displayPokemon(pokemon) {
    // Generate Type Badges
    const typesHTML = pokemon.types.map(t =>
        `<span class="type-badge ${t.type.name}">${t.type.name.toUpperCase()}</span>`
    ).join('');

    // Combine all abilities into one string
    const abilities = pokemon.abilities
        .map(a => a.ability.name.replace('-', ' '))
        .join(', ');

    // Base Stats Extraction
    const hp = pokemon.stats[0].base_stat;
    const attack = pokemon.stats[1].base_stat;
    const defense = pokemon.stats[2].base_stat;
    const speed = pokemon.stats[5].base_stat; // Idineklara para hindi mag-error ang template literal sa baba

    // Render the layout using main branch styling
    resultContainer.innerHTML = `
        <div class="pokemon-card animate-fade">
            <div class="card-header">
                <h2 class="pokemon-name">${pokemon.name.toUpperCase()}</h2>
                <span class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</span>
            </div>

            <div class="image-wrapper-bg">
                <img
                    id="pokemon-img"
                    class="pokemon-img"
                    src="${pokemon.sprites.front_default}"
                    alt="${pokemon.name}">
            </div>

            <div class="pokemon-info-grid">
                <div class="info-row">
                    <span class="info-label">Type</span>
                    <div class="type-container">
                        ${typesHTML}
                    </div>
                </div>

                <div class="info-row">
                    <span class="info-label">Abilities</span>
                    <span class="info-value text-capitalize">${abilities}</span>
                </div>

                <div class="info-row-split">
                    <div>
                        <span class="info-label">Height</span>
                        <span class="info-value">${pokemon.height / 10} m</span>
                    </div>
                    <div>
                        <span class="info-label">Weight</span>
                        <span class="info-value">${pokemon.weight / 10} kg</span>
                    </div>
                </div>
            </div>

            <button id="play-cry-btn">
                🔊 Play Pokémon Cry
            </button>

            <div class="stats-dashboard">
                <h3>Base Stats</h3>

                <div class="stat-bar-group">
                    <div class="stat-label-row">
                        <span>HP</span>
                        <strong>${hp}</strong>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill hp-bar" style="width:${Math.min((hp/255)*100, 100)}%"></div>
                    </div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row">
                        <span>Attack</span>
                        <strong>${attack}</strong>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill atk-bar" style="width:${Math.min((attack/190)*100, 100)}%"></div>
                    </div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row">
                        <span>Defense</span>
                        <strong>${defense}</strong>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill def-bar" style="width:${Math.min((defense/230)*100, 100)}%"></div>
                    </div>
                </div>

                <div class="stat-bar-group">
                    <div class="stat-label-row">
                        <span>Speed</span>
                        <strong>${speed}</strong>
                    </div>
                    <div class="bar-track">
                        <div class="bar-fill spd-bar" style="width:${Math.min((speed/180)*100, 100)}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Pokémon Cry Feature Logic (Dapat nakalagay PAGKATAPOS ma-render ang innerHTML)
    const playCryBtn = document.getElementById("play-cry-btn");

    if (pokemon.cries && pokemon.cries.latest) {
        playCryBtn.addEventListener("click", () => {
            const audio = new Audio(pokemon.cries.latest);
            audio.play();
        });
    } else {
        playCryBtn.disabled = true;
        playCryBtn.textContent = "Cry Not Available";
    }
}

// Generate a Random Pokémon
randomBtn.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    getPokemonData(randomId);
});

// Search Button Event
searchBtn.addEventListener('click', () => getPokemonData());

// Allow Search Using the Enter Key
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getPokemonData();
    }
});