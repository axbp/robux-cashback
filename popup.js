const tutorialStages = [
    "Create an experience (or select) under a group in which you have access to <b>Group Funds</b>",
    'Get the Place ID of your experience. Example:<br><span style="font-size:.8em">roblox.com/games/<u><b>11764240248</b></u></span>',
    "Enter the Place ID in the input box below.",
    "Press the <b>SET</b> button.<br>If everything goes right, it should be ready for purchases."
]
var tutorialIndex = 0

function setPlaceId() {
    const input = document.getElementById("place-id-input").value;
    console.log("input " + input)
    if (Number(input)) {
        chrome.storage.sync.set({"cashbackPlaceId": input}, () => {
            document.getElementById("stat-value").innerHTML = input;
            console.log("saved " + input);
          });
        document.getElementById("tutorial-container").classList.add("hidden");
        document.getElementById("no-current").classList.add("hidden");
        document.getElementById("current-container").classList.remove("hidden");
    } else {
        document.getElementById("place-id-input").value = "Invalid ID";
    }
}

function openPage() {
    chrome.storage.sync.get("cashbackPlaceId", function(data) {
        window.open(`https://www.roblox.com/games/${data.cashbackPlaceId}/game`)
    });
}

function setTutorialIndex(index) {
    tutorialIndex = index
    const tutorialText = document.getElementById("tutorial-text")
    tutorialText.innerHTML = tutorialStages[index]

    const nextButton = document.getElementById("tutorial-next")
    const previousButton = document.getElementById("tutorial-previous")

    if (index <= 0) {
        previousButton.classList.add("hidden")
    } else if (previousButton.classList.contains("hidden")) {
        previousButton.classList.remove("hidden")
    }
    if (index == (tutorialStages.length - 1)) {
        nextButton.classList.add("hidden")
    } else if (nextButton.classList.contains("hidden")) {
        nextButton.classList.remove("hidden")
    }
}

function closeTutorial() {
    const tutorialContainer = document.getElementById("tutorial-container");
    const noCurrent = document.getElementById("no-current");

    tutorialContainer.classList.add("hidden")

    chrome.storage.sync.get("cashbackPlaceId", function(data) {
        if (!Number(data.cashbackPlaceId)) {
            noCurrent.classList.remove("hidden")
        }
    });
}
function openTutorial() {
    const tutorialContainer = document.getElementById("tutorial-container");
    const noCurrent = document.getElementById("no-current");
    setTutorialIndex(tutorialIndex)
    if (!noCurrent.classList.contains("hidden")) {
        noCurrent.classList.add("hidden")
    }
    if (tutorialContainer.classList.contains("hidden")) {
        tutorialContainer.classList.remove("hidden")
    }
}

window.onload = function() {
    chrome.storage.sync.get("cashbackPlaceId", function(data) {
        const placeId = data.cashbackPlaceId;
        document.getElementById("stat-value").innerHTML = placeId;
  
        const tutorial = document.getElementById("tutorial-container");
        const noCurrent = document.getElementById("no-current");
        const current = document.getElementById("current-container");
    
        if (Number(placeId)) {
            tutorial.classList.add("hidden");
            noCurrent.classList.add("hidden");
            current.classList.remove("hidden");
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("set-placeid").addEventListener('click', setPlaceId);

    document.getElementById("show-page").addEventListener('click', openPage);

    document.getElementById("start-tutorial").addEventListener("click", openTutorial);
    document.getElementById("no-current").addEventListener("click", openTutorial);
    document.getElementById("tutorial-next").addEventListener("click", () => {
        setTutorialIndex(tutorialIndex + 1)
    });
    document.getElementById("tutorial-previous").addEventListener("click", () => {
        setTutorialIndex(tutorialIndex - 1)
    });
    document.getElementById("tutorial-close").addEventListener("click", closeTutorial);

    document.getElementById("place-id-input").addEventListener('focus', () => {
        document.getElementById("place-id-input").value = ""
    });
});