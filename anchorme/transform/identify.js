import emailChecker from "../tests/email.js";
import hasProtocol from "../tests/hasprotocol.js";
import { htmlAttrs } from "../lists.js";
import ipChecker from "../tests/ip.js";
import urlChecker from "../tests/url.js";
export default function (inputArr, options) {
    return inputArr.map((fragment, index) => {
        var encoded = encodeURI(fragment);
        // quick validations
        // 1
        if (encoded.indexOf(".") < 1 && (!hasProtocol(encoded)))
            return fragment;
        var urlObj = null;
        var protocol = hasProtocol(encoded) || "";
        // remove the protocol before proceeding to any other test
        if (protocol)
            encoded = encoded.substr(protocol.length);
        // test 1: it's a file
        if (options.files && protocol === "file:///" && encoded.split(/\/|\\/).length - 1) {
            urlObj = {
                reason: "file",
                protocol: protocol,
                raw: fragment,
                encoded: encoded,
            };
        }
        // test 2: it's a URL
        if ((!urlObj) && options.urls && urlChecker(encoded)) {
            urlObj = {
                reason: "url",
                protocol: protocol ? protocol : typeof options.defaultProtocol === "function" ? options.defaultProtocol(fragment) : options.defaultProtocol,
                raw: fragment,
                encoded: encoded,
            };
        }
        // test 3: it's an email
        if ((!urlObj) && options.emails && emailChecker(encoded)) {
            urlObj = {
                reason: "email",
                protocol: "mailto:",
                raw: fragment,
                encoded: encoded,
            };
        }
        // test 4: it's an IP
        if ((!urlObj) && options.ips && ipChecker(encoded)) {
            urlObj = {
                reason: "ip",
                protocol: protocol ? protocol : typeof options.defaultProtocol === "function" ? options.defaultProtocol(fragment) : options.defaultProtocol,
                raw: fragment,
                encoded: encoded,
            };
        }
        if (!urlObj)
            return fragment;
        else {
            if ((inputArr[index - 1] === "'" || inputArr[index - 1] === '"') && ~htmlAttrs.indexOf(inputArr[index - 2]))
                return fragment;
            return urlObj;
        }
    });
}
