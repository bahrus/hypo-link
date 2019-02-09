import { defaultOptions as defaultOptions } from "./util";
import emailChecker from "./tests/email.js";
import ipChecker from "./tests/ip.js";
import urlChecker from "./tests/url.js";
import transform from "./transform/transform";
import hasprotocol from "./tests/hasprotocol.js";
export const anchorme = function (str, options) {
    options = defaultOptions(options);
    var result = transform(str, options);
    return result;
};
// exposing few functions for extra uses
anchorme.validate = {
    ip: ipChecker,
    url: function (input) {
        // simple wrapper that does what "identify.ts" does initially
        // remove the protocol
        var protocol = hasprotocol(input) || "";
        input = input.substr(protocol.length);
        input = encodeURI(input);
        return urlChecker(input);
    },
    email: emailChecker
};
