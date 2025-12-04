document.addEventListener("DOMContentLoaded", () => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    document.addEventListener("mousemove", e => {
        const rect = hero.getBoundingClientRect();

        // курсор НАД hero
        if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        ) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            hero.style.setProperty("--mx", x + "px");
            hero.style.setProperty("--my", y + "px");
        } else {
            // уводим маску за пределы блока
            hero.style.setProperty("--mx", "-100px");
            hero.style.setProperty("--my", "-100px");
        }
    });
});
