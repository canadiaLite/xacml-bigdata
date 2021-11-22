const converter = require('./xml2js')
const moment = require('moment');
const fs = require('fs');

let requestFileNames = ["request_1.xml", "request_2.xml", "request_3.xml"];

class PEP {
    readRequests(fileNames) {
        let results = []
        fileNames.forEach(fileName => {
            const xml = fs.readFileSync(fileName);
            const parsed = converter.parseXml(xml);

            let request = {
                resource: null,
                user_id: null,
                action_type: null,
                role: null,
                identity: null,
                ip_address: "192.168.0.1",
                device_type: "desktop",
                access_time: "15:00:00"
            }

            parsed.Request.Subject[0].Attribute.forEach(eachAttribute => {
               request[eachAttribute.AttributeId] = eachAttribute.AttributeValue[0]
            });
            let userInfo = new PIP().getUserInfo(request.user_id)
            request.identity = userInfo.identity
            request.role = userInfo.role

            request.resource = parsed.Request.Resource[0].Attribute[0].AttributeValue[0]

            request.action_type = parsed.Request.Action[0].Attribute[0].AttributeValue[0]

            request.access_time = moment(request.access_time, 'hh:mm:ss')
            let res = true;//call PDP
            results.push(request)
        });
        return results;
    }
}

class PDP {
    constructor(request) {
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
    constructor(policies = [], request) {
        var patientPolicy = [this.checkRule1, this.checkRule2];
        var staffPolicy = [this.checkRule3, this.checkRule4];
        this.policies = [patientPolicy, staffPolicy];
        this.request = request;
    }
    addPolicy(policy) {
        this.policies.push(policy)
    }
    getPolicies() {
        return this.policies
    }
    //rule1()
    checkRule1() {
        return !(this.request.role == "patient" && this.request.action_type == 'edit' && (this.request.resource == "imaging" || this.request.resource == "notes"));
    }
    //rule2()
    checkRule2(id) {
        return this.request.user_id == id && this.request.resource == "personal_info" && this.request.action_type == 'edit';
    }
    //rule3()
    checkRule3() {
        let format = 'hh:mm:ss'

        let timeOfDay = moment(this.request.access_time, format);
        let beforeTime = moment('02:00:00', format);
        let afterTime = moment('04:00:00', format);

        return (timeOfDay.isBetween(beforeTime, afterTime)) && this.request.identity == "Tech";
    }
    //rule4()
    checkRule4() {
        return this.request.device_type == "desktop" && this.request.ip_address.startsWith("192.168");
    }
}

class PIP {
    constructor(userDict = [], rscDict = []) {
        this.userDict = new Object();
        this.readUsers();
        this.rscDict = new Object();
        this.readResources();
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
    getUsers() {
        return this.userDict
    }
    readResources(){
        const rscDir = "resources/";
        const files = fs.readdirSync(rscDir);
        for (const file of files) {
            var xmlt = fs.readFileSync(rscDir+file);
            var parsedt = converter.parseXml(xmlt);
            let rscAtt = new Object();
            for (let i=0; i< parsedt.Resource.Attributes.length; i++){
                rscAtt[parsedt.Resource.Attributes[i].Category[0].split(":")[7]] = (parsedt.Resource.Attributes[i].Attribute[0].AttributeValue[0]._);
            }
            this.rscDict[parsedt.Resource.id[0]] = rscAtt;
        }
    }
    getResourceInfo(id){
        return this.rscDict[id]
    }
}

//test accessing parsed xml js object
const xml = fs.readFileSync('request_1.xml');
const parsed = converter.parseXml(xml);
console.log(parsed)

let pep = new PEP();
let requests = pep.readRequests(requestFileNames)
console.log(requests)

var test = new PIP();
console.log(test.getResourceInfo(1))
console.log(test.getUserInfo(1))
console.log(test.getUsers())
