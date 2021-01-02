import {define} from 'xtal-element/lib/define.js';
import {XtalPattern, xp} from 'xtal-element/lib/XtalPattern.js';
import {html} from 'xtal-element/lib/html.js';
import {Reactor} from 'xtal-element/lib/Reactor.js';
import {getPropDefs} from 'xtal-element/lib/getPropDefs.js';
import {hydrate} from 'xtal-element/lib/hydrate.js';
import {letThereBeProps} from 'xtal-element/lib/letThereBeProps.js';
import {doDOMKeyPEAction} from 'xtal-element/lib/doDOMKeyPEAction.js';
import {destructPropInfo, PropAction, PropDef} from 'xtal-element/types.d.js';
import {HypoLinkProps} from './types.d.js';
export const mainTemplate = html`
<slot style="display:none"></slot>
<div part=linkedText></div>
`;
const refs = {linkTextPart: ''};
const propActions = [
    xp.manageMainTemplate,
    xp.createShadow,
] as PropAction[];
const propDefGetter = [

] as destructPropInfo[];
const propDefs = getPropDefs(propDefGetter);
export class HypoLink extends HTMLElement implements XtalPattern{
    static is = 'hypo-link';
    reactor = new Reactor(this, [
        {
            type:Array,
            do: doDOMKeyPEAction
        }
    ]);
    clonedTemplate: DocumentFragment | undefined;
    domCache: any;
    connectedCallback(){
        hydrate<HypoLinkProps>(this, propDefs, {

        });
    }
    onPropChange(name: string, prop: PropDef, nv: any){
        this.reactor.addToQueue(prop, nv);
    }
    self = this;
    refs = refs;
    mainTemplate = mainTemplate;
    propActions = propActions;
}
letThereBeProps(HypoLink, propDefs, 'onPropChange');
define(HypoLink);