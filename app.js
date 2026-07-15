const searchBtn = document.getElementById('search-btn');
const randomBtn = document.getElementById('random-btn');
const pokemonInput = document.getElementById('pokemon-input');
const resultContainer = document.getElementById('result-container');


// Variable para hawakan ang kasalukuyang audio object upang hindi mag-overlap ang tunog
let currentCryAudio = null;

// Function para kumuha ng data mula sa PokeAPI
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

        // I-render ang data kasama ang sound player logic
        displayPokemon(data);

        // Linisin ang input field pagkatapos maghanap
        pokemonInput.value = '';

        // ─── AMBAG NG KA-GRUPO MO (BRANCH: feature-search-history) ───

    } catch (error) {
        console.error('API Error Exception:', error);
        renderError(error.message);
    }
}

// Function para sa Loading State
function renderLoading() {
    resultContainer.innerHTML = `<p class="loading">Finding Pokémon data...</p>`;
}

// Function para sa Error Handling
function renderError(message) {
    resultContainer.innerHTML = `<p class="error">⚠️ Error: ${message}</p>`;
}

// Function para i-render ang Card
function displayPokemon(pokemon) {
    const typesHTML = pokemon.types.map(t => 
        `<span class="type">${t.type.name.toUpperCase()}</span>`
    ).join('');

    const hp = pokemon.stats[0].base_stat;
    const attack = pokemon.stats[1].base_stat;
    const defense = pokemon.stats[2].base_stat;

    // Kunin ang audio URL mula sa PokeAPI responses (.cries.latest)
    const cryAudioUrl = pokemon.cries ? pokemon.cries.latest : null;

    resultContainer.innerHTML = `
        <div class="card">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <p style="color: #888; font-weight: bold; margin-top: 5px;">#${String(pokemon.id).padStart(3, '0')}</p>
            
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            
            <div class="cry-container" style="margin: 10px 0;">
                <button id="cry-btn" class="cry-button" ${!cryAudioUrl ? 'disabled' : ''}>
                    ${cryAudioUrl ? '🔊 Listen Cry' : '🔇 No Sound Available'}
                </button>
            </div>

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

    // Kung may sound na nakuha mula sa API, i-bind ang player action
    if (cryAudioUrl) {
        const cryBtn = document.getElementById('cry-btn');
        cryBtn.addEventListener('click', () => {
            // Patigilin muna ang kasalukuyang audio kung may tumutugtog pa
            if (currentCryAudio) {
                currentCryAudio.pause();
                currentCryAudio.currentTime = 0;
            }

            // Magpatugtog ng bagong audio file gamit ang HTML5 Audio constructor
            currentCryAudio = new Audio(cryAudioUrl);
            currentCryAudio.volume = 0.5; // Ayusin ang lakas ng tunog (0.0 to 1.0)
            
            // Visual indicators habang naglo-load/play ang sound
            cryBtn.innerText = '⚡ Playing...';
            cryBtn.style.background = '#ffd84a';
            cryBtn.style.color = '#1e293b';

            currentCryAudio.play()
                .catch(err => console.error("Audio playback interrupted/failed:", err));

            // Ibalik sa normal ang button kapag natapos na ang cry sound
            currentCryAudio.onended = () => {
                cryBtn.innerText = '🔊 Listen Cry';
                cryBtn.style.background = '#ef5350';
                cryBtn.style.color = 'white';
            };
        });
    }
}

// Random Button Logic Engine
randomBtn.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    getPokemonData(randomId);
});

// Primary Event Listeners
searchBtn.addEventListener('click', () => getPokemonData());
pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getPokemonData();
    }
});
