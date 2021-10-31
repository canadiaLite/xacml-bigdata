const xml2js = require('xml2js');

module.exports = {
    parseXml: function (xmlPath) {
        let ret;
        xml2js.parseString(xmlPath, { mergeAttrs: true }, (err, jsobj) => {
            if (err) {
                throw err;
            }
            ret = jsobj;
        });
        return ret;
    }
};