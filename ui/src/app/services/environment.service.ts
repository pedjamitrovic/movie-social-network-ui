import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { IEnvironment } from '@environments/ienvironment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService implements IEnvironment {

  get production() {
    return environment.production;
  }

  get apiUrl() {
    return environment.apiUrl;
  }

}
