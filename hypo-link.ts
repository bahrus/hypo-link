import {XtallatX} from 'xtal-latx/xtal-latx.js';
import {define} from 'xtal-latx/define.js';
import {anchorme} from './anchorme/index.js';
const raw_content = 'raw-content';
const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export class HypoLink extends XtallatX(HTMLElement){
    static get is(){return 'hypo-link';}
    static get observedAttributes(){
        return super.observedAttributes.concat([raw_content]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            case raw_content:
                this._rawContent = newVal;
                break;            
        }
        this.onPropsChange();
    }

    _rawContent!: string;
    get rawContent() {
        return this._rawContent;
    }
    set rawContent(val) {
        this.attr(raw_content, val);
    }

    _c! : boolean;
    connectedCallback(){
        this._c = true;
        this._upgradeProperties(['rawContent']);
        this.onPropsChange();
    }

    onPropsChange() {
        if (!this._c) return;
        if(this._rawContent === undefined){
            if(this.firstChild !== null) {
                this.rawContent = this.innerText;
            }else{
                return;
            }
        }
        this.innerHTML = anchorme(this._rawContent);

    }
}

define(HypoLink);