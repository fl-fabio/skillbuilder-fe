import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Area } from '../models/choice-area.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AreaApiService {
  http = inject(HttpClient);
  areaUrl = 'http://82.165.174.28/api/data/areas';

  public getAreas(): Observable<Area[]> {
    let areas = this.http.get<Area[]>(this.areaUrl);
    console.log(areas);
    return areas;
  }
}