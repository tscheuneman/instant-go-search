export class GoSearchClient {

    clientUrl: string;
    constructor(url: string) {
        this.clientUrl = url;
    }

    async search(query: string|undefined, param2: any) {
        console.log('query', query);
        console.log('pararm2', param2);
        const searchParams = new URLSearchParams();

        searchParams.append('q', query || '');

        for(const param in param2) {
            searchParams.append(param, param2[param]);
            console.log(param);
        }
        console.log(searchParams.toString());
    }
}
