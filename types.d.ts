export interface HypoLinkProps extends Partial<HTMLElement>{
    /**
     * Exclude email links.
     * @attr 'exclude-emails'
     */
    excludeEmails?: boolean | undefined;

    /**
     * Exclude url links.
     * @attr exclude-urls
     */
    excludeUrls?: boolean | undefined;

    /**
     * String to hyperlink.  Gets set from innerText initially.
     * @attr raw-content
     */
    rawContent?: string | undefined;

    processedContent?: string | undefined;
}