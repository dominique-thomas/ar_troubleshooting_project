//----------------------------
//Global Variables
//----------------------------
let markersVisited = 0;
const markerList = [
    { id: 'marker-device', name: 'Device' },
    { id: 'marker-cable', name: 'Cable' },
    { id: 'marker-power', name: 'Power' },
    { id: 'marker-network', name: 'Network' }
  ];

  function updateMarkerState(id, index, checked) {
    markerState[id].checks[index] = checked;
  }

  const checkListData = {
    "marker-power": ["Power source is plugged in", "Power switch is ON", "Devices are connected to power source"],
    "marker-cable": ["Cable connected at both ends", "No fraying or exposed wires", "Cable is seated firmly"],
    "marker-network": ["Network device has power", "Status lights show activity", "Cables are connected"],
    "marker-device": ["Device is powered on", "No physical damage to port", "No signs of overheating (e.g., burn marks)"]
  };
  
  const markerState = {
    "marker-power": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-cable": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-network": { wasVisited: false, checks: [false, false, false], notes: "" },
    "marker-device": { wasVisited: false, checks: [false, false, false], notes: "" }
  };

    
  //----------------------------
  // Helper Functions
  //----------------------------
  function hideNavButtons(){
    const navButtonContainer = document.getElementById("nav-buttons");
    navButtonContainer.classList.add("hidden");
  }

  function showNavButtons(){
    const navButtonContainer = document.getElementById("nav-buttons");
    navButtonContainer.classList.remove("hidden");
  }

  function visitMarker(id) {
    if (!markerState[id].wasVisited) {
        markerState[id].wasVisited = true;
        markersVisited++;
        document.querySelector('.markers-inspected').textContent = `Markers Inspected: ${markersVisited} of 4`;
    }
 }  

  function showChecklist(id) {
    const title = document.querySelector(".checklist-title");
    const textarea = document.querySelector(".checklist-notes");
    const checklistItems = document.querySelectorAll(".checklist-item");
  
    const items = checkListData[id];
    const state = markerState[id];
  
    checklistPopup.classList.remove("hidden");
    hideNavButtons();
    visitMarker(id);
  
    title.textContent = "(" + id.replace("marker-", "").replace(/^./, (match) => match.toUpperCase()) + ")";
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
    alert('isAnyPopupOpen called')
    const popups = document.querySelectorAll(".popup");      
    return Array.from(popups).some(popup => {
      const style = window.getComputedStyle(popup);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }


  //----------------------------
  // Event Listeners
  //----------------------------
  window.addEventListener("DOMContentLoaded", () => {
    const closePopup = document.querySelectorAll(".close");
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
  });
  