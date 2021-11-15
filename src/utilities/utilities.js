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

export function appendElement($father, arrayChilds) {
    for (const $child of arrayChilds) {
        $father.appendChild($child);
    }
}

export function returnElement(propiedades) {
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
}

export function getPokemonImage(pokemonId) {
    const imageUrl = `${
        pokemonId === 718
            ? "https://projectpokemon.org/images/sprites-models/homeimg/poke_capture_0718_000_uk_n_00000000_f_n.png"
            : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`
    }`;

    return imageUrl;
}

export function getDisplayedId(pokemonId) {
    const displayedId = `#${pokemonId.toString().padStart(3, "0")}`;

    return displayedId;
}

export async function getPokemon(id) {
    const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemonObject = await (await fetch(POKEMON_URL)).json();
    const types = [];

    const pokemon = {
        name: pokemonObject.name,
        id: pokemonObject.id,
    };

    for (const slot of pokemonObject.types) {
        const typeName = slot.type.name;
        types.push(typeName);
    }

    pokemon.types = types;

    return pokemon;
}

export async function getPokemonSpecies(id) {
    const POKEMON_SPECIES_URL = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    const pokemonSpeciesObject = await (
        await fetch(POKEMON_SPECIES_URL)
    ).json();

    const pokemonSpecies = {
        name: pokemonSpeciesObject.name,
        id: pokemonSpeciesObject.id,
        japaneseName: returnJapaneseName(pokemonSpeciesObject),
    };

    return pokemonSpecies;
}

const returnJapaneseName = (pokemonSpeciesObject) => {
    for (const slot of pokemonSpeciesObject.names) {
        const language = slot.language.name;
        const name = slot.name;

        if (language === "ja") {
            return name;
        }
    }
};

const returnDamageRelationObject = async () => {
    const POKEMON_TYPES_URL = "https://pokeapi.co/api/v2/type/";
    const pokemonTypesObject = await (await fetch(POKEMON_TYPES_URL)).json();

    for (const slot of pokemonTypes.results) {
        const POKEMON_DAMAGE_RELATION_URL = `https://pokeapi.co/api/v2/type/${slot.name}`;
        const pokemonDamageRelationObject = await (
            await fetch(POKEMON_TYPES_URL)
        ).json();

        pokemonDamageRelation = {
            "double damage from": "",
            "double damage to": "",
            "half damage from": "",
            "half damage to": "",
            "no damage from": "",
            "no damage to": "",
        };
    }
};

export async function getModalInfo(id) {
    const POKEMON_URL = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const POKEMON_SPECIES_URL = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    const pokemon = await (await fetch(POKEMON_URL)).json();
    const pokemonSpecies = await (await fetch(POKEMON_SPECIES_URL)).json();

    const pokemonInfo = returnPokemonInfo(pokemon, pokemonSpecies);
    const fightStats = returnFightStats(pokemon);
    const specieForms = returnSpecieForms(pokemonSpecies);

    return {
        biography: pokemonInfo,
        stats: fightStats,
        forms: specieForms,
    };
}

getModalInfo(1);

const returnDescription = (entries) => {
    for (const slot of entries) {
        const language = slot.language.name;
        const description = slot.flavor_text;

        if (language === "en") {
            return description
                .replaceAll("\n", " ")
                .replace("POKéMON", "Pokemon")
                .replaceAll(".", ". ");
        }
    }
};

const returnTypes = (types) => {
    const auxiliar = [];

    for (const slot of types) {
        auxiliar.push(slot.type.name);
    }

    return auxiliar;
};

const returnAbilities = (route, returnHidden) => {
    const abilities = [];

    for (const slot of route) {
        const abilityName = slot.ability.name.replaceAll("-", " ");

        if (!slot.is_hidden) {
            abilities.push(abilityName);
        } else if (returnHidden && slot.is_hidden) {
            return abilityName;
        }
    }

    return abilities;
};

const returnEggTypes = (route) => {
    const eggTypes = [];

    for (const slot of route) {
        eggTypes.push(slot.name);
    }

    return eggTypes.length === 0 ? "unknow" : eggTypes;
};

const returnPokemonInfo = (pokemon, pokemonSpecies) => {
    const pokemonInfo = {
        Pokedex: {
            description: returnDescription(pokemonSpecies.flavor_text_entries),
            name: pokemon.name,
            id: pokemon.id,
            japaneseName: returnJapaneseName(pokemonSpecies),
            specie: pokemonSpecies.genera[7].genus,
            types: returnTypes(pokemon.types),
            abilities: returnAbilities(pokemon.abilities),
            "hidden ability":
                returnAbilities(pokemon.abilities, true).length === 0
                    ? "none"
                    : returnAbilities(pokemon.abilities, true),
            height: `${pokemon.height / 10}m`,
            weight: `${pokemon.weight / 10}kg`,
            gender: pokemonSpecies.gender_rate !== -1 ? "♂ ♀" : "genderless",
            "egg group": returnEggTypes(pokemonSpecies.egg_groups),
        },
        Details: {
            "catch rate": `${(
                (pokemonSpecies.capture_rate / 255) *
                100
            ).toFixed(1)}%`,
            "base happines": pokemonSpecies.base_happiness,
            "base experience": pokemon.base_experience,
            grow: pokemonSpecies.growth_rate.name.replaceAll("-", " "),
            color: pokemonSpecies.color.name,
            generation: pokemonSpecies.generation.url
                .replace("https://pokeapi.co/api/v2/generation/", "")
                .replace("/", ""),
            habitat:
                pokemonSpecies.habitat === null
                    ? "unknow"
                    : pokemonSpecies.habitat.name,
            shape: pokemonSpecies.shape.name,
        },
    };

    return pokemonInfo;
};

const returnFightStats = (pokemon) => {
    const fightStats = {
        Stats: {
            hp: [
                pokemon.stats[0].base_stat,
                Math.floor(pokemon.stats[0].base_stat * 2 + 204),
            ],
            attack: [
                pokemon.stats[1].base_stat,
                Math.floor(pokemon.stats[1].base_stat * 2 + 99 * 1.1),
            ],
            defense: [
                pokemon.stats[2].base_stat,
                Math.floor(pokemon.stats[2].base_stat * 2 + 99 * 1.1),
            ],
            speed: [
                pokemon.stats[3].base_stat,
                Math.floor(pokemon.stats[3].base_stat * 2 + 99 * 1.1),
            ],
            "sp. atk": [
                pokemon.stats[4].base_stat,
                Math.floor(pokemon.stats[4].base_stat * 2 + 99 * 1.1),
            ],
            "sp. def": [
                pokemon.stats[5].base_stat,
                Math.floor(pokemon.stats[5].base_stat * 2 + 99 * 1.1),
            ],
            "": ["Min", "Max"],
        },
        Effectiveness: {
            types: [],
        },
        Weaknesses: {
            types: [],
        },
    };

    return fightStats;
};

const returnSpecieForms = (pokemonSpecies) => {
    /* use evolution chain */
    const specieForms = {
        Evolution: {
            first: "",
            second: "",
            third: "",
            "mega evolution": "",
            gigamax: "",
        },
        Shiny: {
            first: "",
            second: "",
            third: "",
            "mega evolution": "",
            gigamax: "",
        },
    };

    return specieForms;
};

export function hideElement($element) {
    $element.className += " hidden";
}

export function displayElement($element) {
    $element.className = $element.className.replace(" hidden", "");
}

export function resetBackgroundColor($element) {
    $element.style.backgroundColor = "";
}
export function removeElementChilds($element) {
    const childLength = $element.childNodes.length - 1;

    for (let i = childLength; i >= 0; i--) {
        $element.childNodes[i].remove();
    }
}

export function selectButton($button) {
    $button.className += "--selected";
}

export function unselectButton($button) {
    $button.className = $button.className.replace("--selected", "");
}
