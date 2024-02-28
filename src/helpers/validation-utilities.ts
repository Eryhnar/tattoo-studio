
const nameMaxLength = 50; // adjust this value to the maximum length of the name
export const validateUserName = (name: string) => {
    if(name == null || name.length > nameMaxLength || /[^ \p{L}]/gu.test(name)){ // consider spaces validation if surname is added
        return false;
    }
    return true;
};

export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // considering adding a domain validation
    if(email == null || email.length > 100 || !emailRegex.test(email)){
        return false;
    }
    return true;
};

// Password must contain at least one lowercase letter, one uppercase letter, one digit, and be 8-14 characters long inclusive
export const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,14}$/;
    if(password == null || password.length < 8 || password.length > 14 || !passwordRegex.test(password)){
        return false;
    }
    return true;
};