document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("pixelCanvas");

    const SIZE = 50; // 50x50
    const TOTAL = SIZE * SIZE;

    let marked = 0;
    let paletteCount = {
        dmc3000: 0,
        dmc3001: 0,
        dmc3002: 0,
        dmc3003: 0,
        dmc3004: 0,
    };

    const progressPercent = document.getElementById("progressPercent");
    const markedCount = document.getElementById("markedCount");
    const remainingCount = document.getElementById("remainingCount");

    /** Генерация схемы — пример, генерирует случайные цвета */
    const colors = ["#ff0000", "#ff66cc", "#008000", "#006400", "#8b4513"];
    const colorToId = {
        "#ff0000": "dmc3000",
        "#ff66cc": "dmc3001",
        "#008000": "dmc3002",
        "#006400": "dmc3003",
        "#8b4513": "dmc3004"
    };

    function createCanvas() {
        for (let i = 0; i < TOTAL; i++) {
            const pixel = document.createElement("div");
            const color = colors[Math.floor(Math.random() * colors.length)];

            pixel.classList.add("pixel");
            pixel.dataset.color = color;
            pixel.dataset.id = colorToId[color];
            pixel.style.background = color;

            pixel.addEventListener("click", () => togglePixel(pixel));

            canvas.appendChild(pixel);
        }
    }

    /** Отметка пикселя */
    function togglePixel(pixel) {
        const colorId = pixel.dataset.id;

        if (pixel.classList.contains("marked")) {
            pixel.classList.remove("marked");
            marked--;
            paletteCount[colorId]--;
        } else {
            pixel.classList.add("marked");
            marked++;
            paletteCount[colorId]++;
        }

        updateProgress();
        updatePalette();
    }

    function updateProgress() {
        markedCount.textContent = marked;
        remainingCount.textContent = TOTAL - marked;
        progressPercent.textContent = ((marked / TOTAL) * 100).toFixed(1);
    }

    function updatePalette() {
        for (let key in paletteCount) {
            const el = document.getElementById("count-" + key);
            if (el) el.textContent = paletteCount[key];
        }
    }

    createCanvas();
});
