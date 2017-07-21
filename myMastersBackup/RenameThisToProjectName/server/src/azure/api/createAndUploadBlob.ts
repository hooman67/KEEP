import * as Azure from 'azure';
import * as MsRest from 'ms-rest-azure';
import * as ApiConfig from './config';

// Upload a file to block blob storage (container should already exist)
// https://github.com/Azure/azure-storage-node
export async function createAndUploadBlob (fileName: string, filePath: string, containerId: string) {

  await new Promise((resolve, reject) => {

    const blobService = Azure.createBlobService(ApiConfig.BLOB_SERVICE_ID, ApiConfig.BLOB_SERVICE_SECRET);
    blobService.createBlockBlobFromLocalFile(containerId, fileName, filePath, (error, result, response) => {

      if (error) {
        reject(`Failed to upload blob because ${response.statusCode}: ${response.statusMessage}. Error: ${error}`);
        return;
      }

      resolve();
    });
  });
}
