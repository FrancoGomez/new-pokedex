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
let $scrollToElement = $sectionPokemon;

export const displayPokemonData = async (id = randomPokemon) => {
    const modalInfo = await getModalInfo(id);

    changeModalBackground(modalInfo);
    createGoBackButton($modalPokemon);
    createPokemonContainerModal($modalPokemon, modalInfo, id);
    createDataContainerModal($modalPokemon, modalInfo);
};

const changeModalBackground = (modalInfo) => {
    const firstTypePokemon = modalInfo.about.about.types[0];
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
        innerText: modalInfo.about.about.japaneseName,
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
    const firstTypePokemon = modalInfo.about.about.types[0];
    const pokemonTypeColor =
        typePokemonColors[firstTypePokemon].backgroundColor;

    const $dataContainer = returnElement({
        type: "div",
        class: "pokemon__modal__data-container",
    });

    createButtonList($dataContainer, modalInfo);
    createBiographyContainer($dataContainer, modalInfo, pokemonTypeColor);
    createStatsContainer($dataContainer, modalInfo, pokemonTypeColor);
    createFormsContainer($dataContainer, modalInfo, pokemonTypeColor);

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

    if (key === "about") {
        $listButton.className =
            "pokemon__modal__data-container__list__list-item__button--selected";
    }

    $listButton.onclick = (e) => {
        handleSectionClick(e.target);
    };

    appendElement($element, [$listButton]);
};

const createBiographyContainer = ($element, modalInfo, pokemonTypeColor) => {
    const $biographyContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__biography-container",
        id: "about",
    });

    createBiography($biographyContainer, modalInfo, pokemonTypeColor);

    appendElement($element, [$biographyContainer]);
};

const createBiography = ($element, modalInfo, pokemonTypeColor) => {
    createTitle($element, modalInfo.about.about.name, pokemonTypeColor);
    createDescription($element, modalInfo);
    createTitle($element, "Pokédex Data", pokemonTypeColor);
    createPokedexList($element, modalInfo);
    createTitle($element, "Training", pokemonTypeColor);
    createTrainingList($element, modalInfo);
    createTitle($element, "Breeding", pokemonTypeColor);
    createBreedingList($element, modalInfo);
};

const createDescription = ($element, modalInfo) => {
    const $description = returnElement({
        type: "p",
        class: "pokemon__modal__data-container__biography-container__about-description",
        innerText: modalInfo.about.about.description,
    });

    appendElement($element, [$description]);
};

const createTitle = ($element, titleInnerText, color) => {
    const $pokedexTitle = returnElement({
        type: "h3",
        class: "pokemon__modal__data-container__biography-container__list-title",
        innerText: titleInnerText,
        color: color,
    });

    appendElement($element, [$pokedexTitle]);
};

const createPokedexList = ($element, modalInfo) => {
    const $pokedexList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($pokedexList, modalInfo.about.pokedex, "biography");

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
        class: `pokemon__modal__data-container__${section}-container__list__item__title`,
        innerText: key,
    });

    appendElement($element, [$keyData]);
};

const createEntrieData = ($element, key, entrie, section) => {
    if (section !== "stats") {
        if (key !== "gender" || entrie === "genderless") {
            const $entrieData = returnElement({
                type: "p",
                class: `pokemon__modal__data-container__${section}-container__list__item__entrie`,
                innerText: entrie.toString().replaceAll(",", "\n"),
            });

            if (key === "id") {
                $entrieData.innerText = getDisplayedId(entrie);
            } else if (key === "description") {
                $entrieData.className = `pokemon__modal__data-container__${section}-container__list__item__description`;
                $entrieData.innerText = entrie;
            }

            appendElement($element, [$entrieData]);
        } else {
            const $entrieData = entrie;

            appendElement($element, [$entrieData]);
        }
    }

    if (section === "stats") {
        for (const [name, value] of Object.entries(entrie)) {
            const $entrieData = returnElement({
                type: "p",
                class: `pokemon__modal__data-container__${section}-container__list__item__entrie`,
                innerText: value,
            });

            if (name === "totalBase" || value[0] === "m") {
                $entrieData.className += " medium-opacity";
                $entrieData.style.fontWeight = "600";
            }

            appendElement($element, [$entrieData]);
        }
    }
};

const createTrainingList = ($element, modalInfo) => {
    const $detailsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($detailsList, modalInfo.about.training, "biography");

    appendElement($element, [$detailsList]);
};

const createBreedingList = ($element, modalInfo) => {
    const $detailsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($detailsList, modalInfo.about.breeding, "biography");

    appendElement($element, [$detailsList]);
};

const createStatsContainer = ($element, modalInfo, pokemonTypeColor) => {
    const $statsContainer = returnElement({
        type: "section",
        class: "pokemon__modal__data-container__stats-container hidden",
        id: "stats",
    });

    createStats($statsContainer, modalInfo, pokemonTypeColor);

    appendElement($element, [$statsContainer]);
};

const createStats = ($element, modalInfo, pokemonTypeColor) => {
    createTitle($element, "Base stats", pokemonTypeColor);
    createStatsList($element, modalInfo);
    createStatsDescription($element);
};

const createStatsList = ($element, modalInfo) => {
    const $statsList = returnElement({
        type: "ul",
        class: "pokemon__modal__data-container__biography-container__list",
    });

    createEntrieContainer($statsList, modalInfo.stats.stats, "stats");

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
        id: "evolutions",
    });

    createEvolutionsContainer($formsContainer, modalInfo);
    createEvolutionsFormsContainer($formsContainer, modalInfo);

    appendElement($element, [$formsContainer]);
};

const createEvolutionsContainer = ($element, modalInfo) => {
    for (const [evolution, evolutionData] of Object.entries(
        modalInfo.evolutions
    )) {
        const $evolutionsContainer = returnElement({
            type: "div",
            class: "pokemon__modal__data-container__forms-container__evolutions-container",
        });

        if (evolutionData !== undefined) {
            for (const slot of evolutionData) {
                const $evolutionContainer = returnElement({
                    type: "div",
                    class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container",
                });

                createContainerImageForm($evolutionContainer, slot);
                createNameForm($evolutionContainer, slot);
                createIdForm($evolutionContainer, slot);
                createTypesForm($evolutionContainer, slot);

                appendElement($evolutionsContainer, [$evolutionContainer]);
            }
        }

        appendElement($element, [$evolutionsContainer]);
    }
};

const createContainerImageForm = ($element, slot) => {
    const $containerImageForm = returnElement({
        type: "div",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__image-container",
    });

    createBackgroundCircleForm($containerImageForm, slot);
    createImageForm($containerImageForm, slot);

    appendElement($element, [$containerImageForm]);
};

const createBackgroundCircleForm = ($element, slot) => {
    const firstTypePokemon = slot.types[0];
    const pokemonTypeColor =
        typePokemonColors[firstTypePokemon].backgroundColor;

    const $backgroundCircleForm = returnElement({
        type: "div",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__image-container__background-circle",
        backgroundColor: pokemonTypeColor,
    });

    appendElement($element, [$backgroundCircleForm]);
};

const createImageForm = ($element, slot) => {
    const $imageForm = returnElement({
        type: "img",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__image-container__image-form",
        src: slot["image url"],
        id: slot.id,
    });

    $imageForm.onclick = (e) => {
        const image = e.target;
        handleGoBackClick();
        displayElement($modalPokemon);
        displayPokemonData(image.id);
        hideElement($sectionPokemon);
    };

    appendElement($element, [$imageForm]);
};

const createNameForm = ($element, slot) => {
    const $nameForm = returnElement({
        type: "h4",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__name-form",
        innerText: slot.name,
    });

    appendElement($element, [$nameForm]);
};

const createIdForm = ($element, slot) => {
    const $idForm = returnElement({
        type: "p",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__id-form medium-opacity",
        innerText: getDisplayedId(slot.id),
    });

    appendElement($element, [$idForm]);
};

const createTypesForm = ($element, slot) => {
    const $typesForm = returnElement({
        type: "div",
        class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__types-form",
    });

    for (const type of slot.types) {
        const textColor = typePokemonColors[type].backgroundColor;

        const $typeForm = returnElement({
            type: "div",
            class: "pokemon__modal__data-container__forms-container__evolutions-container__evolution-container__types-form__type",
            innerText: type,
            color: textColor,
        });

        appendElement($typesForm, [$typeForm]);
    }

    appendElement($element, [$typesForm]);
};

const createEvolutionsFormsContainer = ($element, modalInfo) => {};

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
