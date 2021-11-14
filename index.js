const converter = require('./xml2js')
const moment = require('moment');
const fs = require('fs');
const { request } = require('http');


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
    getPolicies(){
        return PAP.getPolicies()
    }
}

class PAP {
    constructor(policies = []) {
        var patientPolicy = [this.checkRule1, this.checkRule2];
        var staffPolicy = [this.checkRule3, this.checkRule4];
        this.policies = [patientPolicy, staffPolicy];
    }
    addPolicy(policy) {
        this.policies.push(policy)
    }
    getPolicies() {
        return this.policies
    }
    //rule1()
    checkRule1() {
    return !(request.userType == "patient" && request.actionType == 'edit' && (request.resourceType == "imaging" || request.resourceType == "notes"));
    }
    //rule2()
    checkRule2(id) {
        return request.patientID == id && request.resourceType == "personalInfo" && request.actionType == 'edit';
    }
    //rule3()
    checkRule3() {
        let format = 'hh:mm:ss'

        let timeOfDay = moment(request.time, format);
        let beforeTime = moment('02:00:00', format);
        let afterTime = moment('04:00:00', format);

        return (timeOfDay.isBetween(beforeTime, afterTime)) && request.identity == "Tech";
    }
    //rule4()
    checkRule4() {
        return request.deviceType == "desktop" && request.ipAddress.startsWith("192.168");
    }
}

class PIP {
    constructor(userDict = []) {
        this.userDict = new Object();
        this.readUsers();
    }
    readUsers() {
        const userDir = "users/";
        const files = fs.readdirSync(userDir);
        for (const file of files) {
            var xmlt = fs.readFileSync(userDir+file);
            var parsedt = converter.parseXml(xmlt);
            let userAtt = new Object();
            for (let i=0; i< parsedt.User.Attributes.length; i++){
                userAtt[parsedt.User.Attributes[i].Category[0].split(":")[7]] = (parsedt.User.Attributes[i].Attribute[0].AttributeValue[0]._);
            }
            this.userDict[parsedt.User.id[0]] = userAtt;
        }
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

