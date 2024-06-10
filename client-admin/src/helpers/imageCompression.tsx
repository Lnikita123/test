import useTopBottomStyles from "@/store/useTopBottomStyles";
import imageCompression from "browser-image-compression";

export function useImageUpload() {
  const setSelectedImage = useTopBottomStyles((s) => s.setSelectedImage);
  const setSelectedImage2 = useTopBottomStyles((s) => s.setSelectedImage2);
  async function handleImageUpload(event: any) {
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: false,
    };
    try {
      let dataURL: any;
      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();
      reader.onload = () => {
        dataURL = reader.result as string;
        setSelectedImage(dataURL);
        const compressedFileSizeKB = Math.floor(compressedFile.size / 1024);
        if (compressedFileSizeKB > 100) {
          alert("The compressed file exceeds the size limit of 100KB.");
          return;
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleImageUpload2(event: any) {
    const imageFile = event.target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: false,
    };
    try {
      let dataURL: any;
      const compressedFile = await imageCompression(imageFile, options);
      const reader = new FileReader();
      reader.onload = () => {
        dataURL = reader.result as string;
        setSelectedImage2(dataURL);
        const compressedFileSizeKB = Math.floor(compressedFile.size / 1024);
        if (compressedFileSizeKB > 100) {
          alert("The compressed file exceeds the size limit of 100KB.");
          return;
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.log(error);
    }
  }
  return { handleImageUpload, handleImageUpload2 };
}
