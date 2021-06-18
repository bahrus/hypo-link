import { HypoLink, initTransform, mainTemplate, updateTransforms, propActions } from './hypo-link.js';
import { define } from 'xtal-element/XtalElement.js';
/**
 * @element hypo-link
 * @path hypo-link.js
 */
export class HypoLinkExample0 extends HypoLink {
    /**
     * @private
     */
    static is = 'hypo-link-example-0';
    /**
     * One way to set the raw text for the component.
     * The other is via the innerText of the hypo-link element.
     */
    rawContent = ``;
    /**
     * @private
     */
    processedContent = '';
    /**
     * @private
     */
    mainTemplate = mainTemplate;
    /**
     * @private
     */
    initTransform = initTransform;
    /**
     * @private
     */
    updateTransforms = updateTransforms;
    /**
     * @private
     */
    propActions = propActions;
    /**
     * @private
     */
    readyToInit = true;
    /**
     * @private
     */
    readyToRender = true;
    /**
     * @private
     */
    attributeProps = HypoLink.attributeProps;
}
define(HypoLinkExample0);
