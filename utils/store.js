const {LocalStorage} = require("node-localstorage")

var localStorage = new LocalStorage('./scratch');


exports.localStorage = localStorage
