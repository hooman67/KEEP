import { Client } from 'node-rest-client';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Delete an asset which already exists in AMS
// https://docs.microsoft.com/en-us/azure/media-services/media-services-dotnet-manage-entities
export async function deleteAsset (assetId, accessToken) {

  const encodedAssetId: string = encodeURI(assetId);
  const url: string = ApiConfig.MEDIA_SERVICE_BASE_URL + 'Assets(\'' + encodedAssetId + '\')';
  const args = {
    headers: createHeaders(accessToken),
  };

  await new Promise((resolve, reject) => {
    new Client()
      .delete(url, args, (data, response) => {

        if (response.statusCode !== 204) {
          reject(`Failed to delete asset because ${response.statusCode}: ${response.statusMessage}`);
          return;
        }

        resolve();
      });
  });
}
