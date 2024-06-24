const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 10;
let currentColor = '#000000';
let uploadedImage = null;
let imageVisible = true;

canvas.height = 500;
canvas.width = 500;

document.addEventListener('DOMContentLoaded', function () {
    drawGrid();
});

canvas.addEventListener('mousedown', drawPixel);

document.getElementById('saveBtn').addEventListener('click', saveCanvas);

document.getElementById('loadBtn').addEventListener('click', loadCanvas)

document.getElementById('uploadImage').addEventListener('change', handleImageUpload);

document.getElementById('toggleImageBtn').addEventListener('click', toggleImageVisibility);

document.querySelectorAll('.color-picker').forEach(picker => {
    picker.addEventListener('click', (e) => {
        currentColor = e.target.getAttribute('data-color');
        document.getElementById('colorInput').value = currentColor;
        setActiveColor(e.target);
    });
});

document.getElementById('colorInput').addEventListener('input', (e) => {
    const newColor = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newColor)) {
        currentColor = newColor;
        setActiveColor(null);
    }
});

document.getElementById('setSizeBtn').addEventListener('click', function () {
    const width = document.getElementById('canvasWidth').value;
    const height = document.getElementById('canvasHeight').value;
    setCanvasSize(width, height);
});

function setCanvasSize(width, height) {
    canvas.width = width;
    canvas.height = height;
    clearCanvas();
    drawGrid();
}


function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function drawPixel(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pixelX = Math.floor(x / pixelSize) * pixelSize;
    const pixelY = Math.floor(y / pixelSize) * pixelSize;

    ctx.fillStyle = currentColor;
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
}

function saveCanvas() {
    const dataURL = canvas.toDataURL();
    localStorage.setItem('canvasData', dataURL);
    alert('Canvas saved!');
}

function loadCanvas() {
    const dataURL = localStorage.getItem('canvasData');
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        }
        alert('Canvas loaded!');
    } else {
        alert('No saved canvas found!');
    }
}

function setActiveColor(element) {
    document.querySelectorAll('.color-picker').forEach(picker => {
        picker.classList.remove('active');
    });
    if (element) {
        element.classList.add('active');
    }
}

function drawGrid() {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += pixelSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += pixelSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = '#ddd';
    ctx.stroke();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                clearCanvas();
                ctx.globalAlpha = 0.5;

                const canvasAspect = canvas.width / canvas.height;
                const imgAspect = img.width / img.height;
                let drawWidth, drawHeight, offsetX, offsetY;

                if (imgAspect > canvasAspect) {
                    drawWidth = canvas.width;
                    drawHeight = drawWidth / imgAspect;
                    offsetX = 0;
                    offsetY = (canvas.height - drawHeight) / 2;
                } else {
                    drawHeight = canvas.height;
                    drawWidth = drawHeight * imgAspect;
                    offsetX = (canvas.width - drawWidth) / 2;
                    offsetY = 0;
                }
                document.getElementById('uploadImage').value = ''
                ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                ctx.globalAlpha = 1.0;
                drawGrid();
            }
        }
        reader.readAsDataURL(file);
    }
}

function drawBackgroundImage() {
    if (backgroundImage) {
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = backgroundImage.width / backgroundImage.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.globalAlpha = 0.5;
        ctx.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0;
    }
}

function toggleImageVisibility() {
    imageVisible = !imageVisible;
    redrawCanvas();
}

function redrawCanvas() {
    clearCanvas();
    if (imageVisible && uploadedImage) {
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = uploadedImage.width / uploadedImage.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (imgAspect > canvasAspect) {
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgAspect;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgAspect;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.globalAlpha = 0.5;
        ctx.drawImage(uploadedImage, offsetX, offsetY, drawWidth, drawHeight);
        ctx.globalAlpha = 1.0;
        imageVisible = false
    }
    drawGrid();
}