import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(file): Promise<string> {
    try {
      const fileName = uuid.v4() + '.jpg';
      const pathFile = path.resolve(__dirname, '..', 'static');

      if(!fs.existsSync(pathFile)) {// check files in this path
        fs.mkdirSync(pathFile, { recursive: true });
      }

      console.log('11111 fileName', fileName)
      fs.writeFileSync(path.join(pathFile, fileName), file.buffer);

      return fileName;
    } catch (e) {
      throw new HttpException('Error for uploading file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
