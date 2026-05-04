import axios from "axios";

/**
 * Uploads an image to ImgBB and returns the direct display URL.
 * @param {File} image - The image file object from input type="file"
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadImage = async (image) => {
    if (!image) return null;
    
    const formData = new FormData();
    formData.append("image", image);
    
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    
    try {
        const response = await axios.post(url, formData);
        if (response.data.success) {
            return response.data.data.display_url;
        }
        throw new Error("Failed to upload image to ImgBB");
    } catch (error) {
        console.error("ImgBB upload error:", error);
        throw error;
    }
};
