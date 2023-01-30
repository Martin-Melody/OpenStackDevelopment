import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOTURL;

  constructor(private _http: HttpClient) {
    this.ROOTURL = 'http://localhost:3000';
  }

  get(uri: string) {
    return this._http.get(`${this.ROOTURL}/${uri}`);
  }

  post(uri: string, payload: Object) {
    return this._http.post(`${this.ROOTURL}/${uri}`, payload);
  }

  patch(uri: string, payload: Object) {
    return this._http.patch(`${this.ROOTURL}/${uri}`, payload);
  }

  delete(uri: string) {
    console.log(this._http.delete(`${this.ROOTURL}/${uri}`));
    return this._http.delete(`${this.ROOTURL}/${uri}`);
  }
}
