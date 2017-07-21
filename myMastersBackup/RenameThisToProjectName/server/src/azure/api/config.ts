export const BLOB_SERVICE_ID = 'videxmediastorage';
export const MEDIA_SERVICE_ID = 'videxmedia';

// TODO: Is this robust? Is there a generic endpoint?
export const MEDIA_SERVICE_HOST = 'ams-caea-1-hos-rest-1-1.cloudapp.net';
export const MEDIA_SERVICE_BASE_URL = `https://${MEDIA_SERVICE_HOST}/api/`;
export const MEDIA_SERVICE_AUTH_URL = 'https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13';

// TODO: Store secrets outside repository and pass to service as environment variables
export const BLOB_SERVICE_SECRET =
  'pxGI+XzTVRfsPbj3Ry87wCHnji44vXIHMKp+W8eRXOrjs5ZqVFXHK1MucqhpLFTuTch/nFat5dMP8eelJrKiGA==';
export const MEDIA_SERVICE_SECRET = 'S+d/39F03YHeiM79uAj48vBm2PBs5NQ3kNo8plaCJvM=';

