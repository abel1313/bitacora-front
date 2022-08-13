import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UtilService } from './util.service';
import { WINDOW } from './window.provider';


const matchProtocolDomainHost   = /^.*\/\/[^\/]+:?[0-9]?\//i;
@Injectable()
export class UrlServiceService {

  profile = environment.PROFILE;
  constructor(
    @Inject(WINDOW) private window: Window, 
    private readonly utilService: UtilService
  ) { }

  getUrl(url: string) {
    const hostname = this.window.location.hostname;
    if (this.isValidIp(hostname) || this.profile.includes('k8')) {
      return url;
    } else {
      let baseUrl; 
      if(this.utilService.validateData(localStorage.getItem('baseUrl'))){
        baseUrl  = localStorage.getItem('baseUrl');
      } else {
        baseUrl = this.window.location.protocol + '//' + hostname +
        (this.utilService.validateData(this.window.location.port) ? (':' + this.window.location.port + '/') : '/');
        localStorage.setItem('baseUrl', baseUrl);
      }

      if(hostname.includes('localhost')) {
        return url; 
      } else {
        var context  = url.replace(matchProtocolDomainHost, '');
        var newUrl  = baseUrl + context;
        return newUrl; 
      }
    
    } 
  }

  private isValidIp(hostname: string) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(hostname)) {
      return true;
    }
    return false;
  }

}
