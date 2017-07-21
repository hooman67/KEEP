import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

export interface IAsset {
  id: string;
  location: string;
  containerId: string;
}

export async function createAsset (fileName: string, accessToken: string): Promise<IAsset> {

  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Assets';
  const args = {
    headers: createHeaders(accessToken),
    data: {
      Name: fileName,
    },
  };

  let asset: IAsset = await new Promise<IAsset>((resolve, reject) => {
    new Client().post(url, args, (data, response) => {

      if (response.statusCode !== 201) {
        reject(`Failed to create asset because ${response.statusCode}: ${response.statusMessage}`);
        return;
      }

      const json = JSON.parse(data.toString('utf8'));
      const asset = {
        id: json.Id,
        location: response.headers.location,
        containerId: json.Uri.split('/').pop(),
      };

      resolve(asset);
    });
  });

  return asset;
}
