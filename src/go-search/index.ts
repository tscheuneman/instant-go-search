
const ALLOWED_PASSTHROUGH_PARAMS = ['limit'];

export class GoSearchClient {

    clientUrl: string;
    constructor(url: string) {
        this.clientUrl = url;
    }

    async search(query: string|undefined, searchReqParams: any) {
        const searchParams = new URLSearchParams();
        const filterMapping: Record<string, string[]> = {};

        searchParams.append('q', query || '');

        for(const param in searchReqParams) {
            const paramValue = searchReqParams[param];
            if(ALLOWED_PASSTHROUGH_PARAMS.includes(param)) {
                searchParams.append(param, paramValue);
            }

            if(param === 'filter') {
                if(Array.isArray(paramValue)) {
                    paramValue.forEach(filterValue => {
                        if(Array.isArray(filterValue)) {
                            filterValue.forEach(facetFilter => {
                                const [key, value] = facetFilter.split('=');
                                const normalizedVal = this.parseFilterValue(value);
                                if(filterMapping[key]) {
                                    filterMapping[key].push(normalizedVal);
                                } else {
                                    filterMapping[key] = [normalizedVal]
                                }
                            });
                        }
                    });
                }
                this.constructFacetQueryString(filterMapping, searchParams);
            }
        }

        const searchUrl = `${this.clientUrl}?${searchParams.toString()}`;

        const searchResult = await fetch(searchUrl, {});

        const resultJson = await searchResult.json();
        return resultJson;
    }

    private parseFilterValue = (value: string): string => {
        let returnString = value;
        if (returnString.startsWith('"')) {
            returnString = returnString.substring(1);
        }
        if(returnString.endsWith('"')) {
            returnString = returnString.slice(0, -1)
        }

        return returnString;
    }

    private constructFacetQueryString = (facets: Record<string, string[]>, urlSearchParams: URLSearchParams): void => {
        Object.keys(facets).forEach(key => {
            const facetsInKey = facets[key];
            if(Array.isArray(facetsInKey)) {
                urlSearchParams.append(key, facetsInKey.join(','));
            }
        });

        urlSearchParams.toString();
    }
}
