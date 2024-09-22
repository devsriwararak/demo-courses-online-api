import axios from "axios";
import { Blob } from "buffer";
import slipOK from "slipok";

// ฟังก์ชันตรวจสอบสลิป, ยอดเงิน, และบัญชีที่โอนมา
export async function verifySlipAmountAndAccount(slipBuffer, expectedAmount) {
  try {
    const expectedAccountNumber = "xxx-x-x8937-x"; 
    const expectedAccountName = "MR. Nattawut S"; 

    const formData = new FormData();
    const blob = new Blob([slipBuffer], { type: "image/jpeg" });
    formData.append("files", blob, "slip.jpg");

    const response = await axios.post(
      `https://api.slipok.com/api/line/apikey/30296`,
      formData,
      {
        headers: {
          "x-authorization": "SLIPOKJY1D5AT",
        },
      }
    );

    const success = response.data.success;
    const success_qrcode = response.data.data.success;
    const amount = response.data.data.amount;
    const sendToname = response.data.data.receiver.name;
    const sendToAccount = response.data.data.receiver.account.value;


    // ตรวจสอบว่าการตรวจสอบสลิปสำเร็จ, ยอดเงินถูกต้อง, และบัญชีปลายทางถูกต้องหรือไม่
      if ( amount == expectedAmount && sendToname == expectedAccountName &&  sendToAccount == expectedAccountNumber  ) {        
        return true;
      } else {
        return false;
      }
  } catch (error) {
    console.error("Error verifying slip:", error);
    return false;
  }
}
