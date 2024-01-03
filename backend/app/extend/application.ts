import { PrismaClient } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

const s3Config = {
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: 'https://sfo3.digitaloceanspaces.com',
  region: process.env.AWS_REGION || '',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_ACCESS_SECRET || '',
  },
};

const s3Client = new S3Client(s3Config);

const extendedApp = {
  prisma,
  s3Client,
};

export default extendedApp;
