const singleRoomsInput = document.getElementById('single-rooms');
const doubleRoomsInput = document.getElementById('double-rooms');
const tripleRoomsInput = document.getElementById('triple-rooms');
const roomTypeInput = document.getElementById('room-type');
const adultsInput = document.getElementById('adults');
const childrenInput = document.getElementById('children');
const extraBedInput = document.getElementById('extra-bed');
const promoCodeInput = document.getElementById('promo-code-check');
const bookNowButton = document.getElementById('book-now-btn');
const overallBookingCostDisplay = document.getElementById('overall-booking-cost');
const currentBookingCostDisplay = document.getElementById('current-booking-cost');
const addToFavoritesButton = document.getElementById('add-to-favorites-btn');
const checkLoyaltyButton = document.getElementById('check-loyalty-btn');
const promoCodeButton = document.getElementById('promo-code');
const adventureTypeInput = document.querySelectorAll('input[name="adventure-type"]');
const guideNeededInput = document.getElementById('guide-needed');
const bookAdventureButton = document.getElementById('book-adventure-btn');

bookAdventureButton.addEventListener('click', bookAdventure);
adventureTypeInput.forEach(input => input.addEventListener('change', updateAdventureCostDisplay));

guideNeededInput.addEventListener('change', updateAdventureCostDisplay);
promoCodeButton.addEventListener('click', promo);
checkLoyaltyButton.addEventListener('click', checkLoyalty);
addToFavoritesButton.addEventListener('click', addToFavorites);
extraBedInput.addEventListener('change', function () {updateRoomCostDisplay();});
bookNowButton.addEventListener('click', bookNow);
childrenInput.addEventListener('input', updateRoomCostDisplay);

function updateRoomBookingCost() {
  calculateCurrentBookingCost();
  updateAdventureCostDisplay(); 
}

singleRoomsInput.addEventListener('input', updateRoomBookingCost);
doubleRoomsInput.addEventListener('input', updateRoomBookingCost);
tripleRoomsInput.addEventListener('input', updateRoomBookingCost);

let currentBookingCost = 0;
let overallBookingCost = 0;

function initialize() {
  currentBookingCost = 0;
  overallBookingCost = 0;
  loyaltyPoints=0;
}

function calculateCurrentBookingCost() {
  let roomCosts = {
    single: 25000,
    double: 35000,
    triple: 40000
  }
  let numberOfSingleRooms = singleRoomsInput ? parseInt(singleRoomsInput.value) || 0 : 0;
  let numberOfDoubleRooms = doubleRoomsInput ? parseInt(doubleRoomsInput.value) || 0 : 0;
  let numberOfTripleRooms = tripleRoomsInput ? parseInt(tripleRoomsInput.value) || 0 : 0;
  let numberOfChildren = childrenInput ? parseInt(childrenInput.value) || 0 : 0;
  let roomCost = roomCosts.single * numberOfSingleRooms +
                 roomCosts.double * numberOfDoubleRooms +
                 roomCosts.triple * numberOfTripleRooms;
  let kidsMealCost = numberOfChildren * 5000;
  let extraBedCost = extraBedInput.checked ? 8000 : 0;
  currentBookingCost = roomCost + kidsMealCost + extraBedCost;
  updateCostDisplay(currentBookingCost, currentBookingCostDisplay);
}

function updateCostDisplay(cost, element) {
  element.textContent = 'Cost: ' + cost.toLocaleString('en-US', { style: 'currency', currency: 'LKR' });
}
function updateRoomCostDisplay() {
  let roomCosts = {
    single: 25000,
    double: 35000,
    triple: 40000
  }

  let numberOfSingleRooms = parseInt(singleRoomsInput.value) || 0;
  let numberOfDoubleRooms = parseInt(doubleRoomsInput.value) || 0;
  let numberOfTripleRooms = parseInt(tripleRoomsInput.value) || 0;

  let totalRoomCost = roomCosts.single * numberOfSingleRooms +
                     roomCosts.double * numberOfDoubleRooms +
                     roomCosts.triple * numberOfTripleRooms;

  let numberOfChildren = parseInt(childrenInput.value) || 0;
  let kidsMealCost = numberOfChildren * 5000;
  let extraBedCost = extraBedInput.checked ? 8000 : 0;
  overallBookingCost = extraBedCost;
  let roomCostWithExtraBed = totalRoomCost + extraBedCost + kidsMealCost;
  currentBookingCost = roomCostWithExtraBed;
  overallBookingCost = currentBookingCost;

  updateCostDisplay(roomCostWithExtraBed, currentBookingCostDisplay);
  updateCostDisplay(overallBookingCost, overallBookingCostDisplay);
  calculateLoyaltyPoints();
}

let bookNowClicked = false;
function bookNow() {
  if (bookNowClicked) {
    return;
  }

  calculateCurrentBookingCost();
  updateRoomCostDisplay();
  storeOverallBookingCost(currentBookingCost);
  overallBookingCost = getStoredOverallBookingCost();
  updateCostDisplay(currentBookingCost, currentBookingCostDisplay);
  updateCostDisplay(0, currentBookingCostDisplay);
  bookNowClicked = true;
  overallBookingCost = currentBookingCost;

  console.log('Before alert statement');
  alert('Thank you for booking!\nYour current booking cost is: ' + overallBookingCost.toLocaleString('en-US', { style: 'currency', currency: 'LKR' }));
  console.log('After alert statement');
  document.getElementById('booking-form').reset();
  currentBookingCost = 0;
}

let adventureBooked = false; 
function calculateAdventureCost(adventureType, guideNeeded,previousOverallCost) {
  if (!adventureType) {
    return 0; 
  }

  let adventureCosts = {
    'local-adult': 5000,
    'local-kid': 2000,
    'foreign-adult': 10000,
    'foreign-kid': 5000
  };

  let guideCost = 0;
  if (guideNeeded) {
    if (adventureType.includes("adult")) {
      guideCost = 1000;  
    } else {
      guideCost = 500;   
    }
  }
  let totalCost = adventureCosts[adventureType] + guideCost;
  return totalCost;
}

function bookAdventure() {
  if (adventureBooked) {
    return;
  }
  let previousOverallCost = getStoredOverallBookingCost();
  
  overallBookingCost = getStoredOverallBookingCost();
  let selectedAdventureType = [...adventureTypeInput].find(input => input.checked);
  let adventureType = selectedAdventureType ? selectedAdventureType.id : '';
  let guideNeeded = guideNeededInput.checked;
  let guideCost = guideNeeded ? (adventureType.includes("adult") ? 1000 : 500) : 0;

  if (adventureType) { 
    calculateCurrentBookingCost();
    let adventureCost = calculateAdventureCost(adventureType, guideNeeded, previousOverallCost);
    overallBookingCost = adventureCost;
    overallBookingCost = currentBookingCost + getStoredOverallBookingCost();
    alert('Thank you for booking diving adventure!\nAdventure Cost: ' + adventureCost.toLocaleString('en-US', { style: 'currency', currency: 'LKR' }));

    storeOverallBookingCost(overallBookingCost);
    updateCostDisplay(0, currentBookingCostDisplay);
    updateCostDisplay((overallBookingCost+adventureCost), overallBookingCostDisplay);
    document.getElementById('adventure-form').reset();
    adventureBooked = true;
  } else {
    alert('Please select an adventure type.');
  }
}

function updateAdventureCostDisplay() {
  let checkedAdventureTypes = [...adventureTypeInput].filter(input => input.checked);
  let guideNeeded = guideNeededInput.checked;
  let totalAdventureCost = 0;
  let guideCost = 0;

  checkedAdventureTypes.forEach(input => {
    let adventureType = input.id;
    guideCost += guideNeeded ? (adventureType.includes("adult") ? 1000 : 500) : 0;
    totalAdventureCost += calculateAdventureCost(adventureType, guideNeeded);
  });

  currentBookingCost = totalAdventureCost;
  overallBookingCost = currentBookingCost + getStoredOverallBookingCost();

  updateCostDisplay(currentBookingCost, currentBookingCostDisplay);
  updateCostDisplay(overallBookingCost, overallBookingCostDisplay);
}

function storeOverallBookingCost(cost) {
  localStorage.setItem('overallBookingCost', cost);
}
function getStoredOverallBookingCost() {
  const storedCost = localStorage.getItem('overallBookingCost');
  return storedCost ? parseFloat(storedCost) : 0;
}

function promo(event) {
  event.preventDefault();
  const promoCode = document.getElementById('promo-code-check').value;
  if (promoCode === 'Promo123') {
    overallBookingCost = overallBookingCost-overallBookingCost*(5/100);
    updateCostDisplay(overallBookingCost, overallBookingCostDisplay);
    alert('Promo code applied successfully. 5% discount has been deducted.');
  } 
  else {
    alert('Invalid promo code. Please enter a valid code.');
  }
}

let totalNumberOfRooms = 0;
function calculateLoyaltyPoints() {
  let numberOfSingleRooms = parseInt(singleRoomsInput.value) || 0;
  let numberOfDoubleRooms = parseInt(doubleRoomsInput.value) || 0;
  let numberOfTripleRooms = parseInt(tripleRoomsInput.value) || 0;
  totalNumberOfRooms = numberOfSingleRooms + numberOfDoubleRooms + numberOfTripleRooms;
  if (totalNumberOfRooms > 3) {
    loyaltyPoints = totalNumberOfRooms * 20;
  }
  localStorage.setItem('loyaltyPoints', loyaltyPoints);
}

function checkLoyalty(event) {
  event.preventDefault();
  let loyaltyPoints = localStorage.getItem('loyaltyPoints');
  alert('Your current loyalty points: ' + loyaltyPoints);
}

function addToFavorites(event) {
  event.preventDefault();
  const favoriteBooking = { overallBookingCost: overallBookingCost };
  const favoriteBookingJSON = JSON.stringify(favoriteBooking);
  localStorage.setItem('favoriteBooking', favoriteBookingJSON);
  alert('Booking added to favorites!');
}

initialize();
adventureTypeInput.forEach(input => input.addEventListener('change', function () {
  if (input.checked) {
    updateAdventureCostDisplay();
  } else {
    currentBookingCost -= calculateAdventureCost(input.id, guideNeededInput.checked);
    overallBookingCost = currentBookingCost;
    updateCostDisplay(currentBookingCost, currentBookingCostDisplay);
    updateCostDisplay(overallBookingCost, overallBookingCostDisplay);
  }
  updateRoomBookingCost(); 
}));

