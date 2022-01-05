
const CONFIG = require('../../config');
/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
module.exports = {
    userService: require(`./userService`),
    authService: require(`./authService`),
    fileUploadService: require(`./fileUploadService`)
};