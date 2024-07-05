import sharp from 'sharp';
import uploadToFTP from './ftpClient.js';

// ฟังก์ชันสำหรับตรวจสอบและแปลง base64 ให้ถูกต้อง
const getBase64Data = (base64String)=> {
     // ตัดส่วนหัวของ base64 string ออก (เช่น data:image/jpeg;base64,)
     const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
     if(!matches || matches.length !== 3){
        throw new Error('รูปภาพมีฟอร์แมตไม่ถูกต้อง');
     }
     return Buffer.from(matches[2], 'base64')
}

const handleImageUpload = async(imageBase64)=>{
    const imageBuffer = getBase64Data(imageBase64)
  const imageSharp = sharp(imageBuffer);
  const metadata = await imageSharp.metadata();
  if (metadata.width > 1200 || metadata.height > 800) {
    throw new Error('รูปภาพมีขนาดใหญ่กว่า 1200x800');
  }
  const imageName = await uploadToFTP(imageBuffer, 'image.jpg', '/images');
  return imageName;
  
}   


async function handleVideoUpload(videoFile) {
    // คุณสามารถเพิ่มการตรวจสอบขนาดของไฟล์วีดีโอได้ที่นี่
    const videoBuffer = videoFile.buffer;
    
    const videoName = await uploadToFTP(videoBuffer, videoFile.originalname, '/videos');
    return videoName;
  }

  export default handleImageUpload;
  export { handleVideoUpload };