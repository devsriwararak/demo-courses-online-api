import sharp from "sharp";
import uploadToFTP from "./ftpClient.js";
import { loginUser } from "../controllers/login.js";

// ฟังก์ชันสำหรับตรวจสอบและแปลง base64 ให้ถูกต้อง
const getBase64Data = (base64String) => {
  // ตัดส่วนหัวของ base64 string ออก (เช่น data:image/jpeg;base64,)
  const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("รูปภาพมีฟอร์แมตไม่ถูกต้อง");
  }
  return Buffer.from(matches[2], "base64");
};

const handleImageUpload = async (imageBase64) => {
  console.log(imageBase64);
  try {
    // start data:image/jpeg;base64,
    const imageBuffer = getBase64Data(imageBase64);
    const imageSharp = sharp(imageBuffer);
    const metadata = await imageSharp.metadata();
    if (metadata.width > 1200 || metadata.height > 1000) {
      throw new Error("รูปภาพมีขนาดใหญ่กว่า 1200x800");
    }
    const imageName = await uploadToFTP(imageBuffer, "image.jpg", "/images");
    return imageName;
  } catch (error) {
    throw new Error(`การอัพโหลดรูปภาพล้มเหลว: ${error.message}`);
  }
};

async function handleVideoUpload(videoFile) {
  try {
    // คุณสามารถเพิ่มการตรวจสอบขนาดของไฟล์วีดีโอได้ที่นี่
    const videoBuffer = videoFile.buffer;

    const videoName = await uploadToFTP(
      videoBuffer,
      videoFile.originalname,
      "/videos"
    );
    return videoName;
  } catch (error) {
    throw new Error(`การอัพโหลดวีดีโอภาพล้มเหลว: ${error.message}`);
  }
}


async function uploadImageFile(file) {

  try {
    const imageBuffer = file.buffer
    const imageSharp = sharp(imageBuffer);
    const metadata = await imageSharp.metadata();
    if (metadata.width > 1920 || metadata.height > 1080) {
      throw new Error("รูปภาพมีขนาดใหญ่กว่า 1920 * 1080");
    }
    const imageName = await uploadToFTP(imageBuffer, "image.jpg", "/images");
    return imageName
  } catch (error) {
    throw new Error(`การอัพโหลดวีดีโอภาพล้มเหลว: ${error.message}`);
  }
}

export default handleImageUpload;
export { handleVideoUpload, uploadImageFile };
