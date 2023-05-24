import { Controller } from 'egg';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import globalErrorCodes from '../error_codes/global';
import uploadErrorCodes from '../error_codes/upload';

async function streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf: any[] = [];

        stream.on('data', (chunk) => _buf.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(_buf)));
        stream.on('error', (err) => reject(err));
    });
}

export default class UploadController extends Controller {
    public async uploadImage() {
        try {
            const { s3Client } = this.app;
            // TODO AUTH
            const stream = await this.ctx.getFileStream();
            if (!stream) {
                this.ctx.status = 400;
                this.ctx.body = uploadErrorCodes.UPLOAD_PARAMS_INVALID;
                return;
            }
            const buffer = await streamToBuffer(stream).catch(err => {
                throw new Error(err)
            })
            if (!buffer) {
                this.ctx.status = 409;
                this.ctx.body = uploadErrorCodes.STREAM_TO_BUFFER_ERROR;
                return;
            }
            const res = await s3Client.send(
                new PutObjectCommand({
                    Bucket: process.env.AWS_IMAGE_BUCKET,
                    Body: buffer,
                    Key: stream.filename,
                    ContentType: stream.mimeType,
              })
            ).catch(err => {
              throw new Error(err)
            })
            if (!res) {
                this.ctx.status = 409;
                this.ctx.body = uploadErrorCodes.STREAM_TO_BUFFER_ERROR;
                return;
            } 
            // TODO: GET IMAGE PUBLIC IMAGE URL
                this.ctx.status = 201;
                this.ctx.body = res;
        } catch (err) {
            this.ctx.status = 500;
            this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
        }
    }
}