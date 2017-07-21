import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

export async function createAssetFile
  (fileName : string, mimeType : string, assetId : string, accessToken : string) : Promise < string > {

  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Files';
  const headers = createHeaders(accessToken);
  const args = {
    headers,
    data: {
      IsEncrypted: 'false',
      IsPrimary: 'false',
      MimeType: mimeType,
      Name: fileName,
      ParentAssetId: assetId,
    },
  };

  const fileId: string = await new Promise < string > ((resolve, reject) => {
    new Client()
      .post(url, args, (data, response) => {

        if (response.statusCode !== 201) {
          reject(`Failed to create asset file because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        const json = JSON.parse(data.toString('utf8'));
        resolve(json.Id);
      });
  });

  return fileId;
}
