import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

export interface ILocator {
  BaseUri : string;
  ContentAccessComponent : string;
  Path : string;
}

export enum LocatorType {
  None,
  SAS,
  OnDemandOrigin,
}

export async function createLocator
  (type : LocatorType, assetId : string, accessPolicyId : string, accessToken : string) : Promise < ILocator > {

  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Locators';
  const args = {
    headers: createHeaders(accessToken),
    data: {
      AccessPolicyId: accessPolicyId,
      AssetId: assetId,
      StartTime: (new Date(Date.now() - 5 * 60 * 1000))
        .toISOString()
        .split('.', 1)[0], // Start 5 minutes before to prevent Azure clock skew
      Type: type,
    },
  };

  const locator: ILocator = await new Promise < ILocator > ((resolve, reject) => {
    new Client()
      .post(url, args, (data, response) => {

        if (response.statusCode !== 201) {
          reject(`Failed to create locator because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));

        const locator : ILocator = {
          BaseUri: json.BaseUri,
          ContentAccessComponent: json.ContentAccessComponent,
          Path: json.Path,
        };

        resolve(locator);
      });
  });

  return locator;
}
