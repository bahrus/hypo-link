import {defaultOptions as defaultOptions} from "./util.js";
import emailChecker from "./tests/email.js";
import ipChecker from "./tests/ip.js";
import urlChecker from "./tests/url.js";
import transform from "./transform/transform.js";
import hasprotocol from "./tests/hasprotocol.js";
import {Options} from "./util.js";
import {URLObj} from "./util.js";

export const anchorme:any = function(str:string,options?:Options):Array<URLObj>|string{
	options = defaultOptions(options);
	var result = transform(str, options);
	return result;
};

// exposing few functions for extra uses
anchorme.validate = {
	ip:ipChecker,
	url:function(input:string):boolean{
		// simple wrapper that does what "identify.ts" does initially
		// remove the protocol
		var protocol = hasprotocol(input) || "";
		input = input.substr(protocol.length);
		input = encodeURI(input);
		return urlChecker(input);
	},
	email:emailChecker
};
