const input = document.getElementById("pokemon-input");
const searchBtn = document.getElementById("search-btn");
const randomBtn = document.getElementById("random-btn");
const result = document.getElementById("result-container");

searchBtn.addEventListener("click", () => {
    searchPokemon(input.value.toLowerCase());
});

input.addEventListener("keypress", (e)=>{
    if(e.key==="Enter"){
        searchPokemon(input.value.toLowerCase());
    }
});

randomBtn.addEventListener("click", ()=>{

    const randomID = Math.floor(Math.random()*1025)+1;

    searchPokemon(randomID);

});

async function searchPokemon(name){

    result.innerHTML="<p class='loading'>Loading...</p>";

    try{

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if(!response.ok){

            throw new Error("Not Found");

        }

        const pokemon = await response.json();

        displayPokemon(pokemon);

    }

    catch(error){

        result.innerHTML="<p class='error'>Pokémon not found.</p>";

    }

}

function displayPokemon(pokemon){

    const types = pokemon.types.map(type=>`
        <span class="type">${type.type.name}</span>
    `).join("");

    const abilities = pokemon.abilities.map(ability=>ability.ability.name).join(", ");

    const stats = pokemon.stats.map(stat=>`

        <div class="stat">

            <strong>${stat.stat.name}</strong>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${Math.min(stat.base_stat,100)}%;"
                ></div>

            </div>

            ${stat.base_stat}

        </div>

    `).join("");

    result.innerHTML=`

        <div class="card">

            <img src="${pokemon.sprites.other["official-artwork"].front_default}">

            <h2>${pokemon.name.toUpperCase()}</h2>

            <h3>#${pokemon.id}</h3>

            <div class="types">

                ${types}

            </div>

            <div class="info">

                <p><strong>Height:</strong> ${pokemon.height/10} m</p>

                <p><strong>Weight:</strong> ${pokemon.weight/10} kg</p>

                <p><strong>Base Experience:</strong> ${pokemon.base_experience}</p>

                <p><strong>Abilities:</strong> ${abilities}</p>

            </div>

            <button id="play-cry-btn">

                🔊 Play Pokémon Cry

            </button>

            <div class="stats">

                <h3>Base Stats</h3>

                ${stats}

            </div>

        </div>

    `;

    const playCryBtn = document.getElementById("play-cry-btn");

    if (pokemon.cries && pokemon.cries.latest) {

        playCryBtn.addEventListener("click", ()=>{

            const audio = new Audio(pokemon.cries.latest);

            audio.play();

        });

    } else {

        playCryBtn.disabled = true;

        playCryBtn.textContent = "Cry Not Available";

    }

}
