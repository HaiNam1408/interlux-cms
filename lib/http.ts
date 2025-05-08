import httpClient, { HttpError } from './httpClient';

export { HttpError };

export class ClientAuth {
    private _token = "";

    get token() {
        return this._token;
    }

    set token(newToken: string) {
        if (typeof window === "undefined") {
            throw new Error("Cannot set token on server side");
        }
        this._token = newToken;
        localStorage.setItem('token', newToken);
    }
}

export const clientAuth = new ClientAuth();
export default httpClient;