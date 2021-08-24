import {CE} from  'trans-render/lib/CE.js';
import {HypoLinkProps, HypoLinkActions} from './types.js';

export class HypoLinkCore extends HTMLElement implements HypoLinkActions{

    processContent(self: this){
        const {rawContent, excludeEmails, excludeUrls, parseText} = self;
        return{
            processedContent: parseText(self, rawContent!, excludeEmails, excludeUrls),
        }
    }

    parseText(self: this, s: string, excludeEmails: boolean | undefined, excludeUrls: boolean | undefined){
        const {isUrl, isEmail} = self;
        const split = s.split(' ');
        split.forEach((token, idx) => {
            if(!excludeUrls && isUrl(self, token)){
                split[idx] = `<a href="//${token}" target=_blank>${token}</a>`;
            }else if(!excludeEmails && isEmail(self, token)){
                split[idx] = `<a href="mailto:${token}" target=_blank>${token}</a>`;
            }
        });
        return split.join(' ');
    }

    isUrl(self: this, s: string) {
        if (!rx_url.test(s)) return false;
        const sLC = s.toLowerCase();
        for (let i=0, ii = prefixes.length; i < ii; i++) if (sLC.startsWith(prefixes[i])) return true;
        for (let i=0, ii = domains.length; i < ii; i++) if (sLC.endsWith('.'+ domains[i]) || sLC.includes('.'+ domains[i]+'\/') ||sLC.includes('.'+ domains[i]+'?')) return true;
        return false;
    }

    isEmail(self: this, s: string) {
        return rx_email.test(s);
    }

}

//https://stackoverflow.com/a/42659038/3320028

// taken from https://gist.github.com/dperini/729294
const rx_url = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

// valid prefixes
const prefixes = ['http:\/\/', 'https:\/\/', 'ftp:\/\/', 'www.'];

// taken from https://w3techs.com/technologies/overview/top_level_domain/all
const domains = ['com','ru','net','org','de','jp','uk','br','pl','in','it','fr','au','info','nl','ir','cn','es','cz','kr','ua','ca','eu','biz','za','gr','co','ro','se','tw','mx','vn','tr','ch','hu','at','be','dk','tv','me','ar','no','us','sk','xyz','fi','id','cl','by','nz','il','ie','pt','kz','io','my','lt','hk','cc','sg','edu','pk','su','bg','th','top','lv','hr','pe','club','rs','ae','az','si','ph','pro','ng','tk','ee','asia','mobi'];


// taken from http://stackoverflow.com/a/16016476/460084
const sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
const sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
const sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
const sQuotedPair = '\\x5c[\\x00-\\x7f]';
const sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
const sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
const sDomain_ref = sAtom;
const sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
const sWord = '(' + sAtom + '|' + sQuotedString + ')';
const sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
const sLocalPart = sWord + '(\\x2e' + sWord + ')*';
const sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
const sValidEmail = '^' + sAddrSpec + '$'; // as whole string
const rx_email = new RegExp(sValidEmail);

export interface HypoLinkCore extends HypoLinkProps{}

const ce = new CE<HypoLinkProps, HypoLinkActions>();

ce.def({
    config:{
        tagName: 'hypo-link',
        actions:{
            processContent:{
                ifAllOf: ['rawContent'],
                actIfKeyIn: ['excludeEmails', 'excludeUrls']
            }
        }
    },
    superclass: HypoLinkCore
});
