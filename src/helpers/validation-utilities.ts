
//const nameMaxLength = 25; // adjust this value to the maximum length of the name

// export const userExists = (id: any): void => {
//     const user = User.findOne({ where: { id: id } });
//     if (!user) {
//         return res.status(404).json(
//             { 
//                 success: false,
//                 message: "No user exists with that id"
//             }
//         );
//     }
//     req.user = user;
//     next();
// };

const nameMaxLength = process.env.NAME_MAX_LENGTH ? parseInt(process.env.NAME_MAX_LENGTH) : 25; // convert to number and provide default value
export const isValidUserName = (name: any): boolean => {
    if(typeof name !== "string"){
        return false;
    }
    if(name == null || name.length > nameMaxLength || /[^ \p{L}]/gu.test(name)){ // consider spaces validation if surname is added
        return false;
    }
    return true;
};

//const surnameMaxLength = 50; // adjust this value to the maximum length of the surname
const surnameMaxLength = process.env.SURNAME_MAX_LENGTH ? parseInt(process.env.SURNAME_MAX_LENGTH) : 50; // convert to number and provide default value
export const isValidUserSurname = (surname: any): boolean => {
    if(typeof surname !== "string"){
        return false;
    }
    if(surname == null || surname.length > surnameMaxLength || /[^ \p{L}]/gu.test(surname)){ // consider spaces validation if surname is added
        return false;
    }
    return true;
};

//const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // considering adding a domain validation
const emailRegex = process.env.EMAIL_REGEX ? new RegExp(process.env.EMAIL_REGEX) : /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // convert to regex and provide default value
export const isValidEmail = (email: any): boolean => {
    if(typeof email !== "string"){
        return false;
    }
    if(email == null || email.length > 100 || !emailRegex.test(email)){
        return false;
    }
    return true;
};

// Password must contain at least one lowercase letter, one uppercase letter, one digit, and be 8-14 characters long inclusive
export const isValidPasswordFormat = (password: any): boolean => {
    if(typeof password !== "string"){
        return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
    if(password == null || password.length < 8 || password.length > 14 || !passwordRegex.test(password)){
        return false;
    }
    return true;
};

export const validateCatalogueEntryName = (name: any): boolean => {
    if(typeof name !== "string"){
        return false;
    }
    if(name == null || name.length > 250 || name.trim() === ""){
        return false;
    }
    return true;
};

export const validateCatalogueEntryDescription = (description: any): boolean => {
    if(typeof description !== "string"){
        return false;
    }
    if(description == null || description.length > 2000){
        return false;
    }
    return true;
};

export const validateId = (id: any): boolean => {
    if(typeof id !== "number" || id < 1){
        return false;
    }
    return true;
};

export const validatePrice = (price: any): boolean => {
    if(typeof price !== "number" || price < 0){
        return false;
    }
    return true;
};

const imageUrlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\.(jpg|png|jpeg)$/;

export const validateImageUrl = (url: any): boolean => {
    if(typeof url !== "string"){
        return false;
    }
    if(url == null || url.length > 250 || !imageUrlRegex.test(url)){
        return false;
    }
    return true;
}

export const isValidDate = (date: any): boolean => {
    const parsedDate = new Date(date.toString());
    return !isNaN(parsedDate.getTime());
}

export const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}