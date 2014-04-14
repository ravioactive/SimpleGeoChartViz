/**
 * User: ravioactive
 * Date: 4/14/14
 * Time: 12:42 AM
 */
var continents = {
    "002":["Africa","015|011|017|014|018"],
    "150":["Europe","154|155|151|039"],
    "019":["Americas","021|029|013|005"],
    "142":["Asia","143|030|034|035|145"],
    "009":["Oceania","053|054|057|061"]
};

var subContinents = {
    "015":["Northern Africa","DZ|EG|EH|LY|MA|SD|TN"],
    "011":["Western Africa","BF|BJ|CI|CV|GH|GM|GN|GW|LR|ML|MR|NE|NG|SH|SL|SN|TG"],
    "017":["Middle Africa","AO|CD|ZR|CF|CG|CM|GA|GQ|ST|TD"],
    "014":["Eastern Africa","BI|DJ|ER|ET|KE|KM|MG|MU|MW|MZ|RE|RW|SC|SO|TZ|UG|YT|ZM|ZW"],
    "018":["Southern Africa","BW|LS|NA|SZ|ZA"],
    "154":["Northern Europe","GG|JE|AX|DK|EE|FI|FO|GB|IE|IM|IS|LT|LV|NO|SE|SJ"],
    "155":["Western Europe","AT|BE|CH|DE|DD|FR|FX|LI|LU|MC|NL"],
    "151":["Eastern Europe","BG|BY|CZ|HU|MD|PL|RO|RU|SU|SK|UA"],
    "039":["Southern Europe","AD|AL|BA|ES|GI|GR|HR|IT|ME|MK|MT|CS|RS|PT|SI|SM|VA|YU"],
    "021":["Northern America","BM|CA|GL|PM|US"],
    "029":["Caribbean","AG|AI|AN|AW|BB|BL|BS|CU|DM|DO|GD|GP|HT|JM|KN|KY|LC|MF|MQ|MS|PR|TC|TT|VC|VG|VI"],
    "013":["Central America","BZ|CR|GT|HN|MX|NI|PA|SV"],
    "005":["South America","AR|BO|BR|CL|CO|EC|FK|GF|GY|PE|PY|SR|UY|VE"],
    "143":["Central Asia","TM|TJ|KG|KZ|UZ"],
    "030":["Eastern Asia","CN|HK|JP|KP|KR|MN|MO|TW"],
    "034":["Southern Asia","AF|BD|BT|IN|IR|LK|MV|NP|PK"],
    "035":["South-Eastern Asia","BN|ID|KH|LA|MM|BU|MY|PH|SG|TH|TL|TP|VN"],
    "145":["Western Asia","AE|AM|AZ|BH|CY|GE|IL|IQ|JO|KW|LB|OM|PS|QA|SA|NT|SY|TR|YE|YD"],
    "053":["Australia and New Zealand","AU|NF|NZ"],
    "054":["Melanesia","FJ|NC|PG|SB|VU"],
    "057":["Micronesia","FM|GU|KI|MH|MP|NR|PW"],
    "061":["Polynesia","AS|CK|NU|PF|PN|TK|TO|TV|WF|WS"]
};

function getParentNameForCode(parentCode, parent) {
    if(parentCode==null || (parentCode.length==0)) {
        return null;
    } else {
        if(parentCode in parent) {
            return parent[parentCode][0];
        } else {
            return null;
        }
    }
}

function getParentCodeForChild(childCode, parent) {
    if(childCode==null || (childCode.length==0)) {
        return null;
    } else {
        var parentCode = null;
        for(var key in parent) {
            if(parent.hasOwnProperty(key)) {
                if(parent[key][1].indexOf(childCode) >= 0) {
                    parentCode = key;
                    break;
                }
            }
        }
        return parentCode;
    }
}