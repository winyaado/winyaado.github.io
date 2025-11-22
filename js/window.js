document.addEventListener("DOMContentLoaded", () => {

    let topZIndex = 100;

    function bringToFront(win) {
        topZIndex++;
        win.style.zIndex = topZIndex;
    }

    document.querySelectorAll(".icon").forEach(icon => {
        icon.addEventListener("click", () => {
            const targetId = icon.dataset.window;
            const win = document.getElementById(targetId);
            if (win) {
                win.style.display = "block";
                bringToFront(win);
            }
        });
    });

    document.querySelectorAll(".win32-window").forEach(win => {
        const titleBar = win.querySelector(".title-bar");
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        // 最前面へ
        win.addEventListener("mousedown", () => bringToFront(win));

        // --- ドラッグ移動 ---
        titleBar.addEventListener("mousedown", (e) => {
            bringToFront(win); // ここでも前面へ！
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            win.style.left = (e.clientX - offsetX) + "px";
            win.style.top = (e.clientY - offsetY) + "px";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
        });

        // --- 閉じる ---
        win.querySelector(".close").addEventListener("click", () => {
            win.style.display = "none";
        });

    });

});
