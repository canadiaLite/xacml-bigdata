const converter = require('./xml2js')
const moment = require('moment');
const fs = require('fs');


class PEP {
    readRequests() {
        //read each request from XML file, turn into JSON object, send json object to PDP
        //return bool
    }
}

class PDP {
    constructor(request = {}) {
        //process requestXml here
    }
    //for loop through all rules
        //pass in request + userinfo check for each rule
        //if all return true, return true, else return false
    getUserInfo(id) {
        return PIP.getUserInfo(id)
    }
    //rule1()
    //rule2()
    checkRule2(id) {
        return request.patientID == id && request.resourceType == "personalInfo";
    }
    //rule3()
    checkRule3() {
        let format = 'hh:mm:ss'

        let timeOfDay = moment(request.time, format);
        let beforeTime = moment('04:00:00', format);
        let afterTime = moment('02:00:00', format);

        return (timeOfDay.isBetween(beforeTime, afterTime)) && request.identity != "Tech";
    }
    //rule4()
    checkRule4() {
        return request.deviceType == "desktop" && request.ipAddress.startsWith("192.168");
    }
}

class PAP {
    constructor(policies = []) {
    }
    addPolicy(policy) {
        this.policies.push(policy)
    }
    getPolicies() {
        return this.policies
    }
}

class PIP {
    constructor(userDict = []) {
    }
    readUsers() {
        //reading each user info from xml, loop through folder
    }
    getUserInfo(id) {
        return this.userDict[id]
    }
    //docuDict
    //readDocs()
}

//test accessing parsed xml js object
const xml = fs.readFileSync('test.xml');
const parsed = converter.parseXml(xml);
console.log(parsed.breakfast_menu.food[0].name == "Belgian Waffles")
