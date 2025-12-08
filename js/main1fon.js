document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    document.addEventListener("mousemove", e => {
        const rect = hero.getBoundingClientRect();

        // курсор ВНЕ hero — хвост НЕ создаём
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            return;
        }

        // создаём хвост внутри hero
        const dot = document.createElement("div");
        dot.className = "trail-dot";

        // координаты внутри hero
        dot.style.left = (e.clientX - rect.left) + "px";
        dot.style.top = (e.clientY - rect.top) + "px";

        hero.appendChild(dot);

        setTimeout(() => dot.remove(), 900);
    });
});

