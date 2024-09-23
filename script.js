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
    if (text) {
        if (isValidURL(text)) {
            const qrcodeContainer = document.getElementById('qrcode');
            qrcodeContainer.innerHTML = ''; // Clear any existing QR code
            new QRCode(qrcodeContainer, {
                text: text,
                width: 256,
                height: 256,
                colorDark: "#000000",
                colorLight: "#ffffff"
            });

            document.getElementById('downloadBtn').style.display = 'block';
        } else {
            alert("Please enter a valid URL");
        }
    } else {
        alert("Please enter text to generate a QR code");
    }
}

function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    const qrName = document.getElementById('qrname').value.trim();
    if (canvas) {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width + 50;
        newCanvas.height = canvas.height + 80;
        const ctx = newCanvas.getContext('2d');

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

        ctx.drawImage(canvas, 25, 25);

        ctx.fillStyle = "#000000";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(qrName, newCanvas.width / 2, newCanvas.height - 30);

        const link = document.createElement('a');
        link.href = newCanvas.toDataURL();
        link.download = qrName ? `${qrName}.png` : 'qr_code.png';
        link.click();
    }
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
