import { Controller } from 'egg';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

import globalErrorCodes from '../error_codes/global';
import taskErrorCodes from '../error_codes/task';

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
            const compileTask = new Promise(async (resolve, reject) => {
                const client = new (algorithmProto as any).Algorithm(
                    'localhost:50051',
                    grpc.credentials.createInsecure()
                )
                const call = client.Compile((err, response) => {
                    if (err) {
                        reject(err.details)
                    } else {
                        resolve(response)
                    }
                }) 
                const readStream = await this.ctx.getFileStream();
                if (!readStream) {
                    throw new Error('Read Stream Null')
                }
                const { lang, params} = readStream.fields
                call.write({
                    lang,
                    params
                })
                readStream.on('data', (chunk: Buffer) => {
                    call.write({
                        file: Uint8Array.from(chunk)
                    })
                })
                readStream.on('end', () => {
                    call.end();
                });
            })
            const res: any = await compileTask.catch(err => {
                this.ctx.status = 400
                this.ctx.body = {
                    code: taskErrorCodes.COMPILE_ERROR.code,
                    msg: err,
                }
            })
            if (res) {
                const { expected_output, actual_output } = res
                this.ctx.status = 200
                this.ctx.body = {
                   expectedOutput: JSON.parse(expected_output),
                   actualOutput: JSON.parse(actual_output) 
                }
            }

        } catch (err) {
            console.log('err', err)
            this.ctx.status = 500;
            this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
        }
    }

    public async test() {
        try {
            const compileTask = new Promise(async (resolve, reject) => {
                const client = new (algorithmProto as any).Algorithm(
                    'localhost:50051',
                    grpc.credentials.createInsecure()
                )
                const call = client.Test((err, response) => {
                    if (err) {
                        reject(err.details)
                    } else {
                        resolve(response)
                    }
                }) 
                const readStream = await this.ctx.getFileStream();
                if (!readStream) {
                    throw new Error('Read Stream Null')
                }
                const { lang } = readStream.fields
                call.write({
                    lang,
                })
                readStream.on('data', (chunk: Buffer) => {
                    call.write({
                        file: Uint8Array.from(chunk)
                    })
                })
                readStream.on('end', () => {
                    call.end();
                });
            })
            const res: any = await compileTask.catch(err => {
                this.ctx.status = 400
                this.ctx.body = {
                    code: taskErrorCodes.COMPILE_ERROR.code,
                    msg: err,
                }
            })
            if (res) {
                this.ctx.status = 200
                this.ctx.body = res
            }

        } catch (err) {
            this.ctx.status = 500;
            this.ctx.body = globalErrorCodes.SERVER_UNKNOWN_ERROR;
        }
    }
}