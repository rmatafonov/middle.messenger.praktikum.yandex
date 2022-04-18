import { queryStringify } from '../../utils';

const Methods = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
};

type Options = {
    includeCredentials?: boolean,
    headers?: Record<string, string>,
    method?: string,
    timeout?: number,
    data?: Record<string, unknown>
}

export default class HTTPTransport {
    private static instance: HTTPTransport

    static getInstance() {
        if (!this.instance) {
            this.instance = new HTTPTransport('https://ya-praktikum.tech/api/v2/')
        }
        return this.instance
    }

    private baseURL: string

    private constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    get = (path: string, options: Options = {}) => {
        return this.request(path, { ...options, method: Methods.GET }, options.timeout);
    };

    post = (path: string, options: Options = {}) => {
        return this.request(path, { ...options, method: Methods.POST }, options.timeout);
    };

    put = (path: string, options: Options = {}) => {
        return this.request(path, { ...options, method: Methods.PUT }, options.timeout);
    };

    delete = (path: string, options: Options = {}) => {
        return this.request(path, { ...options, method: Methods.DELETE }, options.timeout);
    };

    request = (path: string, options: Options = {}, timeout = 5000): Promise<XMLHttpRequest> => {
        const { headers = {}, includeCredentials = true, method, data } = options;
        const url = this.baseURL + path

        return new Promise(function (resolve, reject) {
            if (!method) {
                reject('No method');
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === Methods.GET;

            xhr.open(
                method,
                isGet && !!data
                    ? `${url}${queryStringify(data)}`
                    : url,
            );
            xhr.withCredentials = includeCredentials

            Object.keys(headers).forEach(key => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.timeout = timeout;
            xhr.ontimeout = reject;

            if (isGet || !data) {
                xhr.send();
            } else {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                xhr.send(blob);
            }
        });
    };
}
