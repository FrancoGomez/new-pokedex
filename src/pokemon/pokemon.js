import {
    appendElement,
    returnElement,
    getPokemonImage,
    getPokemon,
    typePokemonColors,
    getDisplayedId,
    getPokemonSpecies,
    hideElement,
    displayElement,
    getModalInfo,
    resetBackgroundColor,
    removeElementChilds,
    selectButton,
    unselectButton,
} from "../utilities/utilities.js";
import { displayPokemonData } from "./pokemon-modal.js";

const $sectionPokemon = document.querySelector("#section__pokemon");
const $modalPokemon = document.querySelector("#pokemon__modal");
let $scrollToElement;
let $cardsGrid;

export async function displayPokemon(amount) {
    createGrid($sectionPokemon);
    createPokemonCards($cardsGrid, amount);
}

const createGrid = ($element) => {
    const $grid = returnElement({
        type: "div",
        class: "section__pokemon__grid",
    });

    $cardsGrid = $grid;

    $grid.onclick = (e) => {
        handleCardClick(e);
    };

    appendElement($element, [$grid]);
};

const createPokemonCards = async ($element, amount) => {
    for (let index = 0; index < amount; index++) {
        const pokemonId = index + 1;
        await createPokemonCard($element, pokemonId);
    }
};

const createPokemonCard = async ($element, pokemonId) => {
    const pokemon = await fetchPokemonData(pokemonId);
    const pokemonSpecies = await fetchPokemonSpeciesData(pokemonId);

    const $pokemonCardContainer = returnElement({
        type: "div",
        class: `pokemon-card`,
        id: `card-${pokemon.id}`,
        backgroundColor: returnCardBackgroundColor(pokemon),
    });

    createGraphicContainer($pokemonCardContainer, pokemon, pokemonSpecies);
    createDataContainer($pokemonCardContainer, pokemon);
    createCardCover($pokemonCardContainer, pokemon);
    appendElement($element, [$pokemonCardContainer]);
};

const fetchPokemonData = async (pokemonId) => {
    const pokemon = await getPokemon(pokemonId);
    return pokemon;
};

const fetchPokemonSpeciesData = async (pokemonId) => {
    const pokemonSpecies = await getPokemonSpecies(pokemonId);
    return pokemonSpecies;
};

const returnCardBackgroundColor = (pokemon) => {
    const cardColors = typePokemonColors[pokemon.types[0]].backgroundColor;
    return cardColors;
};

const createGraphicContainer = ($elemento, pokemon, pokemonSpecies) => {
    const $graphicContainer = returnElement({
        type: "div",
        class: "pokemon-card__graphic-container",
    });

    createJapaneseName($graphicContainer, pokemonSpecies);
    createImageContainer($graphicContainer, pokemon);

    appendElement($elemento, [$graphicContainer]);
};

const createJapaneseName = ($element, pokemonSpecies) => {
    const $japaneseName = returnElement({
        type: "p",
        class: "pokemon-card__graphic-container__displayed-id low-opacity",
        innerText: pokemonSpecies.japaneseName,
    });

    appendElement($element, [$japaneseName]);
};

const createImageContainer = ($element, pokemon) => {
    const $imageContainer = returnElement({
        type: "div",
        class: "pokemon-card__graphic-container__image-container",
    });

    createBackgroundCircle($imageContainer);
    createImage($imageContainer, pokemon);

    appendElement($element, [$imageContainer]);
};

const createBackgroundCircle = ($element) => {
    const $backgroundCircle = returnElement({
        type: "div",
        class: "pokemon-card__graphic-container__image-container__background-circle low-opacity",
        backgroundColor: "white",
    });

    appendElement($element, [$backgroundCircle]);
};

const createImage = ($element, pokemon) => {
    const $pokemonImage = returnElement({
        type: "img",
        class: "pokemon-card__graphic-container__image-container__image",
        src: getPokemonImage(pokemon.id),
    });

    appendElement($element, [$pokemonImage]);
};

const createDataContainer = ($element, pokemon) => {
    const $dataContainer = returnElement({
        type: "div",
        class: "pokemon-card__data-container",
    });

    createName($dataContainer, pokemon.name);
    createId($dataContainer, pokemon.id);
    createTypesContainer($dataContainer, pokemon.types);

    appendElement($element, [$dataContainer]);
};

const createName = ($element, name) => {
    const $name = returnElement({
        type: "h2",
        class: "pokemon-card__data-container__name",
        innerText: name,
    });

    appendElement($element, [$name]);
};

const createId = ($element, id) => {
    const $id = returnElement({
        type: "p",
        class: "pokemon-card__data-container__id medium-opacity",
        innerText: getDisplayedId(id),
    });

    appendElement($element, [$id]);
};

const createTypesContainer = ($element, types) => {
    const $typesContainer = returnElement({
        type: "div",
        class: "pokemon-card__data-container__types-container",
    });

    for (const type of types) {
        createType($typesContainer, type);
    }

    appendElement($element, [$typesContainer]);
};

const createType = ($element, type) => {
    const textColor = typePokemonColors[type].backgroundColor;

    const $type = returnElement({
        type: "p",
        class: "pokemon-card__data-container__types-container__type",
        innerText: type,
        color: textColor,
    });

    appendElement($element, [$type]);
};

const createCardCover = ($element, pokemon) => {
    const $cardsCover = returnElement({
        type: "div",
        class: "pokemon-card__card-cover",
        id: pokemon.id,
    });

    appendElement($element, [$cardsCover]);
};

const handleCardClick = (e) => {
    const card = e.target;
    if (card.id) {
        $scrollToElement = card;
        displayElement($modalPokemon);
        displayPokemonData(card.id, $scrollToElement);
        hideElement($sectionPokemon);
    }
};

/* displayElement($modalPokemon);
displayPokemonData();
hideElement($sectionPokemon); */
