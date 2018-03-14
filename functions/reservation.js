/*
    This is the page that manages everything related to the reservation object information
*/
const utilities = require("./utility.js");

// Adds a reservation to the reservation object using the clients phone number as the unique ID
function AddReservation(info, reservations, tempObj) {
    console.log("AddReservation");
    if (info.originalRequest.data.Body.toLowerCase() === "no") { return "Reservation canceled."; }
    let clientNumber = utilities.CheckPhone(info.originalRequest.data.From.slice(1)); // This is where the clients phone number is stored when RestoBot is messaged, this will be used as the reservations unique ID if the reservation is valid
    let parameters = info.result.contexts.filter(context => context.name === "reservationconfirmation")[0].parameters; // This is where all the information needed to make a reservation is being kept  
    let nbOfPeople = parameters.choice[0].nbPeople === "1" ? "1 person" : parameters.choice[0].nbPeople + " people"; // Not usefull, just good grammar
    let date = parameters.date; // We will need it later
    let time = parameters.time.slice(0, -3); // Would usually display HH:MM:SS, now simply displays HH:MM
    let dateTime = date + "/" + time; // Needed to make sure a client does not make two reservations at the same time
    let hourIn = utilities.CheckHourIn(parameters.time); // See the CheckHourIn function
    let hourOut = hourIn + 1; // Lets us store the hour the reservation should end
    tempObj[dateTime] = {
        client: parameters['given-name'], // The client's name
        clientNumber, // The clients phone number
        restaurant: parameters.name, // The restaurants name
        restoNumber: parameters.choice[0].phone, // The restaurants phone number
        city: parameters['geo-city'], // The city in which the restaurant is
        address: parameters.choice[0].address, // The restaurants address
        nbOfPeople, // The number of people who will be present
        nbSeats: parameters.choice[0].nbSeats, // The number of seats that will be taken
        date, // The date the reservation will take place
        time, // The time the reservation will take place
        hourIn, // The time the reservation begins
        hourOut, // The time the reservation ends
        isOver: false, // Determines is the reservation is over, because it has just been created, it is set to false by default
        isCancelled: false // Determines if the reservation has been cancelled, because it has just been created, it is set to false by default
    }
    reservations[clientNumber] = tempObj; // Stores the new reservation into the reservation object, could use parameters but we are adding additionnal information
    setTimeout(() => reservations[clientNumber][dateTime].isOver = true, new Date(dateTime) - new Date());
    return { // Returns the confirmation message once everything is made
        obj: reservations,
        tempObj: tempObj,
        answer: "Successfully created a reservation under the name of " + parameters['given-name'] + " at " + parameters['name'] +
            " for " + nbOfPeople + " in " + parameters['geo-city'] + " on " + parameters.date + " at " + time + "!"
    }
}

function AddUserReservation(info, reservations, tempObj) {
    console.log("AddUserReservation");
    let clientNumber = utilities.CheckPhone(info.clientNumber);
    let nbOfPeople = info.nbOfPeople === "1" ? "1 person" : info.nbOfPeople + " people"; // Not usefull, just good grammar
    let nbSeats = utilities.CheckSeats(parseInt(info.nbOfPeople)); // See the CheckSeats function
    let date = info.date; // We will need it later
    let time = info.time; // Would usually display HH:MM:SS, now simply displays HH:MM
    let dateTime = date + "/" + time; // Needed to make sure a client does not make two reservations at the same time
    let hourIn = utilities.CheckHourIn(time); // See the CheckHourIn function
    let hourOut = hourIn + 1; // Lets us store the hour the reservation should end
    tempObj[dateTime] = {
        client: info.clientName, // The client's name
        clientNumber: clientNumber, // The clients phone number
        restaurant: info.restoName, // The restaurants name
        restoNumber: info.restoNumber, // The restaurants phone number
        city: info.city, // The city in which the restaurant is
        address: info.address, // The restaurants address
        nbOfPeople, // The number of people who will be present
        nbSeats, // The number of seats that will be taken
        date, // The date the reservation will take place
        time, // The time the reservation will take place
        hourIn, // The time the reservation begins
        hourOut, // The time the reservation ends
        isOver: false, // Determines is the reservation is over, because it has just been created, it is set to false by default
        isCancelled: false // Determines if the reservation has been cancelled, because it has just been created, it is set to false by default
    }
    reservations[clientNumber] = tempObj;
    setTimeout(() => reservations[clientNumber][dateTime].isOver = true, new Date(dateTime) - new Date());
    return {
        obj: reservations,
        tempObj: tempObj,
        answer: "Reservation completed successfully!"
    }
}

module.exports = {
    AddReservation,
    AddUserReservation
}