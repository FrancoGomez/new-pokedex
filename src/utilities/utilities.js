export const typePokemonColors = {
    bug: {
        backgroundColor: "rgb(114, 159, 63)",
        color: "white",
    },
    dragon: {
        backgroundColor: "rgb(241, 110, 87)",
        color: "white",
    },
    fairy: {
        backgroundColor: "rgb(253, 185, 233)",
        color: "black",
    },
    fire: {
        backgroundColor: "rgb(253, 125, 36)",
        color: "white",
    },
    ghost: {
        backgroundColor: "rgb(123, 98, 163)",
        color: "white",
    },
    ground: {
        backgroundColor: "rgb(171, 152, 66)",
        color: "black",
    },
    normal: {
        backgroundColor: "rgb(164, 172, 175)",
        color: "black",
    },
    psychic: {
        backgroundColor: "rgb(243, 102, 185)",
        color: "white",
    },
    steel: {
        backgroundColor: "rgb(158, 183, 184)",
        color: "black",
    },
    dark: {
        backgroundColor: "rgb(72, 87, 91)",
        color: "white",
    },
    electric: {
        backgroundColor: "rgb(248, 208, 48)",
        color: "black",
    },
    fighting: {
        backgroundColor: "rgb(213, 103, 35)",
        color: "white",
    },
    flying: {
        backgroundColor: "rgb(61, 199, 239)",
        color: "black",
    },
    grass: {
        backgroundColor: "rgb(155, 204, 80)",
        color: "black",
    },
    ice: {
        backgroundColor: "rgb(81, 196, 231)",
        color: "black",
    },
    poison: {
        backgroundColor: "rgb(185, 127, 201)",
        color: "white",
    },
    rock: {
        backgroundColor: "rgb(163, 140, 33)",
        color: "white",
    },
    water: {
        backgroundColor: "rgb(69, 146, 196)",
        color: "white",
    },
};

export const appendElement = ($father, arrayChilds) => {
    for (const $child of arrayChilds) {
        $father.appendChild($child);
    }
};

export const returnElement = (propiedades) => {
    const $element = document.createElement(propiedades.type);
    $element.className = propiedades.class;

    if (propiedades.id) {
        $element.setAttribute("id", propiedades.id);
    }

    if (propiedades.innerText) {
        $element.innerText = propiedades.innerText;
    }

    if (propiedades.backgroundColor) {
        $element.style.backgroundColor = propiedades.backgroundColor;
    }

    if (propiedades.color) {
        $element.style.color = propiedades.color;
    }

    if (propiedades.src) {
        $element.src = propiedades.src;
    }

    return $element;
};

export const getPokemonImage = (id) => {
    let pokemonId = id;

    if (/[/]/.test(id)) {
        const firstSlash = id.toString().indexOf("/");
        pokemonId = id.toString().slice(0, firstSlash);
    }

    const imageUrl = `${
        pokemonId === 718
            ? "https://projectpokemon.org/images/sprites-models/homeimg/poke_capture_0718_000_uk_n_00000000_f_n.png"
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`
    }`;

    return imageUrl;
};

export const getDisplayedId = (id) => {
    let pokemonId = id;

    if (/[/]/.test(id)) {
        const firstSlash = id.toString().indexOf("/");
        pokemonId = id.toString().slice(firstSlash + 1, id.length);
    }

    const displayedId = `#${pokemonId.toString().padStart(3, "0")}`;

    return displayedId;
};

export const getPokemon = async (id, url = false) => {
    const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let pokemonObject;
    if (url) {
        pokemonObject = await (await fetch(url)).json();
    } else {
        pokemonObject = await (await fetch(POKEMON_URL)).json();
    }
    const types = [];

    const pokemon = {
        "image url": getPokemonImage(pokemonObject.id),
        name: pokemonObject.name.replaceAll("-", " "),
        id: pokemonObject.id,
    };

    for (const slot of pokemonObject.types) {
        const typeName = slot.type.name;
        types.push(typeName);
    }

    pokemon.types = types;

    return pokemon;
};

export const getPokemonSpecies = async (id) => {
    const POKEMON_SPECIES_URL = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const pokemonSpeciesData = await (await fetch(POKEMON_SPECIES_URL)).json();

    const pokemonSpecies = {
        name: pokemonSpeciesData.name,
        id: pokemonSpeciesData.id,
        japaneseName: getJapaneseName(pokemonSpeciesData),
    };

    return pokemonSpecies;
};

export const getModalInfo = async (id) => {
    let pokemonId = id;
    let pokemonSpeciesId = id;

    if (/[/]/.test(id)) {
        const firstSlash = id.toString().indexOf("/");
        pokemonId = id.toString().slice(0, firstSlash);
        pokemonSpeciesId = id.toString().slice(firstSlash + 1, id.length);
    }

    const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const POKEMON_SPECIES_URL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonSpeciesId}`;

    const pokemon = await (await fetch(POKEMON_URL)).json();
    const pokemonSpecies = await (await fetch(POKEMON_SPECIES_URL)).json();

    const EVOLUTION_CHAIN_URL = pokemonSpecies.evolution_chain.url;

    const evolutionChain = await (await fetch(EVOLUTION_CHAIN_URL)).json();

    const pokemonInfo = returnPokemonInfo(pokemon, pokemonSpecies);
    const fightStats = returnFightStats(pokemon);
    const evolutionsInfo = await returnEvolutions(evolutionChain);

    return {
        about: pokemonInfo,
        stats: fightStats,
        evolutions: evolutionsInfo,
    };
};

const returnJSON = async (url) => {
    const pokemon = await (await fetch(url)).json();
    return pokemon;
};

const returnEvolutions = async (evolutionChain) => {
    const evolutions = {
        first: await getFirstEvolution(evolutionChain),
        second: await getSecondEvolution(evolutionChain.chain),
        third: await getThirdEvolution(evolutionChain.chain),
    };

    return evolutions;
};

const getFirstEvolution = async (evolutionChain) => {
    const POKEMON_SPECIES_URL = evolutionChain.chain.species.url;
    const pokemon = await returnJSON(
        POKEMON_SPECIES_URL.replace("-species", "")
    );
    const pokemonSpecies = await returnJSON(POKEMON_SPECIES_URL);

    const pokemonEvolution = [
        {
            "image url": getPokemonImage(pokemon.id),
            name: pokemon.name,
            id: pokemon.id,
            types: getTypes(pokemon),
        },
    ];

    for (const slot of pokemonSpecies.varieties) {
        if (slot.is_default) continue;

        if (!pokemonEvolution[0].varieties) {
            pokemonEvolution[0].varieties = [];
            pokemonEvolution[0].varieties.push(
                await getPokemon(false, slot.pokemon.url)
            );
        } else {
            pokemonEvolution[0].varieties.push(
                await getPokemon(false, slot.pokemon.url)
            );
        }
    }

    return pokemonEvolution;
};

const getSecondEvolution = async (evolutionChain) => {
    if (evolutionChain.evolves_to.length === 0) return;

    const pokemonEvolution = [];

    for (const slot of evolutionChain.evolves_to) {
        const POKEMON_SPECIES_URL = slot.species.url;
        const pokemon = await returnJSON(
            POKEMON_SPECIES_URL.replace("-species", "")
        );
        const pokemonSpecies = await returnJSON(POKEMON_SPECIES_URL);

        const evolution = {
            "image url": getPokemonImage(pokemon.id),
            name: pokemon.name,
            id: pokemon.id,
            types: getTypes(pokemon),
        };

        for (const slot of pokemonSpecies.varieties) {
            if (slot.is_default) continue;
            if (
                pokemonSpecies.name === "pikachu" &&
                !/gmax/.test(slot.pokemon.name)
            )
                continue;

            if (evolution.varieties) {
                evolution.varieties.push(
                    await getPokemon(false, slot.pokemon.url)
                );
            } else {
                evolution.varieties = [
                    await getPokemon(false, slot.pokemon.url),
                ];
            }
        }

        pokemonEvolution.push(evolution);
    }

    return pokemonEvolution;
};

const getThirdEvolution = async (evolutionChain) => {
    if (evolutionChain.evolves_to.length === 0) return;
    const pokemonEvolution = [];

    for (const slot of evolutionChain.evolves_to) {
        const evolutions = await getSecondEvolution(slot);
        if (evolutions === undefined) return;

        for (const evolution of evolutions) {
            pokemonEvolution.push(evolution);
        }
    }

    return pokemonEvolution;
};

const returnPokemonInfo = (pokemon, pokemonSpecie) => {
    const pokemonInfo = {
        about: {
            name: getName(pokemon),
            japaneseName: getJapaneseName(pokemonSpecie),
            types: getTypes(pokemon),
            description: getDescription(pokemonSpecie),
        },
        pokedex: {
            specie: getSpecie(pokemonSpecie),
            id: getId(pokemonSpecie),
            height: getHeight(pokemon),
            weight: getWeight(pokemon),
            types: getTypes(pokemon),
            abilities: getAbilities(pokemon),
            generation: getGeneration(pokemon, pokemonSpecie),
            habitat: getHabitat(pokemon, pokemonSpecie),
        },
        training: {
            "catch rate": getCatchRate(pokemonSpecie),
            "base friendship": getBaseFriendship(pokemonSpecie),
            "base exp": getBaseExp(pokemon),
            "growth rate": getGrowthRate(pokemonSpecie),
        },
        breeding: {
            gender: getGender(pokemonSpecie),
            "egg groups": getEggGroups(pokemonSpecie),
            "egg cycles": getEggCycles(pokemonSpecie),
        },
    };

    return pokemonInfo;
};

const getName = (pokemon) => {
    return pokemon.name.replaceAll("-", " ").replace("gmax", "gigantamax");
};

const getJapaneseName = (pokemonSpecie) => {
    for (const slot of pokemonSpecie.names) {
        const language = slot.language.name;
        const japanese = "ja";

        if (language === japanese) {
            return slot.name;
        }
    }
};

const getTypes = (pokemon) => {
    const types = [];

    for (const slot of pokemon.types) {
        types.push(slot.type.name);
    }

    return types;
};

const getDescription = (pokemonSpecie) => {
    const descriptions = pokemonSpecie.flavor_text_entries;

    for (const slot of descriptions) {
        const english = "en";
        const description = slot.flavor_text.replaceAll("\n", " ");

        if (slot.language.name === english) {
            return description;
        }
    }
};

const getSpecie = (pokemonSpecie) => {
    const species = pokemonSpecie.genera;
    for (const slot of species) {
        const language = slot.language.name;
        const english = "en";
        const specie = slot.genus;

        if (language === english) {
            return specie.replace("Pokémon", "");
        }
    }
};

const getId = (pokemon) => {
    return pokemon.id;
};

const getHeight = (pokemon) => {
    return `${pokemon.height / 10}m`;
};

const getWeight = (pokemon) => {
    return `${pokemon.weight / 10}kg`;
};

const getAbilities = (pokemon) => {
    const abilities = [];

    for (const slot of pokemon.abilities) {
        const abilityName = slot.ability.name.replaceAll("-", " ");

        if (slot.is_hidden) {
            abilities.push(`${abilityName} (hidden)`);
        } else {
            abilities.push(abilityName);
        }
    }

    return abilities;
};

const getGeneration = (pokemon, pokemonSpecie) => {
    const generationNumber = pokemonSpecie.generation.url.slice(-2, -1);

    if (/mega/.test(pokemon.name)) {
        return 6;
    } else if (/alola/.test(pokemon.name)) {
        return 7;
    } else if (/gmax|galar/.test(pokemon.name)) {
        return 8;
    } else {
        return generationNumber;
    }
};

const getHabitat = (pokemon, pokemonSpecie) => {
    if (/alola/.test(pokemon.name)) {
        return "alola";
    } else if (/galar/.test(pokemon.name)) {
        return "galar";
    } else {
        return pokemonSpecie.habitat === null
            ? "unknow"
            : pokemonSpecie.habitat.name.replaceAll("-", " ");
    }
};

const getCatchRate = (pokemonSpecie) => {
    return `${((pokemonSpecie.capture_rate / 255) * 100).toFixed(1)}%`;
};

const getBaseFriendship = (pokemonSpecie) => {
    return pokemonSpecie.base_happiness;
};

const getBaseExp = (pokemon) => {
    return pokemon.base_experience;
};

const getGrowthRate = (pokemonSpecie) => {
    const growthRate = pokemonSpecie.growth_rate.name.replaceAll("-", " ");

    return growthRate;
};

const getGender = (pokemonSpecie) => {
    if (pokemonSpecie.gender_rate !== -1) {
        const genderPorcentage = (pokemonSpecie.gender_rate / 8) * 100;
        const $genderContainer = returnElement({
            type: "div",
            class: "gender-container",
        });

        createGenderSymbol(
            $genderContainer,
            `♂ ${100 - genderPorcentage}% `,
            "#3581B8"
        );
        createGenderSymbol(
            $genderContainer,
            `♀ ${genderPorcentage}%`,
            "#FF338B"
        );

        return $genderContainer;
    } else {
        return "genderless";
    }
};

const createGenderSymbol = ($element, innerText, color) => {
    const $genderSymbol = returnElement({
        type: "span",
        class: "gender-container__gender-symbol",
        innerText: innerText,
        color: color,
    });

    appendElement($element, [$genderSymbol]);
};

const getEggGroups = (pokemonSpecie) => {
    if (pokemonSpecie.egg_groups !== null) {
        const egg_groups = [];

        for (const slot of pokemonSpecie.egg_groups) {
            if (slot.name == "no-eggs") return ["unknow"];

            egg_groups.push(slot.name);
        }

        return egg_groups;
    }
};

const getEggCycles = (pokemonSpecie) => {
    const STEPS_PER_ROUND = 250;
    const ROUNDS = pokemonSpecie.hatch_counter;
    const TOTAL_STEPS = (ROUNDS * STEPS_PER_ROUND).toString();
    const TOTAL_STEPS_WITH_POINT_PER_FIRST_THOUSAND = `${TOTAL_STEPS.slice(
        0,
        -3
    )}.${TOTAL_STEPS.toString().slice(-3)}`;

    return `∼${TOTAL_STEPS_WITH_POINT_PER_FIRST_THOUSAND} steps`;
};

const returnFightStats = (pokemon) => {
    const fightStats = {
        stats: {
            hp: returnStat(pokemon, "hp"),
            attack: returnStat(pokemon, "attack"),
            defense: returnStat(pokemon, "defense"),
            speed: returnStat(pokemon, "speed"),
            "sp. atk": returnStat(pokemon, "special-attack"),
            "sp. def": returnStat(pokemon, "special-defense"),
            total: returnTotal(pokemon),
        },
    };

    return fightStats;
};

/* Formula: https://pokemondb.net/pokebase/6506/there-formula-for-working-pokemons-highest-possible-stats*/
const returnStat = (pokemon, type) => {
    const BASE_STAT = getStat(pokemon, type);
    const MAX_IV = 31;
    const MAX_EV = 63;
    const NATURE_ADDS = 1.1;

    if (type !== "hp") {
        return {
            base: BASE_STAT,
            min: BASE_STAT * 2 + 110,
            max: BASE_STAT * 2 + 110 + MAX_IV + MAX_EV,
        };
    } else {
        return {
            base: BASE_STAT,
            min: BASE_STAT * 2 + 5,
            max: Math.floor(
                (BASE_STAT * 2 + 5 + MAX_IV + MAX_EV) * NATURE_ADDS
            ),
        };
    }
};

const getStat = (pokemon, type) => {
    for (const slot of pokemon.stats) {
        if (slot.stat.name === type) return slot.base_stat;
    }
};

const returnTotal = (pokemon) => {
    let baseStatsTotal = 0;
    const STATS_TYPES = [
        "hp",
        "attack",
        "defense",
        "speed",
        "special-attack",
        "special-defense",
    ];

    for (const type of STATS_TYPES) {
        baseStatsTotal += getStat(pokemon, type);
    }

    return {
        totalBase: baseStatsTotal,
        min: "min",
        max: "max",
    };
};

export const hideElement = ($element) => {
    $element.className += " hidden";
};

export const displayElement = ($element) => {
    $element.className = $element.className.replace(" hidden", "");
};

export const resetBackgroundColor = ($element) => {
    $element.style.backgroundColor = "";
};

export const removeElementChilds = ($element) => {
    const childLength = $element.childNodes.length - 1;

    for (let i = childLength; i >= 0; i--) {
        $element.childNodes[i].remove();
    }
};

export const selectButton = ($button) => {
    $button.className += "--selected";
};

export const unselectButton = ($button) => {
    $button.className = $button.className.replace("--selected", "");
};
