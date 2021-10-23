class PEP {
    readRequests() {
        //read each request from XML file, turn into JSON object, send json object to PDP
        //return bool
    }
}

class PDP {
    //for loop through all rules
        //pass in request + userinfo check for each rule
        //if all return true, return true, else return false
    getUserInfo(id) {
        return PIP.getUserInfo(id)
    }
    //rule1()
    //rule2()
    //rule3()
    //rule4()
}

class PAP {
    policies = []
    addPolicy(policy) {
        this.policies.push(policy)
    }
    getPolicies() {
        return this.policies
    }
}

class PIP {
    userDict = []
    readUsers() {
        //reading each user info from xml, loop through folder
    }
    getUserInfo(id) {
        return this.userDict[id]
    }
    //docuDict
    //readDocs()
}
