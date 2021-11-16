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
const randomPokemon = Math.floor(Math.random() * 898);
let $cardsGrid;
let $scrollToElement = $sectionPokemon;

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
        displayPokemonData(card.id);
        hideElement($sectionPokemon);
    }
};

const displayPokemonData = async (id = randomPokemon) => {
    const modalInfo = await getModalInfo(id);

    changeModalBackground(modalInfo);
    createGoBackButton($modalPokemon);
    createPokemonContainerModal($modalPokemon, modalInfo, id);
    createDataContainerModal($modalPokemon, modalInfo);
};

const changeModalBackground = (modalInfo) => {
    const firstTypePokemon = modalInfo.biography.Pokedex.types[0];
    const pokemonTypeColor =
        typePokemonColors[firstTypePokemon].backgroundColor;

    $modalPokemon.style.backgroundColor = pokemonTypeColor;
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
    $scrollToElement.scrollIntoView();
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

const createDataContainerModal = ($element, modalInfo) => {
    const $dataContainer = returnElement({
        type: "div",
        class: "pokemon__modal__data-container",
    });

    createButtonList($dataContainer, modalInfo);
    createBiographyContainer($dataContainer, modalInfo);
    createStatsContainer($dataContainer, modalInfo);
    createFormsContainer($dataContainer, modalInfo);

    appendElement($element, [$dataContainer]);
};

const createButtonList = ($element, modalInfo) => {
    const $buttonList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__list",
    });

    createButtonListItems($buttonList, modalInfo);

    appendElement($element, [$buttonList]);
};

const createButtonListItems = ($element, modalInfo) => {
    for (const [key] of Object.entries(modalInfo)) {
        const $listItem = returnElement({
            type: "li",
            class: "pokemon__modal__data-container__list__list-item",
        });

        createListButton($listItem, key);

        appendElement($element, [$listItem]);
    }
};

const createListButton = ($element, key) => {
    const $listButton = returnElement({
        type: "button",
        class: "pokemon__modal__data-container__list__list-item__button",
        innerText: key,
    });

    if (key === "biography") {
        $listButton.className =
            "pokemon__modal__data-container__list__list-item__button--selected";
    }

    $listButton.onclick = (e) => {
        handleSectionClick(e.target);
    };

    appendElement($element, [$listButton]);
};

const createBiographyContainer = ($element, modalInfo) => {
    const $biographyContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__biography-container",
        id: "biography",
    });

    createBiography($biographyContainer, modalInfo);

    appendElement($element, [$biographyContainer]);
};

const createBiography = ($element, modalInfo) => {
    createTitle($element, "Pokedex");
    createPokedexList($element, modalInfo);
    createTitle($element, "Details");
    createDetailsList($element, modalInfo);
};

const createTitle = ($element, titleInnerText) => {
    const $pokedexTitle = returnElement({
        type: "h3",
        class: "pokemon__modal__data-container__biography-container__list",
        innerText: titleInnerText,
    });

    appendElement($element, [$pokedexTitle]);
};

const createPokedexList = ($element, modalInfo) => {
    const $pokedexList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer(
        $pokedexList,
        modalInfo.biography.Pokedex,
        "biography"
    );

    appendElement($element, [$pokedexList]);
};

const createEntrieContainer = ($element, modalInfo, section) => {
    for (const [key, entrie] of Object.entries(modalInfo)) {
        if (key !== "japaneseName") {
            const $entrieContainer = returnElement({
                type: "li",
                class: `pokemon__modal__data-container__${section}-container__list__item`,
            });

            createEntrieTitle($entrieContainer, key, section);
            createEntrieData($entrieContainer, key, entrie, section);

            appendElement($element, [$entrieContainer]);
        }
    }
};

const createEntrieTitle = ($element, key, section) => {
    const $keyData = returnElement({
        type: "h4",
        class: `pokemon__modal__data-container__${section}-container__list__item__title medium-opacity`,
        innerText: key,
    });

    appendElement($element, [$keyData]);
};

const createEntrieData = ($element, key, entrie, section) => {
    if (section !== "stats") {
        const $entrieData = returnElement({
            type: "p",
            class: `pokemon__modal__data-container__${section}-container__list__item__entrie`,
            innerText: entrie.toString().replace(",", "\n"),
        });

        if (key === "id") {
            $entrieData.innerText = getDisplayedId(entrie);
        } else if (key === "description") {
            $entrieData.className = `pokemon__modal__data-container__${section}-container__list__item__description`;
            $entrieData.innerText = entrie;
        }

        appendElement($element, [$entrieData]);
    }

    if (section === "stats") {
        for (const slot of entrie) {
            const $entrieData = returnElement({
                type: "p",
                class: `pokemon__modal__data-container__${section}-container__list__item__entrie`,
                innerText: slot,
            });

            if (slot === "Min" || slot === "Max") {
                $entrieData.className = `pokemon__modal__data-container__${section}-container__list__item__min-max medium-opacity`;
            }

            appendElement($element, [$entrieData]);
        }
    }
};

const createDetailsList = ($element, modalInfo) => {
    const $detailsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer(
        $detailsList,
        modalInfo.biography.Details,
        "biography"
    );

    appendElement($element, [$detailsList]);
};

const createStatsContainer = ($element, modalInfo) => {
    const $statsContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__stats-container hidden",
        id: "stats",
    });

    createStats($statsContainer, modalInfo);

    appendElement($element, [$statsContainer]);
};

const createStats = ($element, modalInfo) => {
    createTitle($element, "Stats");
    createStatsList($element, modalInfo);
    createStatsDescription($element);
};

const createStatsList = ($element, modalInfo) => {
    const $statsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($statsList, modalInfo.stats.Stats, "stats");

    appendElement($element, [$statsList]);
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

const createFormsContainer = ($element, modalInfo) => {
    const $formsContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__forms-container hidden",
        id: "forms",
    });

    appendElement($element, [$formsContainer]);
};

const handleSectionClick = ($clickedButton) => {
    const selectedText = new RegExp("--selected");
    const $selectedButton = document.querySelector(
        ".pokemon__modal__data-container__list__list-item__button--selected"
    );

    if (!selectedText.test($clickedButton.className)) {
        hideSection($selectedButton);
        displaySection($clickedButton);

        selectButton($clickedButton);
        unselectButton($selectedButton);
    }
};

const hideSection = ($selectedButton) => {
    const unselectedInfoId = $selectedButton.innerText.toLowerCase();
    const $unselectedInfo = document.querySelector(`#${unselectedInfoId}`);
    hideElement($unselectedInfo);
};

const displaySection = ($clickedButton) => {
    const selectedInfoId = $clickedButton.innerText.toLowerCase();
    const $selectedInfo = document.querySelector(`#${selectedInfoId}`);
    displayElement($selectedInfo);
};

/* displayElement($modalPokemon);
displayPokemonData();
hideElement($sectionPokemon); */
