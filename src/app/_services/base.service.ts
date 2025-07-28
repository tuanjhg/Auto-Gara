import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable()
export class BaseService {
    constructor(
        protected httpClient: HttpClient,
        protected baseUrl: string = environment.apiUrl,
        protected endPoint: string,
    ) {

    }

    
}
