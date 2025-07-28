import { DataSession } from '@df_models/data-session.model';
import { Representative } from '@df_models/representative.model';

/* eslint-disable @typescript-eslint/member-ordering */
export class DataServiceBase {
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------
    get idUser(): string {
        return localStorage.getItem('iduser') ?? '';
    }

    set idUser(idUser: string) {
        localStorage.setItem('iduser', idUser);
    }

    get isadmin(): string {
        return localStorage.getItem('isadmin') ?? '';
    }

    set isadmin(isadmin: string) {
        localStorage.setItem('isadmin', isadmin);
    }

    get typeuser(): string {
        return localStorage.getItem('typeuser') ?? '';
    }

    set typeuser(typeuser: string) {
        localStorage.setItem('typeuser', typeuser);
    }

    get courrielUser(): string {
        return localStorage.getItem('courriel') ?? '';
    }

    set courrielUser(email: string) {
        localStorage.setItem('courriel', email);
    }

    get dataSession(): DataSession {
        return JSON.parse(localStorage.getItem('datasession')) ?? {};
    }

    /**
     * Map data session to always be object inside local storage
     */
    set dataSession(dataSession: DataSession | string) {
        if (typeof dataSession === 'string') {
            localStorage.setItem('datasession', dataSession);
        } else {
            localStorage.setItem('datasession', JSON.stringify(dataSession));
        }
    }

    get curLangue(): string {
        return localStorage.getItem('curlangue') ?? 'en';
    }

    set curLangue(lang: string) {
        localStorage.setItem('curlangue', lang);
    }

    get representative(): Representative {
        return JSON.parse(localStorage.getItem('representative')) ?? {};
    }

    set representative(representative: Representative) {
        localStorage.setItem('representative', JSON.stringify(representative));
    }

    generateRequestParams(): object {
        const salt = localStorage.getItem('salt');
        const iduser = localStorage.getItem('iduser');
        const idcie = (this.getDataSession('currentcie') == '' ? 0 : this.getDataSession('currentcie'));
        const idjobsite = this.getDataSession('currentjobsiteid');
        return { iduser, idcie, idjobsite, salt };
    }

    getDataSession(id: string): string | number {
        const datasession = !localStorage.hasOwnProperty('datasession') ? '' : JSON.parse(localStorage.getItem('datasession'));
        return !datasession.hasOwnProperty(id) ? '' : datasession[id];
    }

    decodeURIData(data: string): object {
        const parseStr = decodeURIComponent(
            Array.prototype.map.call(atob(data), c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
        return JSON.parse(parseStr);
    }

    checkTypeUser(types: Array<string>): boolean {
        const typeUser = this.typeuser;

        if (types.includes(typeUser)) {
            return true;
        }

        return false;
    }
}
