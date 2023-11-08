export const environment = {
  production: false,
  backendUrlDev: "https://localhost:7227",  // URL to the REST API-Backend
  dbTableName: "DcMetadata",  // Name of the db table to sync data to
  dbTableAutomaticFields: ["ItemId", "LastModifiedAt", "RowVersion"],  // Automatic cols of the db table that are not to be filled by user
  assets: {
    smsLogo: 'assets/img/sms-group.png'
  }
};
