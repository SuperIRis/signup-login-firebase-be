const validateEmail = (email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateName = (name)=>{
    return name.length > 3 && name.length < 30;
}

const validateUsername = (username) => {
    const re = /^(?=[a-z_\d]*[a-z])[a-z_\d]{6,25}$/;
    return re.test(String(username));
};

module.exports.validateEmail = validateEmail;
module.exports.validateName = validateName;
module.exports.validateUsername = validateUsername;