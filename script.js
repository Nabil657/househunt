let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let imageInput = document.getElementById('imageInput');
let downloadLink = document.getElementById('downloadLink');
let bgColorInput = document.getElementById('bgColor');
let net;

// Load BodyPix model
async function loadBodyPix() {
    net = await bodyPix.load();
    console.log("BodyPix model loaded");
}
loadBodyPix();

// Load image
imageInput.addEventListener('change', function(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
        let img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

// Resize image
function resizeImage() {
    let width = parseInt(document.getElementById('width').value);
    let height = parseInt(document.getElementById('height').value);

    if (isNaN(width) || isNaN(height)) {
        alert('Please enter valid width and height');
        return;
    }

    let img = new Image();
    img.onload = function() {
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        downloadLink.href = canvas.toDataURL();
        downloadLink.style.display = 'block';
    };
    img.src = canvas.toDataURL();
}

// Change background
async function changeBackground() {
    if (!net) {
        alert("BodyPix model is still loading. Please wait.");
        return;
    }

    let bgColor = bgColorInput.value; // Get selected color
    let img = new Image();
    img.onload = async function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Perform segmentation
        const segmentation = await net.segmentPerson(canvas);

        // Create a mask
        const mask = bodyPix.toMask(segmentation);
        ctx.putImageData(mask, 0, 0);

        // Draw new background
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';

        // Draw the person on top of the new background
        ctx.drawImage(img, 0, 0);

        // Enable download link
        downloadLink.href = canvas.toDataURL();
        downloadLink.style.display = 'block';
    };
    img.src = canvas.toDataURL();
}

// Enhance image (simple brightness and contrast adjustment)
function enhanceImage() {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        // Increase brightness
        data[i] += 20;     // Red
        data[i + 1] += 20; // Green
        data[i + 2] += 20; // Blue

        // Increase contrast
        data[i] = data[i] < 128 ? data[i] * 0.9 : data[i] * 1.1;
        data[i + 1] = data[i + 1] < 128 ? data[i + 1] * 0.9 : data[i + 1] * 1.1;
        data[i + 2] = data[i + 2] < 128 ? data[i + 2] * 0.9 : data[i + 2] * 1.1;
    }

    ctx.putImageData(imgData, 0, 0);
    downloadLink.href = canvas.toDataURL();
    downloadLink.style.display = 'block';
}