import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-random';

// Create new account if username doesn't already exist
export async function createAccount(username, password) {
    let result = await SecureStore.getItemAsync(username);
    if (result) {
        //username allready in use
        return false;
    } else {
        let rnd = await Random.getRandomBytesAsync(10);
        let rndString = rnd.toString();
        let uid = rndString.replace(/[,]/g, "");
        const creds = { username: username, password: password, uid: uid };
        let credsString = JSON.stringify(creds);
        await SecureStore.setItemAsync(username, credsString);
        return true;
    }
};
// Get user UID
export async function getUID(username) {
    let result = await SecureStore.getItemAsync(username);
    let parsed = JSON.parse(result);
    return parsed.uid;
};
// Change password
export async function changePassword(username, passwordNew, passwordCurrent) {
    let result = await SecureStore.getItemAsync(username);
    let parsed = JSON.parse(result)
    if (passwordCurrent == parsed.password) {
        parsed.password = passwordNew;
        let credsString = JSON.stringify(parsed);
        await SecureStore.setItemAsync(username, credsString);
        return true;
    } else {
        return false;
    }
};
// Sign in with existing account
export async function signIn(username, password) {
    let result = await SecureStore.getItemAsync(username);
    if (!result) {
        //account not found
        return false;
    } else {
        let x = JSON.parse(result);
        if (x.username == username && x.password == password) {
            return true;
        } else {
            //pass dont match
            return false;
        }
    }
};
// Check if user is logged in
export async function currentUser() {
    const key = 'currentUser';
    let result = await SecureStore.getItemAsync(key);
    let parsed = JSON.parse(result);
    if (parsed.value == 'yes') {
        return true;
    } else {
        return false;
    }
};
// Get logged in username
export async function currentUserName() {
    const key = 'currentUser';
    let result = await SecureStore.getItemAsync(key);
    let parsed = JSON.parse(result);
    return parsed.user;
};
// Set currently logged user
export async function setCurrentUser(user) {
    const key = 'currentUser';
    const value = { value: 'yes', user: user };
    let valueString = JSON.stringify(value);
    await SecureStore.setItemAsync(key, valueString);
};
// Clear currently logged user
export async function removeCurrentUser() {
    const key = 'currentUser';
    const value = { value: 'no', user: '' };
    let valueString = JSON.stringify(value);
    let x = await SecureStore.setItemAsync(key, valueString);
    if (x == null) {
        return true;
    } else {
        return false;
    }
};
// Set remember username on/off
export async function setUsualUser(param, user) {
    const key = 'rememberThisUser';
    if (param == true) {
        const value = { value: 'yes', user: user };
        let valueString = JSON.stringify(value);
        await SecureStore.setItemAsync(key, valueString);
    } else if (param == false) {
        const value = { value: 'no', user: '' };
        let valueString = JSON.stringify(value);
        await SecureStore.setItemAsync(key, valueString);
    }
};
// Is remember username on/off
export async function getUsualUser() {
    const key = 'rememberThisUser';
    let result = await SecureStore.getItemAsync(key);
    let parsed = JSON.parse(result);
    if (parsed.value == 'yes') {
        return parsed.user;
    } else {
        return false;
    }
};
// Set pincode on/off
export async function setPin(param, pin) {
    const key = 'pincode';
    if (param == true) {
        const value = { value: 'yes', pincode: pin };
        let valueString = JSON.stringify(value);
        await SecureStore.setItemAsync(key, valueString);
        return true;
    } else if (param == false) {
        const value = { value: 'no', pincode: '' };
        let valueString = JSON.stringify(value);
        await SecureStore.setItemAsync(key, valueString);
    }
};
//Is pincode on
export async function getPin() {
    const key = 'pincode';
    let result = await SecureStore.getItemAsync(key);
    let parsed = JSON.parse(result);
    if (parsed.value == 'yes') {
        return true;
    } else {
        return false;
    }
};
// Sign in with pin
export async function signInPin(pin) {
    const key = 'pincode';
    let result = await SecureStore.getItemAsync(key);
    let x = JSON.parse(result);
    if (x.pincode == pin) {
        return true;
    } else {
        return false;
    }
};
// Save new credentials
export async function addCredentials(uid, creds) {
    let oldList = await getCredentials(uid);
    if (oldList) {
        oldList.push(creds);
        let newList = JSON.stringify(oldList);
        await SecureStore.setItemAsync(uid, newList);
        return true;
    } else if (!oldList) {
        let credsInArray = [creds];
        let stringyfiedCreds = JSON.stringify(credsInArray);
        await SecureStore.setItemAsync(uid, stringyfiedCreds);
        return true;
    } else {
        return false;
    }
};
// Get users saved credentials
export async function getCredentials(uid) {
    let result = await SecureStore.getItemAsync(uid);
    if (result == '[]') {
        return false;
    } else {
        let parsed = JSON.parse(result);
        return parsed;
    }
};
// Upload JSON File to creds
export async function uploadJSON(uid, creds) {
    let oldList = await getCredentials(uid);
    if (oldList) {
        let parsOld = JSON.stringify(oldList)
        let noBrktOld = parsOld.replace(/[[\]]/g, "");
        let noBrktNew = creds.replace(/[[\]]/g, "");
        let full = noBrktOld + ',' + noBrktNew;
        let inBrackets = '[' + full + ']';
        await SecureStore.setItemAsync(uid, inBrackets);
        return true;
    } else if (!oldList) {
        await SecureStore.setItemAsync(uid, creds);
        return true;
    }

};
// Edit credential info
export async function editCredentials(uid, edits, index) {
    let list = await getCredentials(uid);
    list[index].password = edits.password;
    list[index].provider = edits.provider;
    list[index].user = edits.user;
    let edited = JSON.stringify(list);
    await SecureStore.setItemAsync(uid, edited);
    return true;
};
// Delete specific entry
export async function deleteCredentials(uid, index) {
    let list = await getCredentials(uid);
    list.splice(index, 1);
    let edited = JSON.stringify(list);
    await SecureStore.setItemAsync(uid, edited);
    return true;
};