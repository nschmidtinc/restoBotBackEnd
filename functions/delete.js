/*
    This page manages everything related to deleting reservations
*/

const utilities = require("./utility.js");

// Simply takes the date, the time and the phone number of the restaurant in order to delete all of it's reservations at that specific date and time
function CancelAllReservations(info, reservations) {
    console.log("CancelAllReservations");
    let dateTime = info.date + "/" + info.time;
    let arr = Object.keys(reservations).filter(clientNumber =>
        reservations[clientNumber][dateTime].restoNumber === info.phoneNumber &&
        reservations[clientNumber][dateTime].isCancelled === false &&
        reservations[clientNumber][dateTime].isOver === false);
    if (arr.length === 0) { return { validation: false, answer: "There is nothing to cancel!" } }
    else {
        arr.map((x, i) => reservations[x][dateTime].isCancelled = true);
        return { validation: true, answer: "It worked", obj: reservations };
    }
}

function CancelRestoReservations(info, reservations) {
    console.log("CancelRestoReservations");
    let dateTime = info.date + "/" + info.time;
    let clientNumber = info.clientNumber;
    reservations[clientNumber][dateTime].isCancelled = true;
    return { answer: "Reservations deleted.", obj: reservations }
}

function CancelClientReservations(info, reservations) {
    console.log("CancelClientReservations");
    let clientNumber = info.originalRequest.data.From.slice(1); // The clients phone number, used to search the clients reservations
    let parameters = info.result.parameters; // This is where all the information needed to make a reservation is being kept
    let date = parameters.date; // Needed for when we are going to find the number of available spots
    let time = parameters.time.slice(0, -3); // Needed to figure out when the reservation will take place, would usually display HH:MM:SS, now simply displays HH:MM
    let dateTime = date + "/" + time; // Needed to make sure a client does not make two reservations at the same time
    if (reservations[clientNumber][dateTime]) {
        reservations[clientNumber][dateTime].isCancelled = true;
        return { validation: true, answer: "Reservation deleted!", obj: reservations }
    }
    return { validation: false, answer: "Sorry, I could not delete your reservation." }
}

module.exports = {
    CancelRestoReservations,
    CancelAllReservations,
    CancelClientReservations
}