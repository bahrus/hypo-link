import {XtalElement, define, AttributeProps, TransformValueOptions, SelectiveUpdate, RenderContext, Plugins} from 'xtal-element/XtalElement.js';
import {createTemplate} from 'trans-render/createTemplate.js';
//import {unsafeHTMLSym, plugin} from 'trans-render/plugins/unsafeHTML';
let futureUnsafeHTMLSym: Symbol;
//const raw_content = 'raw-content';
//https://stackoverflow.com/a/42659038/3320028

// taken from https://gist.github.com/dperini/729294
const rx_url = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;

// valid prefixes
const prefixes = ['http:\/\/', 'https:\/\/', 'ftp:\/\/', 'www.'];

// taken from https://w3techs.com/technologies/overview/top_level_domain/all
const domains = ['com','ru','net','org','de','jp','uk','br','pl','in','it','fr','au','info','nl','ir','cn','es','cz','kr','ua','ca','eu','biz','za','gr','co','ro','se','tw','mx','vn','tr','ch','hu','at','be','dk','tv','me','ar','no','us','sk','xyz','fi','id','cl','by','nz','il','ie','pt','kz','io','my','lt','hk','cc','sg','edu','pk','su','bg','th','top','lv','hr','pe','club','rs','ae','az','si','ph','pro','ng','tk','ee','asia','mobi'];

export function isUrl(s: string) {
    if (!rx_url.test(s)) return false;
    const sLC = s.toLowerCase();
    for (let i=0, ii = prefixes.length; i < ii; i++) if (sLC.startsWith(prefixes[i])) return true;
    for (let i=0, ii = domains.length; i < ii; i++) if (sLC.endsWith('.'+ domains[i]) || sLC.includes('.'+ domains[i]+'\/') ||sLC.includes('.'+ domains[i]+'?')) return true;
    return false;
}

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

export function isEmail(s: string) {
    return rx_email.test(s);
}

export function parseText(s: string, excludeEmails: boolean | undefined, excludeUrls: boolean | undefined){
    const split = s.split(' ');
    split.forEach((token, idx) => {
        if(!excludeUrls && isUrl(token)){
            split[idx] = `<a href="//${token}" target=_blank>${token}</a>`;
        }else if(!excludeEmails && isEmail(token)){
            split[idx] = `<a href="mailto:${token}" target=_blank>${token}</a>`;
        }
    });
    return split.join(' ');
}

export const mainTemplate = createTemplate(/* html */`
<slot style="display:none"></slot>
<div part=linkedText></div>
`);

const linkedText = Symbol('linkedText');
export const initTransform = ({self}: HypoLink) => ({
    slot:[{},{slotchange: self.handleSlotChange}],
    div: linkedText,
} as TransformValueOptions);

// export const updateTransforms = [
//     ({processedContent}: HypoLink) => ({
//         [linkedText]: ({target}: RenderContext<HTMLDivElement) => {
//             target!.innerHTML = processedContent!;
//         }
//     })
// ] as SelectiveUpdate<any>[];

export const updateTransforms = [
    ({processedContent}: HypoLink) => ({
        [linkedText]: [futureUnsafeHTMLSym, processedContent]
    })
] as SelectiveUpdate<any>[];

const linkProcessedContent = ({rawContent, self, excludeEmails, excludeUrls}: HypoLink) => {
    if(rawContent === undefined) return;
    self.processedContent = parseText(rawContent, excludeEmails, excludeUrls);
}

export const propActions = [linkProcessedContent];

/**
 * @element hypo-link
 * 
 */
export class HypoLink extends XtalElement{
    static is = 'hypo-link';
    static attributeProps = ({excludeEmails, excludeUrls, rawContent, processedContent}: HypoLink) => ({
        bool:[excludeEmails, excludeUrls],
        reflect: [ excludeEmails, excludeUrls],
        str: [rawContent, processedContent]
    } as AttributeProps);

    mainTemplate = mainTemplate;
    readyToInit = true;
    readyToRender = true;
    initTransform = initTransform;
    updateTransforms = updateTransforms;
    propActions = propActions;
    async plugins(): Promise<Plugins>{
        const {unsafeHTMLSym, plugin} = await import('trans-render/plugins/unsafeHTML.js');
        futureUnsafeHTMLSym = unsafeHTMLSym;
        const standardPlugins = await super.plugins();
        Object.assign(standardPlugins, {
            [unsafeHTMLSym]: plugin
        });
        return standardPlugins;
    }

    handleSlotChange(e: Event){
        const slot = e.target as HTMLSlotElement;
        const nodes = slot.assignedNodes();
        let text = '';
        nodes.forEach(node => {
            //const aNode = node as any;
            switch(node.nodeType){
                case 1:
                    const eNode = node as HTMLElement;
                    text += eNode.innerText;
                    break;
                case 3:
                    text += node.nodeValue;
                    break;
            }
        });
        this.rawContent = text;
    }


    /**
     * Exclude email links.
     * @attr 'exclude-emails'
     */
    excludeEmails: boolean | undefined;

    /**
     * Exclude url links.
     * @attr exclude-urls
     */
    excludeUrls: boolean | undefined;


    /**
     * String to hyperlink.  Gets set from innerText initially.
     * @attr raw-content
     */
    rawContent: string | undefined;


    processedContent: string | undefined;

    
}

define(HypoLink);