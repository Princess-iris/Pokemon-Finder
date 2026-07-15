const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('result-container');


async function getPokemonData(targetQuery) {
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

        displayPokemon(data);

        // Clean input field
        pokemonInput.value = '';


    } catch (error) {
        console.error('API Error Exception:', error);
        renderError(error.message);
    }
}

// Function for the Loading State (Follows your CSS .loading class)
function renderLoading() {
    resultContainer.innerHTML = `<p class="loading">Finding Pokémon data...</p>`;
}

// Function para sa Error Handling (Sumusunod sa .error ng CSS mo)
function renderError(message) {
    resultContainer.innerHTML = `<p class="error">⚠️ Error: ${message}</p>`;
}

// Function to render the Card with the Box and Stats using your classes.
function displayPokemon(pokemon) {
    //Map the types using the `.type` class in your CSS.
    const typesHTML = pokemon.types.map(t => 
        `<span class="type">${t.type.name.toUpperCase()}</span>`
    ).join('');

    // Extract statistics configurations from the data object
    const hp = pokemon.stats[0].base_stat;
    const attack = pokemon.stats[1].base_stat;
    const defense = pokemon.stats[2].base_stat;

    // It uses .card, .types, .info, .stats, .bar, and .fill from your style.css!
    resultContainer.innerHTML = `
        <div class="card">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <p style="color: #888; font-weight: bold; margin-top: 5px;">#${String(pokemon.id).padStart(3, '0')}</p>
            
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            
            <div class="types">
                ${typesHTML}
            </div>

            <div class="info">
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
            </div>

            <div class="stats">
                <div class="stat">
                    <p><strong>HP:</strong> ${hp}</p>
                    <div class="bar">
                        <div class="fill" style="width: ${Math.min((hp/255)*100, 100)}%"></div>
                    </div>
                </div>

                <div class="stat">
                    <p><strong>Attack:</strong> ${attack}</p>
                    <div class="bar">
                        <div class="fill" style="width: ${Math.min((attack/190)*100, 100)}%; background: #f97316;"></div>
                    </div>
                </div>

                <div class="stat">
                    <p><strong>Defense:</strong> ${defense}</p>
                    <div class="bar">
                        <div class="fill" style="width: ${Math.min((defense/230)*100, 100)}%; background: #3b82f6;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

}

// Random Button Logic Engine
randomBtn.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    getPokemonData(randomId);
});

//Primary Event Listeners
searchBtn.addEventListener('click', () => getPokemonData());
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getPokemonData();
    }
});
