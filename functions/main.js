const fs = require("fs");
const display = require("./display.js");
const account = require("./account.js");
const deleteRes = require("./delete.js");
const settings = require("./settings.js");
const restaurant = require("./restaurant.js");
const reservation = require("./reservation.js");
const reservationValidate = require("./reservationValidation.js");
const utilities = require("./utility.js");

let tempClientObj = {}; // Object containing all the info about the temp Client reservations
let tempRestoObj = {}; // Object containing all the info about the temp Resto reservations
let reservations = {}; // Object containing all the info about the reservations
let restaurants = {}; // Object containing all the info about the restaurants
let passwords = {}; // Object containing all the info about the accounts

try { // Verifies if a list of temp Client reservations already exists
  tempClientObj = JSON.parse(fs.readFileSync("./functions/JSONobj/subClientReservations.json"));
} catch (err) { }
try { // Verifies if a list of temp Resto reservations already exists
  tempRestoObj = JSON.parse(fs.readFileSync("./functions/JSONobj/subRestoReservations.json"));
} catch (err) { }
try { // Verifies if a list of reservations already exists
  reservations = JSON.parse(fs.readFileSync("./functions/JSONobj/reservations.json"));
} catch (err) { }
try { // Verifies if a list of restaurants already exists
  restaurants = JSON.parse(fs.readFileSync("./functions/JSONobj/restaurants.json"));
} catch (err) { }
try { // Verifies if a list of passwords already exists
  passwords = JSON.parse(fs.readFileSync("./functions/JSONobj/passwords.json"));
} catch (err) { }

// Verifies if the restaurant already exists or not in the restaurant object by comparing the phone numbers
// Validates if the username has not been taken
// Validates if the Restaurant has not already been registered in the database
// Saves the account information and the restaurant object in a file
function RegisterRestaurant(info) {
  console.log("RegisterRestaurant");
  let register = account.ValidateRegistration(info, passwords);
  if (register.validation) {
    let restoValid = restaurant.CreateRestoObject(info, restaurants);
    if (restoValid.validation) {
      fs.writeFileSync("./functions/JSONobj/passwords.json", JSON.stringify(register.obj));
      fs.writeFileSync("./functions/JSONobj/restaurants.json", JSON.stringify(restaurant.AddRestaurant(info, restaurants)));
    }
    return restoValid.answer;
  }
  else { return register.answer; }
}

// Verifies if the username and password are valid during user login
function RestaurantLogIn(info) {
  console.log("RestaurantLogIn");
  return account.ValidateLogIn(info, passwords, restaurants);
}

function UserCreateReservation(info) {
  console.log("UserCreateReservation");
  let confirmation = reservationValidate.ValidateUserReservation(info, reservations, restaurants);
  if (confirmation.validation) {
    let makeReservation = reservation.AddUserReservation(info, reservations, tempRestoObj);
    fs.writeFileSync("./functions/JSONobj/subRestoReservations.json", JSON.stringify(makeReservation.tempObj));
    fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(makeReservation.obj));
    return makeReservation.answer;
  }
  return confirmation.answer;
}

// Adds a reservation to the reservation object using the clients phone number as the unique ID
// Saves the reservation object in a file
// Returns the confirmation message once everything is made
function CommunicateWithBot(info) {
  console.log("CommunicateWithBot");
  switch (info.result.action) {
    // Client confirms if they want to make the reservation or not
    case 'Reservation-Create.Reservation-Confirmation':
      console.log("Reservation-Create.Reservation-Confirmation");
      let makeReservation = reservation.AddReservation(info, reservations, tempClientObj);
      fs.writeFileSync("./functions/JSONobj/subClientReservations.json", JSON.stringify(makeReservation.tempObj));
      fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(makeReservation.obj));
      return { "speech": makeReservation.answer };
    case 'Reservation-Create.Reservation-Options':
      console.log("Reservation-Create.Reservation-Options");
      let choice = { 0: info.result.contexts.filter(context => context.name === "reservationoption")[0].parameters.choice[info.result.parameters['number-integer'] - 1] }
      return {
        "speech": "Confirm reservation?" + utilities.Confirmation(choice, 1, false),
        contextOut: [{ "name": "reservationconfirmation", parameters: { choice }, "lifespan": 1 }]
      }
    case 'Reservation-Display':
      console.log("Reservation-Display");
      return { "speech": display.DisplayClientReservations(info, reservations) }
    case 'Reservation-Delete':
      console.log("Reservation-Delete");
      let deleteReservation = deleteRes.DeleteClientReservations(info, reservations);
      if (deleteReservation.validation) { fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(deleteReservation.obj)); }
      return { "speech": deleteReservation.answer }
    default:
      console.log("default");
      let confirmation = reservationValidate.ValidateReservation(info, reservations, restaurants);
      if (confirmation.validation === true) { return { "speech": confirmation.answer, contextOut: confirmation.contextOut } }
      else { return { "speech": confirmation.answer, contextOut: confirmation.contextOut } }
  }
}

// Recieves resto number, date and time
function DisplayAllResto(info) {
  console.log("DisplayAllResto");
  return display.DisplayRestoReservations(info, reservations);
}

function ClearAll(info) {
  console.log("ClearAll");
  let clearReservations = deleteRes.CancelAllReservations(info, reservations);
  if (clearReservations.validation) { fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(clearReservations.obj)); }
  return clearReservations.answer;
}

function CancelReservation(info) {
  console.log("CancelReservation");
  let cancelReservation = deleteRes.CancelRestoReservations(info, reservations);
  fs.writeFileSync("./functions/JSONobj/reservations.json", JSON.stringify(cancelReservation.obj));
  return cancelReservation.answer;
}

function ChangeSettings(info) {
  console.log("ChangeSettings");
  let change = settings.RestoSettings(info, restaurants);
  fs.writeFileSync("./functions/JSONobj/restaurants.json", JSON.stringify(change.obj));
  return change.answer;
}

module.exports = {
  CommunicateWithBot,
  RegisterRestaurant,
  RestaurantLogIn,
  DisplayAllResto,
  ClearAll,
  CancelReservation,
  UserCreateReservation,
  ChangeSettings
}