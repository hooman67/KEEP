export function createHeaders (accessToken: string) {

  // See: https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-get-started
  return {
    Authorization: 'Bearer ' + accessToken,
    'x-ms-version': '2.11',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    DataServiceVersion: '1.0;NetFx',
    MaxDataServiceVersion: '3.0;NetFx',
  };
}
