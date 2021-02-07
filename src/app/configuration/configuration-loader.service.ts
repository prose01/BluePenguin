
// dynamic configuration
//https://itnext.io/how-does-app-initializer-work-so-what-do-you-need-to-know-about-dynamic-configuration-in-angular-718e7c345971


import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Configuration } from "./configuration.model";

@Injectable({
  providedIn: "root"
})
export class ConfigurationLoader {
  private readonly CONFIGURATION_URL = "./assets/appsettings.json";
  private _configuration: Configuration;

  constructor(private _http: HttpClient) { }

  public loadConfiguration() {
    return this._http
      .get(this.CONFIGURATION_URL)
      .toPromise()
      .then((configuration: Configuration) => {
        this._configuration = configuration;
        return configuration;
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  getConfiguration() {
    return this._configuration;
  }
}
