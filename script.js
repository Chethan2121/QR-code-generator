function isValidURL(string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return !!urlPattern.test(string);
}

function generateQRCode() {
    const text = document.getElementById('text').value;
    const logoInput = document.getElementById('logoInput').files[0];
    const logoShape = document.querySelector('input[name="logoShape"]:checked').value;

    if (!text) {
        alert("Please enter text to generate a QR code");
        return;
    }

    if (!isValidURL(text)) {
        alert("Please enter a valid URL");
        return;
    }

    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = ''; // Clear previous QR code

    const qr = new QRCode(qrcodeContainer, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });

    setTimeout(() => {
        if (logoInput) {
            addLogoToQRCode(logoInput, logoShape);
        }
        document.getElementById('downloadBtn').style.display = 'block'; // Show download button
    }, 500);
}


function addLogoToQRCode(logoFile, logoShape) {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const logo = new Image();
    logo.src = URL.createObjectURL(logoFile);

    logo.onload = () => {
        const logoSize = canvas.width * 0.2; // 20% of QR code size
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        if (logoShape === "rounded") {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + logoSize / 2, y + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(logo, x, y, logoSize, logoSize);
            ctx.restore();
        } else {
            ctx.drawImage(logo, x, y, logoSize, logoSize);
        }
    };
}


function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    const qrName = document.getElementById('qrname').value.trim();
    if (!canvas) {
        alert("Generate a QR code first!");
        return;
    }

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width + 50;
    newCanvas.height = canvas.height + 80;
    const ctx = newCanvas.getContext('2d');

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Draw QR code from original canvas (already includes logo)
    ctx.drawImage(canvas, 25, 25);

    // Draw QR code name
    ctx.fillStyle = "#000000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(qrName || "QR Code", newCanvas.width / 2, newCanvas.height - 30);

    // Download the final image
    saveCanvasAsImage(newCanvas, qrName);
}


// Function to save canvas as an image
function saveCanvasAsImage(canvas, qrName) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = qrName ? `${qrName}.png` : 'qr_code.png';
    link.click();
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.setAttribute('data-theme', 'light');
});


// Function to toggle dark theme
function toggleTheme() {
    const body = document.body;
    if (body.getAttribute("data-theme") === "dark") {
        body.setAttribute("data-theme", "light");
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute("data-theme", "dark");
        localStorage.setItem('theme', 'dark');
    }
}

// Check for previously saved theme preference on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute("data-theme", savedTheme);
    document.getElementById('theme-switch').checked = savedTheme === 'dark';
});
