/*
    This file contains every utility function we might need
*/

function CheckPhone(phone) {
    console.log("CheckPhone");
    if (phone.length === 11) {
        phone = [phone.slice(0, 1), "-", phone.slice(1, 4), "-", phone.slice(4, 7), "-", phone.slice(7)].join('');
    }
    else if (phone.length === 10) {
        phone = [phone.slice(0, 3), "-", phone.slice(3, 6), "-", phone.slice(6)].join('');
    }
    return phone;
}
// Used when creating a reservation, takes the value 'time' recieved and converts it into a number we can use when flitering through the reservation objects
function CheckTime(time) {
    console.log("CheckTime");
    let reservationTime = time.split(":"); // example "15:30:00" =>  [ 15, 30, 00 ]
    let hours = parseInt(reservationTime[0]); // example hours = 15
    let minutes = parseInt(reservationTime[1]); // example minutes = 30
    if (minutes < 30) { minutes = 0; } // Rounds down the minutes so that reservations are only made every half hour
    else if (minutes > 30) { minutes = 30; hours = hours + 1; } // example reservation => 15:00 or 15:30 and nothing else
    time = hours + ":" + minutes; // Converts the time into a value we can use later for our comparisons
    return time;
}
// Used when creating a reservation, takes the value 'time' recieved and converts it into a number we can use when flitering through the reservation objects
function CheckHourIn(time) {
    console.log("CheckHourIn");
    let reservationTime = time.split(":"); // example "15:30:00" =>  [ 15, 30, 00 ]
    let hours = parseInt(reservationTime[0]); // example hours = 15
    let minutes = parseInt(reservationTime[1]); // example minutes = 30
    if (minutes < 30) { minutes = 0; } // Rounds down the minutes so that reservations are only made every half hour
    else if (minutes > 30) { minutes = 30; } // example reservation => 15:00 or 15:30 and nothing else
    if (minutes === 30) { hours = hours + 0.5; } // Converts the time into a value we can use later for our comparisons
    return hours;
}
// Used when creating a reservation, takes the number of people expected to go and finds the numbers of seats needed to seat them all
function CheckSeats(nbPeople) {
    console.log("CheckSeats");
    switch (nbPeople) {
        case 0: return 0; // If nbPeople is 0, reservation is declined because you cannot make a reservation for 0 people
        case 1:
        case 2: return 2; // If nbPeople is 1 or 2, the reservation will take up a table that can seat 2 people
        case 3:
        case 4: return 4; // If nbPeople is 3 or 4, the reservation will take up a table that can seat 4 people
        case 5:
        case 6: return 6; // If nbPeople is 5 or 6, the reservation will take up a table that can seat 6 people
        case 7:
        case 8: return 8; // If nbPeople is 7 or 8, the reservation will take up a table that can seat 8 people
        default: return 10; // If the nbPeople is greater than 8, the client is invited to contact the restaurant directly to make the reservation
    }
}

function Confirmation(choice, nbItems, bool) {
    console.log("Confirmation");
    let option = "";
    let string = "\n";
    for (let i = 0; i < nbItems; i++) {
        let x = i + 1;
        if (bool) { option = "Number: " + x + "\n"; }
        string = string + "\n" +
            option +
            "Name : " + choice[i].name + "\n" +
            "City : " + choice[i].city + "\n" +
            "Address : " + choice[i].address + "\n" +
            "Phone : " + choice[i].phone + "\n";
    }
    return string;
}

function GetDate() {
    console.log("GetDate");
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1); // +1 because January is 0
    let day = (date.getDay() < 10 ? '0' : '') + date.getDay();
    date = year + '-' + month + '-' + day
    return date;
}

function GetTime() {
    console.log("GetTime");
    let time = new Date();
    let hours = (time.getHours() < 10 ? '0' : '') + time.getHours();
    let minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();
    let seconds = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds();
    time = hours + ":" + minutes + ":" + seconds;
    return time;
}

function GetDateTime() {
    console.log("GetDateTime");
    let date = GetDate();
    let time = GetTime();
    let dateTime = date + "/" + time;
    return dateTime;
}

module.exports = {
    CheckPhone,
    CheckTime,
    CheckHourIn,
    CheckSeats,
    Confirmation,
    GetDateTime,
    GetDate,
    GetTime
}