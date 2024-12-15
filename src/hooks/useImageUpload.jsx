import { useState } from "react";

function useImageUpload() {
	const [imageBuffer, setImageBuffer] = useState(null);
	const [error, setError] = useState(null);

	const handleImageUpload = (event) => {
		let file = event.target.files[0];
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
			reader.readAsDataURL(file);
		}).then((response) => {
			console.log(response);
			setImageBuffer(response);
		}).catch((error) => {
			setError(error);
		});
	};

	return { imageBuffer, handleImageUpload, error };
}

export { useImageUpload };
