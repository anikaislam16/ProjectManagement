const handleFileChange = async (event) => {
  const file = event.target.files[0];

  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Make an API call using fetch to your server to handle the file upload
      const response = await fetch("http://your-server/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("File uploaded successfully:", responseData);
        // You can handle the response accordingly (e.g., update state, show a success message)
      } else {
        console.error("Error uploading file:", response.statusText);
        // Handle the error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      // Handle the error (e.g., show an error message)
    }
  }
};
