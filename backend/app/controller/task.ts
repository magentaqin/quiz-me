import { Controller } from 'egg';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import globalErrorCodes from '../error_codes/global';

const protoPath = path.resolve(__dirname, '../../proto', './algorithm.proto')
// dynamically generates service descriptors and client stub definitions from proto files
const packageDefinition = protoLoader.loadSync(
    protoPath,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
)

const algorithmProto = grpc.loadPackageDefinition(packageDefinition).algorithm;

export default class TaskController extends Controller {
    public async compile() {
        try {
            const client = new (algorithmProto as any).Algorithm(
                'localhost:50051',
                grpc.credentials.createInsecure()
            )
            const call = client.Compile((err, response) => {
                if (err) {
                    console.log('error', err)
                } else {
                    console.log('response', response)
                }
            })
            call.write({
              lang: 'javascript'
            })
            const readStream = await this.ctx.getFileStream();
            readStream.on('data', (chunk: Buffer) => {
                call.write({
                    file: Uint8Array.from(chunk)
                })
            })
            readStream.on('end', () => {
                call.end();
            });
        } catch (err) {
            this.ctx.status = 500;
            this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
        }
    }
}