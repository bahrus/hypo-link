import { define } from 'xtal-element/lib/define.js';
import { xp } from 'xtal-element/lib/XtalPattern.js';
import { html } from 'xtal-element/lib/html.js';
import { Reactor } from 'xtal-element/lib/Reactor.js';
import { getPropDefs } from 'xtal-element/lib/getPropDefs.js';
import { hydrate } from 'xtal-element/lib/hydrate.js';
import { letThereBeProps } from 'xtal-element/lib/letThereBeProps.js';
import { doDOMKeyPEAction } from 'xtal-element/lib/doDOMKeyPEAction.js';
export const mainTemplate = html `
<slot style="display:none"></slot>
<div part=linkedText></div>
`;
const refs = { linkTextPart: '' };
const propActions = [
    xp.manageMainTemplate,
    xp.createShadow,
];
const propDefGetter = [];
const propDefs = getPropDefs(propDefGetter);
export class HypoLink extends HTMLElement {
    constructor() {
        super(...arguments);
        this.reactor = new Reactor(this, [
            {
                type: Array,
                do: doDOMKeyPEAction
            }
        ]);
        this.self = this;
        this.refs = refs;
        this.mainTemplate = mainTemplate;
        this.propActions = propActions;
    }
    connectedCallback() {
        hydrate(this, propDefs, {});
    }
    onPropChange(name, prop, nv) {
        this.reactor.addToQueue(prop, nv);
    }
}
HypoLink.is = 'hypo-link';
letThereBeProps(HypoLink, propDefs, 'onPropChange');
define(HypoLink);
