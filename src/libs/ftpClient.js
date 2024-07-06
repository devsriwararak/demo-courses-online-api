import ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadToFTP = async (fileBuffer, originalName, directory) => {
  const client = new ftp.Client();
  client.ftp.verbose = true; // เปิดการแสดงข้อความเพิ่มเติมสำหรับการดีบัก
  client.ftp.timeout = 60000; // เพิ่มเวลาหมดเวลาเป็น 60 วินาที
  
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    const fileName = `${crypto.randomBytes(16).toString('hex')}${path.extname(originalName)}`;

    // สร้าง Readable stream จาก buffer
    const stream = new Readable();
    stream._read = () => {}; // _read is required but you can noop it
    stream.push(fileBuffer);
    stream.push(null);

    await client.uploadFrom(stream, `${directory}/${fileName}`);
    return fileName;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    client.close();
  }
};

export default uploadToFTP;

