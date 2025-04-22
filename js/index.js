//----------------------------
//Global Variables
//----------------------------
const markerList = [
    { id: 'marker-device', name: 'Device' },
    { id: 'marker-ethernet', name: 'Ethernet' },
    { id: 'marker-power', name: 'Power' },
    { id: 'marker-router', name: 'Router' }
  ];

  function updateMarkerState(id, index, checked) {
    markerState[id].checks[index] = checked;
  }

  const checkListData = {
    "marker-power": ["Power strip is plugged in", "Power switch is ON", "Devices are connected to power strip."],
    "marker-ethernet": ["Cable connected at both ends", "No fraying or exposed wires", "Cable is seated firmly"],
    "marker-router": ["Router has power", "Status lights are green", "Cable is connected to modem"],
    "marker-device": ["Device is powered on", "No physical damage to ethernet port", "No signs of overheating (e.g., burn marks, melting, etc.)"]
  };
  
  const markerState = {
    "marker-power": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-ethernet": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-router": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-device": { wasVisited: false, checks: [false, false, false], notes: "" }
  };

  const closePopup = document.querySelectorAll(".close");
  const navButtonContainer = document.getElementById("nav-buttons");
  const aboutButton = document.getElementById("about-button");
  const aboutPopup = document.getElementById("about-popup");
  const finishButton = document.getElementById("finish-button");
  const finishPopup = document.getElementById("finish-popup");
  const confirmFinishButton = document.getElementById("confirm-finish");
  const cancelFinishButton = document.getElementById("cancel-finish");
  const summaryPopup = document.getElementById("summary-popup");
  const overviewPopup = document.getElementById("overview-popup");
  const overviewButton = document.getElementById("overview-button");
  const checklistPopup = document.getElementById("checklist-popup");

  //----------------------------
  // Helper Functions
  //----------------------------
    function hideNavButtons(){
      navButtonContainer.classList.add("hidden");
    }

    function showNavButtons(){
      navButtonContainer.classList.remove("hidden");
    }

    function showChecklist(id) {
      const title = document.querySelector(".checklist-title");
      const textarea = document.querySelector(".checklist-notes");
      const checklistItems = document.querySelectorAll(".checklist-item");
    
      const items = checkListData[id];
      const state = markerState[id];
    
      isCheckListOpen = true;
      checklistPopup.classList.remove("hidden");
      hideNavButtons();
    
      title.textContent = id.replace("-", " ").toUpperCase();
      state.wasVisited = true;
    
      checklistItems.forEach((item, i) => {
        const checkbox = item.querySelector("input");
        const label = item.querySelector("label");
    
        checkbox.checked = state.checks[i];
        checkbox.onchange = () => updateMarkerState(id, i, checkbox.checked);
        label.textContent = items[i];
      });
    
      textarea.value = state.notes || "N/A";
      textarea.oninput = () => {
        state.notes = textarea.value;
      };
    }

    function generateSummary() {
      Object.keys(markerState).forEach((key, index) => {
        const state = markerState[key];
        const summaryElement = document.getElementById(`notes-${index + 1}`); 
        summaryElement.textContent = state.notes || "N/A";
      });
    }    

    function isAnyPopupOpen() {
      return !document.querySelector(".popup:not(.hidden)") === null;
    }

  //----------------------------
  // Event Listeners
  //----------------------------
  markerList.forEach(marker => {
    const el = document.getElementById(marker.id);

    el.addEventListener("markerFound", () => {
      if (!isAnyPopupOpen()) {
        showChecklist(marker.id);
      }
    });
  });

  overviewButton.addEventListener("click", function () {
    overviewPopup.classList.add("hidden"); 
    showNavButtons();
    isCheckListOpen = false;
  });

  aboutButton.addEventListener("click", function () {
    aboutPopup.classList.remove("hidden"); 
  });

  finishButton.addEventListener("click", function () {
    finishPopup.classList.remove("hidden"); 
  });

  cancelFinishButton.addEventListener("click", function () {
    finishPopup.classList.add("hidden");
  });

  confirmFinishButton.addEventListener("click", function () {
    finishPopup.classList.add("hidden"); 
    summaryPopup.classList.remove("hidden");
    hideNavButtons();
    generateSummary();
  });


  closePopup.forEach(button => {
    button.addEventListener("click", function () {

      if (!checklistPopup.classList.contains("hidden")) {
        showNavButtons();
      }
      const parentPopup = button.closest(".popup");
      parentPopup.classList.add("hidden");
    });
  });

  