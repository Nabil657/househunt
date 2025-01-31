document.getElementById('remove-bg-btn').addEventListener('click', async () => {
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

  reader.onload = async (e) => {
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // Load BodyPix model
      const net = await bodyPix.load();

      // Segment the person in the image
      const segmentation = await net.segmentPerson(canvas);

      // Remove background
      const maskBackground = bodyPix.toMask(segmentation);
      ctx.putImageData(maskBackground, 0, 0);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

document.getElementById('download-btn').addEventListener('click', () => {
  const canvas = document.getElementById('canvas');
  const link = document.getElementById('download-btn');
  link.href = canvas.toDataURL();
});