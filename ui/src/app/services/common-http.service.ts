import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CommonHttpService {

  constructor() { }

  parseParams(rawParams?: any): HttpParams {
    let params = new HttpParams();
    if (rawParams) {
      Object.keys(rawParams).forEach(
        (key) => {
          params = params.set(key, rawParams[key]);
        }
      );
    }
    return params;
  }
}
