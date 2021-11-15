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

const $sectionPokemon = document.querySelector("#section__pokemon");
const $modalPokemon = document.querySelector("#pokemon__modal");
let $cardsGrid;
let $returnToElement = $sectionPokemon;

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
    const $returnToElement = returnElement({
        type: "div",
        class: "pokemon-card__card-cover",
        id: pokemon.id,
    });

    appendElement($element, [$returnToElement]);
};

const handleCardClick = (e) => {
    const card = e.target;

    if (card.id !== "") {
        $returnToElement = card;
        displayElement($modalPokemon);
        displayPokemonData(card.id);
        hideElement($sectionPokemon);
    }
};

const randomPokemon = Math.floor(Math.random() * 898);

const displayPokemonData = async (id = randomPokemon) => {
    const modalInfo = await getModalInfo(id);

    changeModalBackground(modalInfo);
    createGoBackButton($modalPokemon);
    createPokemonContainerModal($modalPokemon, modalInfo, id);
    createDataContainerModal($modalPokemon, modalInfo);
};

const changeModalBackground = (modalInfo) => {
    const firstTypeColor =
        typePokemonColors[modalInfo.biography.Pokedex.types[0]].backgroundColor;

    $modalPokemon.style.backgroundColor = firstTypeColor;
};

const createGoBackButton = ($element) => {
    const $goBackButton = returnElement({
        type: "button",
        class: "pokemon__modal__button medium-opacity",
        innerText: "Go back",
    });

    $goBackButton.onclick = () => {
        handleGoBackClick();
    };

    appendElement($element, [$goBackButton]);
};

const handleGoBackClick = () => {
    removeElementChilds($modalPokemon);
    resetBackgroundColor($modalPokemon);
    hideElement($modalPokemon);
    displayElement($sectionPokemon);
    $returnToElement.scrollIntoView();
};

const createPokemonContainerModal = ($element, modalInfo, id) => {
    const $pokemonContainer = returnElement({
        type: "div",
        class: "pokemon__modal__pokemon-container",
    });

    createJapaneseNameModal($pokemonContainer, modalInfo);
    createImageContainerModal($pokemonContainer, id);

    appendElement($element, [$pokemonContainer]);
};

const createJapaneseNameModal = ($element, modalInfo) => {
    const $japaneseName = returnElement({
        type: "p",
        class: "pokemon__modal__pokemon-container__japanese-name low-opacity",
        innerText: modalInfo.biography.Pokedex.japaneseName,
    });

    appendElement($element, [$japaneseName]);
};

const createImageContainerModal = ($element, id) => {
    const $imageContainer = returnElement({
        type: "div",
        class: "pokemon__modal__pokemon-container__image-container",
    });

    createBackgroundCircleModal($imageContainer);
    createPokemonImageModal($imageContainer, id);

    appendElement($element, [$imageContainer]);
};

const createBackgroundCircleModal = ($element) => {
    const $backgroundCircle = returnElement({
        type: "div",
        class: "pokemon__modal__pokemon-container__image-container__background-circle low-opacity",
        backgroundColor: "white",
    });

    appendElement($element, [$backgroundCircle]);
};

const createPokemonImageModal = ($element, id) => {
    const $pokemonImage = returnElement({
        type: "img",
        class: "pokemon__modal__pokemon-container__image-container__pokemon-image",
        src: getPokemonImage(id),
    });

    appendElement($element, [$pokemonImage]);
};

/* Refactor later */
const createDataContainerModal = ($element, modalInfo) => {
    const $dataContainer = returnElement({
        type: "div",
        class: "pokemon__modal__data-container",
    });

    const $buttonList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__list",
    });

    for (const [key] of Object.entries(modalInfo)) {
        const $listItem = returnElement({
            type: "li",
            class: "pokemon__modal__data-container__list__list-item",
        });

        const $listButton = returnElement({
            type: "button",
            class:
                key === "biography"
                    ? "pokemon__modal__data-container__list__list-item__button--selected"
                    : "pokemon__modal__data-container__list__list-item__button",
            innerText: key,
        });

        $listButton.onclick = (e) => {
            handleSectionClick(e.target);
        };

        appendElement($listItem, [$listButton]);
        appendElement($buttonList, [$listItem]);
    }

    const $biographyContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__biography-container",
        id: "biography",
    });

    const $statsContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__stats-container hidden",
        id: "stats",
    });

    const $formsContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__forms-container hidden",
        id: "forms",
    });

    const $pokedexTitle = returnElement({
        type: "h3",
        class: "pokemon__modal__data-container__biography-container__list",
        innerText: "Pokedex",
    });

    const $pokedexList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    for (const [key, entrie] of Object.entries(modalInfo.biography.Pokedex)) {
        if (key !== "japaneseName") {
            const $entrieContainer = returnElement({
                type: "li",
                class: "pokemon__modal__data-container__biography-container__list__item",
            });

            const $keyData = returnElement({
                type: "h4",
                class: "pokemon__modal__data-container__biography-container__list__item__title medium-opacity",
                innerText: key,
            });

            const $entrieData = returnElement({
                type: "p",
                class: "pokemon__modal__data-container__biography-container__list__item__entrie",
                innerText: entrie.toString().replace(",", "\n"),
            });

            if (key === "id") {
                $entrieData.innerText = getDisplayedId(entrie);
            } else if (key === "description") {
                $entrieData.className =
                    "pokemon__modal__data-container__biography-container__list__item__description";
                $entrieData.innerText = entrie;
            }

            appendElement($entrieContainer, [$keyData, $entrieData]);
            appendElement($pokedexList, [$entrieContainer]);
        }
    }

    const $detailsTitle = returnElement({
        type: "h3",
        class: "pokemon__modal__data-container__biography-container__list",
        innerText: "Details",
    });

    const $detailsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    for (const [key, entrie] of Object.entries(modalInfo.biography.Details)) {
        if (key !== "japaneseName") {
            const $entrieContainer = returnElement({
                type: "li",
                class: "pokemon__modal__data-container__biography-container__list__item",
            });

            const $keyData = returnElement({
                type: "h4",
                class: "pokemon__modal__data-container__biography-container__list__item__title medium-opacity",
                innerText: key,
            });

            const $entrieData = returnElement({
                type: "p",
                class:
                    key === "description"
                        ? "pokemon__modal__data-container__biography-container__list__item__description"
                        : "pokemon__modal__data-container__biography-container__list__item__entrie",
                innerText:
                    key !== "id"
                        ? entrie.toString().replace(",", "\n")
                        : getDisplayedId(entrie),
            });

            appendElement($entrieContainer, [$keyData, $entrieData]);
            appendElement($detailsList, [$entrieContainer]);
        }
    }

    appendElement($biographyContainer, [
        $pokedexTitle,
        $pokedexList,
        $detailsTitle,
        $detailsList,
    ]);

    createStatsTitle($statsContainer);
    createStatsList($statsContainer, modalInfo);
    createStatsDescription($statsContainer);

    appendElement($dataContainer, [
        $buttonList,
        $biographyContainer,
        $statsContainer,
        $formsContainer,
    ]);

    appendElement($element, [$dataContainer]);
};

const createStatsTitle = ($element) => {
    const $statsTitle = returnElement({
        type: "h3",
        class: "pokemon__modal__data-container__biography-container__list",
        innerText: "Stats",
    });

    appendElement($element, [$statsTitle]);
};

const createStatsList = ($element, modalInfo) => {
    const $statsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($statsList, modalInfo);

    appendElement($element, [$statsList]);
};

const createEntrieContainer = ($element, modalInfo) => {
    for (const [key, entrie] of Object.entries(modalInfo.stats.Stats)) {
        const $entrieContainer = returnElement({
            type: "li",
            class: "pokemon__modal__data-container__stats-container__list__item",
        });

        createKey($entrieContainer, key);
        createEntrie($entrieContainer, entrie);

        appendElement($element, [$entrieContainer]);
    }
};

const createKey = ($element, key) => {
    const $keyData = returnElement({
        type: "h4",
        class: "pokemon__modal__data-container__stats-container__list__item__title medium-opacity",
        innerText: key,
    });

    appendElement($element, [$keyData]);
};

const createEntrie = ($element, entrie) => {
    for (const slot of entrie) {
        const $entrieData = returnElement({
            type: "p",
            class: "pokemon__modal__data-container__stats-container__list__item__entrie",
            innerText: slot,
        });

        if (slot === "Min" || slot === "Max") {
            $entrieData.className =
                "pokemon__modal__data-container__stats-container__list__item__min-max medium-opacity";
        }

        appendElement($element, [$entrieData]);
    }
};

const createStatsDescription = ($element) => {
    const description =
        "Min & Max values are calculated for level 100 Pokemon. Minimum values are based on 0 EVs & 0 IVs, meanwhile Maximum values are based on 252 EVs & 31 IVs.";

    const $statsDescription = returnElement({
        type: "p",
        class: "pokemon__modal__data-container__biography-container__description medium-opacity",
        innerText: description,
    });

    appendElement($element, [$statsDescription]);
};

const handleSectionClick = ($clickedButton) => {
    const selectedText = new RegExp("--selected");
    const $selectedButton = document.querySelector(
        ".pokemon__modal__data-container__list__list-item__button--selected"
    );

    if (!selectedText.test($clickedButton.className)) {
        const selectedInfoId = $clickedButton.innerText.toLowerCase();
        const unselectedInfoId = $selectedButton.innerText.toLowerCase();

        const $selectedInfo = document.querySelector(`#${selectedInfoId}`);
        const $unselectedInfo = document.querySelector(`#${unselectedInfoId}`);

        displayElement($selectedInfo);
        hideElement($unselectedInfo);

        selectButton($clickedButton);
        unselectButton($selectedButton);
    }
};

displayElement($modalPokemon);
displayPokemonData();
hideElement($sectionPokemon);
