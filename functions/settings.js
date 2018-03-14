/*
    This page manages everything related to the restaurants settings
*/

const utilities = require("./utility.js");

// Lets a restaurant change the number of 2, 4, 6 and 8 seaters available in their restaurant
function RestoSettings(info, restaurants) {
    console.log("RestoSettings");
    restaurants[info.restoPhone].Nb2Seaters = info.tables.nb2Seat;
    restaurants[info.restoPhone].Nb4Seaters = info.tables.nb4Seat;
    restaurants[info.restoPhone].Nb6Seaters = info.tables.nb6Seat;
    restaurants[info.restoPhone].Nb8Seaters = info.tables.nb8Seat;
    return { answer: "Your changes have been saved!", obj: restaurants }
}

module.exports = {
    RestoSettings
}