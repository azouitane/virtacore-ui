import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Template } from '../../models/Template';
import { TemplateSummary } from '../../models/TemplateSummary';

@Service()
export class TemplatesService {
    private readonly http = inject(HttpClient);


    private readonly url =
        `${environment.apiUrl}/templates`;



    // Get full templates
    getTemplates(): Observable<Template[]> {

        return this.http.get<Template[]>(
            this.url
        );

    }



    // Get templates for VM creation select
    getTemplateSummary(): Observable<TemplateSummary[]> {

        return this.http.get<TemplateSummary[]>(
            `${this.url}/summary`
        );

    }
}
