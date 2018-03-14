/*
    This page manages everything related to displaying the reservations on screen
*/

const utilities = require("./utility.js");

// Displays the restaurants reservations when they select a date and a time
function DisplayRestoReservations(info, reservations) {
    console.log("DisplayRestoReservations");
    let dateTime = info.date + "/" + info.time; // Gets us the dateTime key
    let arr1 = Object.keys(reservations).filter(clientNumber => // We filter through if there are any reservation on the requested date and time
        reservations[clientNumber][dateTime]);
    let arr = arr1.filter(clientNumber => // If there are, then it looks through all of the reservations that meet the requirements
        reservations[clientNumber][dateTime].restoNumber === info.restoPhone &&
        reservations[clientNumber][dateTime].isCancelled === false);
    let obj = arr.map((x, i) => reservations[x][dateTime]); // Puts every object found in a neat package for the frontend
    console.log(info);
    console.log(dateTime);
    console.log(arr1);
    console.log(arr);
    console.log(obj);
    return obj;
}
// Displays a clients reservation once they ask RestoBot to display all reservations
function DisplayClientReservations(info, reservations) {
    console.log("DisplayClientReservations");
    let clientNumber = info.originalRequest.data.From.slice(1); // The clients phone number, used to search the clients reservations
    let clientReservations = reservations[clientNumber]; // The clients reservations
    let arr = Object.keys(clientReservations).filter(dateTime => // RestoBot will only display the reservations that are still valid
        clientReservations[dateTime].isOver === false &&
        clientReservations[dateTime].isCancelled === false);
    if (arr.length === 0) { return "You do not have any reservations!"; } // Returns this is there are no reservations
    let string = "\n"; // Variable declared here
    for (let i = 0; i < arr.length; i++) { // Lets RestoBot display the clients reservations in a neat message
        let dateTime = arr[i]; // Only the essential information will be shown
        string = string + "\n" +
            "Restaurant : " + clientReservations[dateTime].restaurant + "\n" +
            "Phone : " + clientReservations[dateTime].restoNumber + "\n" +
            "City : " + clientReservations[dateTime].city + "\n" +
            "Address : " + clientReservations[dateTime].address + "\n" +
            "Date : " + clientReservations[dateTime].date + "\n" +
            "Time : " + clientReservations[dateTime].time + "\n";
    }
    return string;
}

module.exports = {
    DisplayRestoReservations,
    DisplayClientReservations
}