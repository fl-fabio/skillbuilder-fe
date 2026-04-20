import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Area } from '../models/choice-area.models';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AreaApiService {
  http = inject(HttpClient);
  areaUrl = `${environment.apiBaseUrl}/data/areas`;

  public getAreas(): Observable<Area[]> {
    let areas = this.http.get<Area[]>(this.areaUrl);
    console.log(areas);
    return areas;
  }
}
