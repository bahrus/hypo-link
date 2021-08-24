export interface HypoLinkProps{
    /**
     * Exclude email links.
     * @attr 'exclude-emails'
     */
    excludeEmails?: boolean;

    /**
     * Exclude url links.
     * @attr exclude-urls
     */
    excludeUrls?: boolean;

    /**
     * String to hyperlink.  Gets set from innerText initially.
     * @attr raw-content
     */
    rawContent?: string;

    processedContent?: string;
}

export interface HypoLinkActions{
    processContent(self: this): {processedContent: string}
}