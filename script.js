const API_KEY = "FEtQKw253j7dBoaWp7VJXe9P"; // এখানে আপনার Remove.bg API key বসান।

document.getElementById('resize-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('image-upload');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  if (fileInput.files.length === 0) {
    alert('Please upload an image first!');
    return;
  }

  const file = fileInput.files[0];
  const img = new Image();
  const reader = new FileReader();

  reader.onload = (e) => {
    img.onload = () => {
      canvas.width = img.width / 2; // Resize to 50%
      canvas.height = img.height / 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

document.getElementById('bg-change-btn').addEventListener('click', async () => {
  const fileInput = document.getElementById('image-upload');

  if (fileInput.files.length === 0) {
    alert('Please upload an image first!');
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("image_file", file);

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const imgURL = URL.createObjectURL(blob);

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = imgURL;

    // Enable download button
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.href = imgURL;
  } catch (error) {
    console.error(error);
    alert("Failed to change the background. Please try again.");
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  const canvas = document.getElementById('canvas');
  const link = document.getElementById('download-btn');
  link.href = canvas.toDataURL();
});