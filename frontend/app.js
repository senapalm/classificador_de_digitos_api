

const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const classifyButton = document.getElementById("classifyButton");
const statusMessage = document.getElementById("statusMessage");
const imageCanvas = document.getElementById("imageCanvas");
const preparedImageContainer = document.getElementById("preparedImageContainer");
const preparedImagePreview = document.getElementById("preparedImagePreview");

let pixels = [];

imageInput.addEventListener("change", function () {
    const file = imageInput.files[0];

    if (!file) {
        imagePreview.hidden = true;
        classifyButton.disabled = true;
        pixels = [];
        return;
    }

    const imageUrl = URL.createObjectURL(file);

imagePreview.onload = function () {
    // 1. Lê a imagem original em tons de cinza.
    const originalCanvas = document.createElement("canvas");
    originalCanvas.width = imagePreview.naturalWidth;
    originalCanvas.height = imagePreview.naturalHeight;

    const originalContext = originalCanvas.getContext("2d", {
        willReadFrequently: true
    });

    originalContext.drawImage(imagePreview, 0, 0);

    const originalData = originalContext.getImageData(
        0, 0, originalCanvas.width, originalCanvas.height
    );

    const width = originalCanvas.width;
    const height = originalCanvas.height;
    let grayPixels = new Uint8Array(width * height);

    for (let i = 0, j = 0; i < originalData.data.length; i += 4, j++) {
        const gray =
            0.299 * originalData.data[i] +
            0.587 * originalData.data[i + 1] +
            0.114 * originalData.data[i + 2];

        grayPixels[j] = Math.round(gray);
    }

    // 2. Calcula a intensidade média das bordas.
    let borderSum = 0;
    let borderCount = 0;

    for (let x = 0; x < width; x++) {
        borderSum += grayPixels[x];
        borderSum += grayPixels[(height - 1) * width + x];
        borderCount += 2;
    }

    for (let y = 0; y < height; y++) {
        borderSum += grayPixels[y * width];
        borderSum += grayPixels[y * width + width - 1];
        borderCount += 2;
    }

    // 3. Se o fundo for escuro, inverte a imagem.
    if (borderSum / borderCount < 127) {
        for (let i = 0; i < grayPixels.length; i++) {
            grayPixels[i] = 255 - grayPixels[i];
        }
    }

    // 4. Torna pixels quase brancos completamente brancos.
    for (let i = 0; i < grayPixels.length; i++) {
        if (grayPixels[i] > 180) {
            grayPixels[i] = 255;
        }
    }

    // 5. Encontra os limites do desenho.
    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grayPixels[y * width + x] < 245) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    // Se não houver desenho detectável, interrompe a preparação.
    if (maxX < minX || maxY < minY) {
        pixels = [];
        classifyButton.disabled = true;
        statusMessage.textContent =
            "Não foi possível identificar o desenho na imagem.";
        preparedImageContainer.hidden = true;
        return;
    }

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    // 6. Copia o recorte para um canvas auxiliar.
    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;

    const cropContext = cropCanvas.getContext("2d");
    const cropData = cropContext.createImageData(cropWidth, cropHeight);

    for (let y = 0; y < cropHeight; y++) {
        for (let x = 0; x < cropWidth; x++) {
            const gray = grayPixels[
                (minY + y) * width + minX + x
            ];

            const i = (y * cropWidth + x) * 4;
            cropData.data[i] = gray;
            cropData.data[i + 1] = gray;
            cropData.data[i + 2] = gray;
            cropData.data[i + 3] = 255;
        }
    }

    cropContext.putImageData(cropData, 0, 0);

    // 7. Redimensiona proporcionalmente para caber em 20 x 20.
    const scale = Math.min(20 / cropWidth, 20 / cropHeight);
    const resizedWidth = Math.max(1, Math.round(cropWidth * scale));
    const resizedHeight = Math.max(1, Math.round(cropHeight * scale));

    // 8. Centraliza o desenho em uma tela branca de 28 x 28.
    imageCanvas.width = 28;
    imageCanvas.height = 28;

    const context = imageCanvas.getContext("2d", {
        willReadFrequently: true
    });

    context.fillStyle = "white";
    context.fillRect(0, 0, 28, 28);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const offsetX = Math.floor((28 - resizedWidth) / 2);
    const offsetY = Math.floor((28 - resizedHeight) / 2);

    context.drawImage(
        cropCanvas,
        0, 0, cropWidth, cropHeight,
        offsetX, offsetY, resizedWidth, resizedHeight
    );

    // 9. Inverte: fundo preto e desenho claro.
    const finalData = context.getImageData(0, 0, 28, 28);
    pixels = [];

    for (let i = 0; i < finalData.data.length; i += 4) {
        const gray = finalData.data[i];
        const inverted = 255 - gray;
        pixels.push(inverted / 255);
    }

    // 10. Atualiza a visualização ampliada.
    const preparedContext = preparedImagePreview.getContext("2d");

    preparedContext.clearRect(0, 0, 28, 28);
    preparedContext.imageSmoothingEnabled = false;
    preparedContext.drawImage(imageCanvas, 0, 0);

    preparedImagePreview.style.width = "280px";
    preparedImagePreview.style.height = "280px";
    preparedImagePreview.style.imageRendering = "pixelated";
    preparedImageContainer.hidden = false;

    statusMessage.textContent =
        `Imagem preparada: ${pixels.length} pixels.`;

    console.log("Quantidade de pixels:", pixels.length);
    console.log("Menor valor:", Math.min(...pixels));
    console.log("Maior valor:", Math.max(...pixels));

    classifyButton.disabled = pixels.length !== 784;
};

    imagePreview.src = imageUrl;
    imagePreview.hidden = false;
});


classifyButton.addEventListener("click", async function () {
    statusMessage.textContent = "Classificando imagem...";
    classifyButton.disabled = true;

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pixels: pixels
            })
        });

        if (!response.ok) {
            throw new Error(`Erro da API: ${response.status}`);
        }

        const data = await response.json();


document.getElementById("result").hidden = false;
document.getElementById("prediction").textContent = data.prediction;

const probabilitiesContainer = document.getElementById("probabilities");
probabilitiesContainer.innerHTML = "";

data.probabilities.forEach((probability, digit) => {
    const row = document.createElement("div");
    row.className = "probability-row";

    const label = document.createElement("span");
    label.className = "probability-label";
    label.textContent = digit;

    const track = document.createElement("div");
    track.className = "probability-track";

    const bar = document.createElement("div");
    bar.className = "probability-bar";
    bar.style.width = `${probability * 100}%`;

    const value = document.createElement("span");
    value.className = "probability-value";
    value.textContent = `${(probability * 100).toFixed(1)}%`;

    track.appendChild(bar);
    row.append(label, track, value);
    probabilitiesContainer.appendChild(row);
});

statusMessage.textContent = "Classificação concluída!";

    } catch (error) {
        console.error("Erro ao classificar:", error);
        statusMessage.textContent =
            "Não foi possível classificar. Verifique a API e tente novamente.";
    } finally {
        classifyButton.disabled = pixels.length !== 784;
    }
});
