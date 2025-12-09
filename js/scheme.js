// document.addEventListener("DOMContentLoaded", () => {

//     const canvas = document.getElementById("pixelCanvas");

//     const SIZE = 50; // 50x50
//     const TOTAL = SIZE * SIZE;

//     let marked = 0;
//     let paletteCount = {
//         dmc3000: 0,
//         dmc3001: 0,
//         dmc3002: 0,
//         dmc3003: 0,
//         dmc3004: 0,
//     };

//     const progressPercent = document.getElementById("progressPercent");
//     const markedCount = document.getElementById("markedCount");
//     const remainingCount = document.getElementById("remainingCount");

//     /** Генерация схемы — пример, генерирует случайные цвета */
//     const colors = ["#ff0000", "#ff66cc", "#008000", "#006400", "#8b4513"];
//     const colorToId = {
//         "#ff0000": "dmc3000",
//         "#ff66cc": "dmc3001",
//         "#008000": "dmc3002",
//         "#006400": "dmc3003",
//         "#8b4513": "dmc3004"
//     };

//     function createCanvas() {
//         for (let i = 0; i < TOTAL; i++) {
//             const pixel = document.createElement("div");
//             const color = colors[Math.floor(Math.random() * colors.length)];

//             pixel.classList.add("pixel");
//             pixel.dataset.color = color;
//             pixel.dataset.id = colorToId[color];
//             pixel.style.background = color;

//             pixel.addEventListener("click", () => togglePixel(pixel));

//             canvas.appendChild(pixel);
//         }
//     }

//     /** Отметка пикселя */
//     function togglePixel(pixel) {
//         const colorId = pixel.dataset.id;

//         if (pixel.classList.contains("marked")) {
//             pixel.classList.remove("marked");
//             marked--;
//             paletteCount[colorId]--;
//         } else {
//             pixel.classList.add("marked");
//             marked++;
//             paletteCount[colorId]++;
//         }

//         updateProgress();
//         updatePalette();
//     }

//     function updateProgress() {
//         markedCount.textContent = marked;
//         remainingCount.textContent = TOTAL - marked;
//         progressPercent.textContent = ((marked / TOTAL) * 100).toFixed(1);
//     }

//     function updatePalette() {
//         for (let key in paletteCount) {
//             const el = document.getElementById("count-" + key);
//             if (el) el.textContent = paletteCount[key];
//         }
//     }

//     createCanvas();
// });




document.addEventListener("DOMContentLoaded", () => {

    /* ======= ДАННЫЕ СХЕМЫ ======= */

    // массив цветов (2500 шт)
    // В реальном сайте он загружается с сервера.
    // Сейчас создаю рандомно из 5 цветов как на твоём фото.
    const COLORS = ["#c40000", "#ff90c8", "#006200", "#004d00", "#7b4a00"];
    const GRID_SIZE = 50;
    const TOTAL = GRID_SIZE * GRID_SIZE;

    // таблица реального количества ячеек по цвету
    let colorRealCount = {
        "#c40000": 505,
        "#ff90c8": 512,
        "#006200": 481,
        "#004d00": 497,
        "#7b4a00": 505
    };

    // счётчик отмеченных по цвету
    let colorMarked = {
        "#c40000": 0,
        "#ff90c8": 0,
        "#006200": 0,
        "#004d00": 0,
        "#7b4a00": 0
    };

    /* ======= СОЗДАЁМ ГРИД ======= */

    const grid = document.getElementById("schemeGrid");

    let markedCount = 0;

    let pixels = [];

    for (let i = 0; i < TOTAL; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        const px = document.createElement("div");
        px.className = "pixel";
        px.dataset.color = color;
        px.style.background = color;

        grid.appendChild(px);
        pixels.push(px);
    }

    /* ======= ОБНОВЛЕНИЕ СТАТИСТИКИ ======= */

    const statProgress = document.querySelector(".stats .stat-card:nth-child(1) .stat-value");
    const statMarked = document.querySelector(".stats .stat-card:nth-child(2) .stat-value");
    const statLeft = document.querySelector(".stats .stat-card:nth-child(3) .stat-value");

    function updateStats() {
        let progress = (markedCount / TOTAL * 100).toFixed(1);

        statProgress.textContent = `${progress}%`;
        statMarked.textContent = `${markedCount} / ${TOTAL}`;
        statLeft.textContent = TOTAL - markedCount;
    }

    /* ======= ОБНОВЛЕНИЕ ПАЛИТРЫ ======= */

    function updatePalette() {
        document.querySelectorAll(".palette .color-item").forEach(item => {
            const colorName = item.querySelector(".color-name").textContent;
            const colorCount = item.querySelector(".color-count");

            // достаём HEX из preview
            const col = item.querySelector(".color-preview").style.background;

            const hex = col.replace("rgb(", "").replace(")", "").split(",").map(x => +x).map((x, i) =>
                i === 0 ? "#" + ((1 << 24) + x * 65536 + 0).toString(16).slice(1, 3) : ""
            );

            // но проще: достанем через атрибут
            const bg = item.querySelector(".color-preview").style.backgroundColor;

            // конвертируем rgb → hex
            const rgb = bg.match(/\d+/g).map(Number);
            const toHex = (n) => n.toString(16).padStart(2, '0');
            const hexColor = "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);

            const real = colorRealCount[hexColor] ?? 0;
            const marked = colorMarked[hexColor] ?? 0;

            colorCount.textContent = `${marked}/${real}`;
        });
    }

    /* ======= ОБРАБОТКА КЛИКА ПО ПИКСЕЛЮ ======= */

    pixels.forEach(px => {
        px.addEventListener("click", () => {
            const col = px.dataset.color;

            if (px.classList.contains("marked")) {
                px.classList.remove("marked");
                markedCount--;
                colorMarked[col]--;
            } else {
                px.classList.add("marked");
                markedCount++;
                colorMarked[col]++;
            }

            updateStats();
            updatePalette();
        });
    });

    // первый запуск
    updateStats();
    updatePalette();

});