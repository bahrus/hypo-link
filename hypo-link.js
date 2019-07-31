import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'trans-render/define.js';
import { hydrate } from 'trans-render/hydrate.js';
import { anchorme } from './anchorme/index.js';
const raw_content = 'raw-content';
const re = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const truncate = 'truncate';
const default_protocol = 'default-protocol';
const exclude_emails = 'exclude-emails';
const exclude_urls = 'exclude-urls';
const exclude_ips = 'exclude-ips';
const exclude_files = 'exclude-files';
export class HypoLink extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        this._options = {
            attributes: [
                {
                    name: 'target',
                    value: '_blank'
                }
            ]
        };
    }
    static get is() { return 'hypo-link'; }
    static get observedAttributes() {
        return super.observedAttributes.concat([raw_content, truncate, default_protocol, exclude_emails, exclude_urls, exclude_ips, exclude_files]);
    }
    attributeChangedCallback(name, ov, nv) {
        switch (name) {
            case raw_content:
                this._rawContent = nv;
                break;
            case truncate:
                this._truncate = JSON.parse(nv);
                this._options.truncate = this._truncate;
                break;
            case default_protocol:
                this._defaultProtocol = nv;
                this._options.defaultProtocol = nv;
                break;
            case exclude_emails:
                this._excludeEmails = nv !== null;
                this._options.emails = !this._excludeEmails;
                break;
            case exclude_urls:
                this._excludeUrls = nv !== null;
                this._options.urls = !this._excludeUrls;
                break;
            case exclude_ips:
                this._excludeIps = nv !== null;
                this._options.ips = !this._excludeIps;
                break;
            case exclude_files:
                this._excludeFiles = nv !== null;
                this._options.files = !this._excludeFiles;
                break;
        }
        this.onPropsChange();
    }
    get excludeEmails() { return this._excludeEmails; }
    set excludeEmails(nv) {
        this.attr(exclude_emails, nv, '');
    }
    get excludeUrls() { return this._excludeUrls; }
    set excludeUrls(nv) {
        this.attr(exclude_urls, nv, '');
    }
    get excludeIps() { return this._excludeIps; }
    set excludeIps(nv) {
        this.attr(exclude_ips, nv, '');
    }
    get excludeFiles() { return this._excludeFiles; }
    set excludeFiles(nv) {
        this.attr(exclude_files, nv, '');
    }
    get rawContent() {
        return this._rawContent;
    }
    set rawContent(val) {
        this.attr(raw_content, val);
    }
    get truncate() {
        return this._truncate;
    }
    set truncate(nv) {
        //this._truncate = nv;
        this.attr(truncate, JSON.stringify(nv));
    }
    get linkAttributes() {
        return this._linkAttributes;
    }
    set linkAttributes(nv) {
        this._linkAttributes = nv;
        this._options.attributes = nv;
        this.onPropsChange();
    }
    get exclude() { return this._exclude; }
    set exclude(nv) {
        this._exclude = nv;
        this._options.exclude = nv;
        this.onPropsChange();
    }
    get defaultProtocol() {
        return this._defaultProtocol;
    }
    set defaultProtocol(nv) {
        this.attr(default_protocol, nv);
    }
    connectedCallback() {
        this._c = true;
        this.propUp(['rawContent', truncate, 'linkAttributes', 'defaultProtocol', 'excludeEmails',
            'excludeUrls', 'excludeIps', 'excludeFiles']);
        this.onPropsChange();
    }
    onPropsChange() {
        if (!this._c)
            return;
        if (this._rawContent === undefined) {
            if (this.firstChild !== null) {
                this.rawContent = this.innerText;
            }
            else {
                return;
            }
        }
        this.innerHTML = (this._rawContent === null) ? '' : anchorme(this._rawContent, this._options);
    }
}
define(HypoLink);
