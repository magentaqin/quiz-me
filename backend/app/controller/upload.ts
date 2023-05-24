import { Controller } from 'egg';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import globalErrorCodes from '../error_codes/global';
import uploadErrorCodes from '../error_codes/upload';
import userErrorCodes from '../error_codes/user';

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
            const { s3Client, prisma } = this.app;
            // 01 Check whether the user is valid.
            const userId = await this.ctx.service.auth.userAuth.getUserId(this.ctx);
            if (!userId) {
                this.ctx.status = 401;
                this.ctx.body = userErrorCodes.USER_NOT_AUTHORIZED;
            }
            const userResp = await prisma.user.findUnique({
                where: {
                userId,
                },
            });
            if (!userResp) {
                this.ctx.status = 401;
                this.ctx.body = userErrorCodes.USER_NOT_EXIST;
                return;
            }

            // 02 CHECK file key
            const stream = await this.ctx.getFileStream();
        
            if (!stream || !stream.fields.fileKey) {
                this.ctx.status = 400;
                this.ctx.body = uploadErrorCodes.UPLOAD_PARAMS_INVALID;
                return;
            }

            // 03 Transform stream to buffer
            const buffer = await streamToBuffer(stream).catch(err => {
                throw new Error(err)
            })
            if (!buffer) {
                this.ctx.status = 409;
                this.ctx.body = uploadErrorCodes.STREAM_TO_BUFFER_ERROR;
                return;
            }

            // 04 Put object to S3 Bucket
            const params = {
                Bucket: process.env.AWS_IMAGE_BUCKET,
                Body: buffer,
                Key: stream.fields.fileKey,
                ContentType: stream.mimeType,
            }
            const res = await s3Client.send(new PutObjectCommand(params)).catch(err => {
              throw new Error(err)
            })
            if (!res) {
                this.ctx.status = 409;
                this.ctx.body = uploadErrorCodes.STREAM_TO_BUFFER_ERROR;
                return;
            } 

            // 05 GET temporary Image Url
            const command = new GetObjectCommand(params);
            const signedUrl = await getSignedUrl(s3Client as any, command as any, {
                expiresIn: 3600,
            });

            this.ctx.status = 201;
            this.ctx.body = {
                url: signedUrl,
                fileKey: stream.fields.fileKey,
            };
        } catch (err) {
            this.ctx.status = 500;
            this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
        }
    }
}