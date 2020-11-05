import { HypoLink, initTransform, mainTemplate, updateTransforms, propActions } from './hypo-link.js';
import { define } from 'xtal-element/XtalElement.js';
/**
 * @element hypo-link
 * @path hypo-link.js
 */
export class HypoLinkExample0 extends HypoLink {
    constructor() {
        super(...arguments);
        /**
         * One way to set the raw text for the component.
         * The other is via the innerText of the hypo-link element.
         */
        this.rawContent = ``;
        /**
         * @private
         */
        this.processedContent = '';
        /**
         * @private
         */
        this.mainTemplate = mainTemplate;
        /**
         * @private
         */
        this.initTransform = initTransform;
        /**
         * @private
         */
        this.updateTransforms = updateTransforms;
        /**
         * @private
         */
        this.propActions = propActions;
        /**
         * @private
         */
        this.readyToInit = true;
        /**
         * @private
         */
        this.readyToRender = true;
        /**
         * @private
         */
        this.attributeProps = HypoLink.attributeProps;
    }
}
/**
 * @private
 */
HypoLinkExample0.is = 'hypo-link-example-0';
define(HypoLinkExample0);
