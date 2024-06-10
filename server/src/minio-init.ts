import { Client } from './types';

const minio = require('minio');

class Minio {
  private _client?: Client;

  connect() {
    this._client = new minio.Client({
      endPoint: 'minio-service',
      port: 9000,
      useSSL: false,
      accessKey: process.env.MINIO_ROOT_USER!,
      secretKey: process.env.MINIO_ROOT_PASSWORD!,
    });
  }

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Minio before connecting');
    }

    return this._client;
  }
}

const minioInstance = new Minio();

minioInstance.connect();

export const minioClient = minioInstance.client;
