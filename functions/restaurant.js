/*
    This is the page that manages everything related to the restaurant object information
*/

const utilities = require("./utility.js");

// Verifies if the restaurant already exists or not in the restaurant object by comparing the phone numbers
// If none of the numbers match, adds the restaurant to the restaurant object
// If one of the numbers match, the restaurant is not added
// signupInfo => information of the account
// info => restaurant object
function CreateRestoObject(info, restaurants) {
    console.log("CreateRestoObject");
    if (restaurants[utilities.CheckPhone(info.phoneNumber)]) { return { validation: false, answer: "This restaurant has already been registered!" } }
    let conflitcs = Object.keys(restaurants).filter(phoneNumber =>
        restaurants[phoneNumber].Address === info.address &&
        restaurants[phoneNumber].Name === info.name);
    if (conflitcs.length > 0) { return { validation: false, answer: "A " + info.name + "restaurant has already been registered at this address!" } }
    else { return { validation: true, answer: "You have successfully created a new account and registered your restaurant!" } }
}

// Adds a restaurant to the restaurant object using it's phone number as the unique ID
function AddRestaurant(info, restaurants) {
    console.log("AddRestaurant");
    restaurants[info.phoneNumber] = { // Creates a new restaurant object with it's phone number as unique ID
        Username: info.username, // Account username
        Email: info.email, // Account email
        Name: info.name, // Name of the restaurant
        City: info.city, // Name of the city in which the restaurant is
        Address: info.address, // The address of the restaurant
        Phone: utilities.CheckPhone(info.phoneNumber), // The phone number of the restaurant
        OpenHours: info.openHours, // The hour when the restaurant opens
        CloseHours: info.closeHours, // The hour when the restaurant closes
        Nb2Seaters: info.nb2Seaters, // The number of 2 table seats available
        Nb4Seaters: info.nb4Seaters, // The number of 4 table seats available
        Nb6Seaters: info.nb6Seaters, // The number of 6 table seats available
        Nb8Seaters: info.nb8Seaters // The number of 8 table seats available
    }
    return restaurants;
}

module.exports = {
    CreateRestoObject,
    AddRestaurant
}