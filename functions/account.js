/*
    This is the page that manages everything related to the restaurants user accounts
*/

// Verifies if the username is taken or not
// signupInfo => information of the account
// accountInfo => passwords object
function ValidateRegistration(info, obj) {
    console.log("ValidateRegistration");
    if (!obj[info.username]) {
        obj[info.username] = info.password;
        return { validation: true, obj: obj };
    }
    else { return { validation: false, answer: "This username has already been taken!" } }
}

// Verifies if the username and password are valid during user login
function ValidateLogIn(info, passwords, restaurants) {
    console.log("ValidateLogIn");
    if (passwords[info.username] === info.password) {
        let arr = Object.keys(restaurants).filter(ID =>
            restaurants[ID].Username === info.username);
        return { validation: true, answer: "Login successful!", obj: restaurants[arr[0]] }
    } // Verifies if the password is correct 
    else { return { validation: false, answer: "Your username or password are incorrect!" } } // If the password if incorrect, the login request fails
}

module.exports = {
    ValidateRegistration,
    ValidateLogIn
}