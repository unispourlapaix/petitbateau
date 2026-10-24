/* Carnet de navigation : papier, encre et instruments gravés au pixel. */
(() => {
    'use strict';
    const sheets = new Map();
    function icon(ctx, name, x, y, size, color = '#344d55') {
        const patterns = {
            anchor: [ '000001100000','000011110000','000010010000','000011110000','000001100000','001111111100','000001100000','110001100011','110001100011','011001100110','001111111100','000011110000' ],
            quill: [ '000000001111','000000011111','000000111110','000001111100','000011101100','000111011000','001110110000','001101100000','001011000000','000110000000','001100000000','011000000000' ],
            compass: [ '000001100000','000001100000','000011110000','000011110000','001111111100','111111111111','111111111111','001111111100','000011110000','000011110000','000001100000','000001100000' ],
            ink: [ '000111111000','000111111000','000011110000','000011110000','001111111100','011111111110','011100001110','011100001110','011111111110','011111111110','011111111110','001111111100' ]
        };
        const pattern = patterns[name] || patterns.compass;
        const unit = size / 12;
        ctx.save(); ctx.fillStyle = color;
        for (let row = 0; row < 12; row++) for (let col = 0; col < 12; col++) {
            if (pattern[row][col] === '1') ctx.fillRect(Math.round(x + col * unit), Math.round(y + row * unit), Math.ceil(unit), Math.ceil(unit));
        }
        if (name === 'compass') {
            ctx.fillStyle = '#b25342';
            ctx.fillRect(Math.round(x + 5 * unit), Math.round(y + 2 * unit), Math.ceil(2 * unit), Math.ceil(4 * unit));
            ctx.fillStyle = '#ecd9ad';
            ctx.fillRect(Math.round(x + 5 * unit), Math.round(y + 6 * unit), Math.ceil(2 * unit), Math.ceil(4 * unit));
        }
        ctx.restore();
    }
    function paper(ctx, x, y, width, height) {
        const w = Math.ceil(width), h = Math.ceil(height), key = `${w}:${h}`;
        if (!sheets.has(key)) {
            const sheet = document.createElement('canvas'); sheet.width = w; sheet.height = h;
            const g = sheet.getContext('2d');
            g.fillStyle = '#f2e5c9'; g.fillRect(0, 0, w, h);
            // Fibres et petites inclusions stables : aucun bruit animé.
            for (let yy = 0; yy < h; yy += 3) for (let xx = 0; xx < w; xx += 3) {
                const n = (xx * 73 + yy * 137 + xx * yy) % 97;
                g.fillStyle = n < 22 ? 'rgba(120,88,48,.06)' : 'rgba(255,252,224,.16)';
                g.fillRect(xx, yy, n < 12 ? 2 : 1, 1);
            }
            g.strokeStyle = '#b69a70'; g.lineWidth = 1;
            g.strokeRect(2.5, 2.5, w - 5, h - 5);
            g.strokeStyle = 'rgba(137,108,69,.4)'; g.strokeRect(7.5, 7.5, w - 15, h - 15);
            for (let yy = 84; yy < h - 25; yy += 27) {
                g.fillStyle = 'rgba(75,105,112,.065)'; g.fillRect(15, yy, w - 30, 1);
            }
            g.globalAlpha = .07;
            icon(g, 'compass', w - 126, h - 162, 96);
            g.globalAlpha = .16;
            icon(g, 'anchor', 19, h - 40, 21);
            icon(g, 'quill', w - 42, h - 42, 23);
            if (sheets.size >= 4) sheets.clear();
            sheets.set(key, sheet);
        }
        ctx.save();
        ctx.shadowColor = 'rgba(20,32,37,.4)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
        ctx.drawImage(sheets.get(key), x, y, width, height);
        ctx.restore();
    }
    let resetButton = null;
    let resetLayout = '';
    function hideReset() { if (resetButton) resetButton.hidden = true; }
    function showReset(canvas, C, bounds, onReset, label) {
        if (!resetButton) {
            resetButton = document.createElement('button');
            resetButton.type = 'button';
            resetButton.className = 'navigation-reset';
            resetButton.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M6 8H3V3M3 8l4-4h9l5 5v8l-5 4H8l-4-4v-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"/></svg>';
            document.body.appendChild(resetButton);
        }
        resetButton.onclick = onReset;
        resetButton.setAttribute('aria-label', label);
        const key = [C.W, C.H, bounds.x, bounds.y, window.innerWidth, window.innerHeight].join(':');
        if (key !== resetLayout) {
            const rect = canvas.getBoundingClientRect();
            resetButton.style.left = (rect.left + bounds.x * rect.width / C.W) + 'px';
            resetButton.style.top = (rect.top + bounds.y * rect.height / C.H) + 'px';
            resetButton.style.width = (44 * rect.width / C.W) + 'px';
            resetButton.style.height = (44 * rect.height / C.H) + 'px';
            resetLayout = key;
        }
        resetButton.hidden = false;
    }
    window.NavigationMenu = { paper, icon, showReset, hideReset };
})();
