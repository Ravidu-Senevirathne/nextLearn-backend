import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { fileStorageConfig } from '../config/file-storage.config';
import * as fs from 'fs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
    constructor() {
        // Ensure upload directory exists
        if (!fs.existsSync('./uploads/assignments')) {
            fs.mkdirSync('./uploads/assignments', { recursive: true });
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();

        // File validation already handled by Multer
        if (!req.files || req.files.length === 0) {
            throw new BadRequestException('No files uploaded');
        }

        return next.handle();
    }
}