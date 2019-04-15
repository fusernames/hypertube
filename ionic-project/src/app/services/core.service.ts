/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   core.service.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 18:36:59 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/13 18:51:43 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private URL = 'https://hypertube.barthonet.ovh';
  protected token: string;
  protected LOADER_MESSAGE: string;
  protected loader: any;

  constructor(public http: HttpClient,
              protected loadingCtrl: LoadingController) { }

  async request({ method, url, data, toastMsg }: { method: string; url: string; data?: any; toastMsg?: string; }): Promise<any> {
    const req = this.initRequest(url);
    this.LOADER_MESSAGE = toastMsg ? toastMsg : 'Chargement en cours ...';
    this.loader = await this.loadingCtrl.create({message: this.LOADER_MESSAGE});

    await this.loader.present();
    switch (method) {
      case 'post':
        return await this.post({ url: req.url, data, headers: req.options });
      case 'get':
        return await this.get({ url: req.url, headers: req.options });
      case 'put':
        return await this.put({ url: req.url, data, headers: req.options });
      case 'delete':
        return await this.delete({ url: req.url, headers: req.options });
    }
  }

  initRequest(endPoint: string): {url: string, options: any} {
    return {
      url: this.URL + endPoint,
      options: { headers: this.setHeaders() }
    };
  }

  setHeaders(): HttpHeaders {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (this.token) {
      headers = headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }

  async post({ url, data, headers }: { url: string; data: any; headers; }): Promise<any> {
    !headers ? headers = { headers: this.setHeaders() } : 0;

    return new Promise(
      (resolve, reject) => this.http.post(url, data, headers).subscribe(
        (resp: any) => {
          resolve(resp);
          this.loader ? this.loader.dismiss() : 0;
        },
        (err: any) => {
          reject(err);
          this.loader ? this.loader.dismiss() : 0;
        }
      )
    );
  }

  async put({ url, data, headers }: { url: string; data: any; headers; }): Promise<any> {
    !headers ? headers = { headers: this.setHeaders() } : 0;

    return new Promise(
      (resolve, reject) => this.http.put(url, data, headers).subscribe(
        (resp: any) => {
          resolve(resp);
          this.loader ? this.loader.dismiss() : 0;
        },
        (err: any) => {
          reject(err);
          this.loader ? this.loader.dismiss() : 0;
        }
      )
    );
  }

  async get({ url, headers }: { url: string; headers; }): Promise<any> {
    !headers ? headers = { headers: this.setHeaders() } : 0;

    return new Promise(
      (resolve, reject) => this.http.get(url, headers).subscribe(
        (resp: any) => {
          resolve(resp);
          this.loader ? this.loader.dismiss() : 0;
        },
        (err: any) => {
          reject(err);
          this.loader ? this.loader.dismiss() : 0;
        }
      )
    );
  }

  async delete({ url, headers }: { url: string; headers; }): Promise<any> {
    !headers ? headers = { headers: this.setHeaders() } : 0;

    return new Promise(
      (resolve, reject) => {
        return this.http.delete(url, headers).subscribe((resp: any) => {
          resolve(resp);
          this.loader ? this.loader.dismiss() : 0;
        }, (err: any) => {
          reject(err);
          this.loader ? this.loader.dismiss() : 0;
        });
      }
    );
  }

  get url(): string {
    return this.URL;
  }

  setToken(token: string): void {
    this.token = token;
  }
}
