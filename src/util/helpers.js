const isArrayNotEmpty = array => (array !== null && Array.isArray(array) && array.length > 0);

const isNotNullOrEmptyString = word => (word !== null && word !== undefined && word.length > 0);

const getAge = (birthDate) => (Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10));


const isNotNullAndUndefined = (value) => {
    return  value !== undefined && value !== null
}

const deepCopyFunction = inObject => {
    let outObject, value, key;

    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};

    for (key in inObject) {
        value = inObject[key];

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value;
    }

    return outObject;
};

const stringTONumber = (value) => {
    if (value) {
        return (typeof value === "string") ? Number(value) : value;
    } else {
        return 0;
    }
};

const captializedString = (value) => {
    if (value) {
        let capString = value.charAt(0).toUpperCase() + value.slice(1);
        // let capString= value.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        return capString;
    }
};

const teamListData = (value) => {
    if (value == 1) {
        return false;
    } else {
        return true;
    }
};

const regexNumberExpression = (number) => {
    if (number) {
        return number.replace(/[^\d]/g, '');
    }
};

const isImageFormatValid = value => {
    let fileTypes = ['jpg', 'jpeg', 'png'];
    return (fileTypes.indexOf(value) > -1);
};

module.exports = {
    isArrayNotEmpty,
    isNotNullOrEmptyString,
    getAge,
    deepCopyFunction,
    stringTONumber,
    captializedString,
    teamListData,
    regexNumberExpression,
    isImageFormatValid,
    isNotNullAndUndefined
};
