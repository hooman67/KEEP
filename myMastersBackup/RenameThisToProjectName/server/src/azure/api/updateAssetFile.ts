import * as https from 'https';
import * as ApiConfig from './config';
import { createHeaders } from './util';

// Update asset file metadata
// https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
export async function updateAssetFile
  (fileName : string, assetId : string, assetFileId : string, fileSize : number, accessToken : string) {

  const host : string = ApiConfig.MEDIA_SERVICE_HOST;
  const path : string = '/api/Files(\'' + encodeURIComponent(assetFileId) + '\')';

  const headers = createHeaders(accessToken);
  const body = {
    ContentFileSize: fileSize.toString(),
    Id: assetFileId,
    // 'MimeType': 'video/mp4', // TODO: Autodetermine or remove?
    Name: fileName,
    ParentAssetId: assetId,
  };
  const bodyJson = JSON.stringify(body);
  headers['Content-Length'] = Buffer.byteLength(bodyJson, 'utf8');

  const httpOptions = {
    headers,
    host,
    path,
    method: 'MERGE',
  };

  await new Promise((resolve, reject) => {
    const request = https.request(httpOptions, (response) => {

      if (response.statusCode !== 204) {
        reject(`Failed to update asset file because ${response.statusCode}: ${response.statusMessage}`);
        return;
      }

      resolve();
    });

    request.write(bodyJson);
    request.end();
    request.on('error', (e) => {
      reject(`Failed to update asset file because ${e}`);
    });
  });
}
