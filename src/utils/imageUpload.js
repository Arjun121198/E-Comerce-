const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Handles the image upload process.
 * @param {Object} file - The file to upload.
 * @param {string} uploadFolder - The folder where the image will be uploaded.
 * @returns {Promise<string>} - The path of the uploaded image.
 */

const uploadImage = async (file, uploadFolder) => {
    return new Promise((resolve, reject) => {
        // Create the upload folder if it doesn't exist
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        // Create a unique file name
        const uniqueFileName = `${uuidv4()}_${file.name}`;
        const imagePath = path.join(uploadFolder, uniqueFileName); // Full path to save the image

        // Move the uploaded file to the specified path
        file.mv(imagePath, (err) => {
            if (err) {
                return reject(new Error('Image upload failed: ' + err.message));
            }
            // Return the relative path to the uploaded image
            resolve(`/uploads/${path.basename(uploadFolder)}/${uniqueFileName}`);
        });
    });
};

module.exports = { uploadImage };
