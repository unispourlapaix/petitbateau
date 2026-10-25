/* Pixel art original : palette limitée, tramage stable, sprites mis en cache. */
(() => {
    'use strict';
    const cache = new Map();
    let seaFrame = null, seaFrameKey = "";
    const palettes = {
        day: ['#367e98', '#4c93a5', '#6daab0', '#9bc5be', '#d3dbc0'],
        night: ['#121e38', '#192b47', '#223c55', '#31566a', '#517a86'],
        sunset: ['#3a3857', '#76516b', '#ae7076', '#d99a83', '#edd0a0']
    };
    const dot = (g, color, x, y, w = 1, h = 1) => {
        g.fillStyle = color; g.fillRect(Math.floor(x), Math.floor(y), w, h);
    };
    const noise = (x, y) => ((x * 73 + y * 151 + (x * y * 13)) % 101) / 101;
    function surface(key, w, h, paint) {
        if (!cache.has(key)) {
            const c = document.createElement('canvas'); c.width = w; c.height = h;
            paint(c.getContext('2d'), w, h);
            if (cache.size > 8) cache.clear();
            cache.set(key, c);
        }
        return cache.get(key);
    }
    function blit(ctx, image, x, y, w, h) {
        ctx.save(); ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, Math.round(x), Math.round(y), w, h); ctx.restore();
    }
    window.PixelArt = {
        background(ctx, C, period, finale) {
            const theme = finale ? 'sunset' : period === 'jour' ? 'day' : 'night';
            const w = Math.ceil(C.W / 3), h = Math.ceil(C.H / 3);
            const img = surface(`sky:${theme}:${w}:${h}`, w, h, (g) => {
                const p = palettes[theme];
                for (let y = 0; y < h; y++) {
                    const band = y / h * 4;
                    for (let x = 0; x < w; x++) {
                        const level = Math.min(4, Math.floor(band) + (noise(x, y) < band % 1 * .4 ? 1 : 0));
                        dot(g, p[level], x, y);
                    }
                }
                // Îles lointaines en plusieurs plans, sous la zone de lecture.
                for (let layer = 0; layer < 2; layer++) {
                    for (let x = 0; x < w; x++) {
                        const ridge = Math.sin(x * .035 + layer * 2) * 6 + Math.sin(x * .083) * 3;
                        const y = h - 27 + layer * 6 - Math.floor(Math.max(0, ridge));
                        dot(g, theme === 'day' ? ['#689a9d', '#487f8a'][layer] : ['#293e57', '#20344c'][layer], x, y, 1, h - y);
                    }
                }
                if (theme === 'night') for (let i = 0; i < 35; i++) {
                    dot(g, i % 3 ? '#8aa9b7' : '#f3e6bc', (i * 61 + 19) % w, (i * 37 + 8) % Math.max(1, h - 70));
                }
            });
            blit(ctx, img, 0, 0, C.W, C.H);
        },
        sky(ctx, C, period, sunrise, sun, broken, total) {
            const day = period === 'jour', t = Date.now();
            const progress = sunrise.active ? Math.min(1, (t - sunrise.debut) / sunrise.duree) : 1;
            const cx = Math.round(C.W * .8 / 3), cy = Math.round(C.H * (sunrise.active ? .9 - .75 * progress : .15) / 3);
            const radius = Math.max(3, Math.round(Math.min(C.W, C.H) * .06 / 3));
            ctx.save(); ctx.scale(3, 3);
            if (day) {
                const wink = (sun.clignotement && t - sun.tempsClignotement < 2000) || t % 6200 < 180;
                if (sun.clignotement && t - sun.tempsClignotement >= 2000) sun.clignotement = false;
                const happy = broken > 0 || broken >= total;
                const face = surface(`sun:${wink}:${happy}`, 40, 40, g => {
                    // Rayons courts et arrondis en marches, comme des petits pétales.
                    const rays = [[18, 0, 4, 5], [18, 35, 4, 5], [0, 18, 5, 4], [35, 18, 5, 4],
                        [5, 5, 4, 4], [31, 5, 4, 4], [5, 31, 4, 4], [31, 31, 4, 4]];
                    for (const [x, y, w, h] of rays) {
                        dot(g, '#e9ad59', x, y, w, h);
                        dot(g, '#ffe6a0', x + 1, y, Math.max(1, w - 2), Math.max(1, h - 1));
                    }
                    // Disque doré, ombre miel et lumière vanille.
                    for (let y = -12; y <= 12; y++) for (let x = -12; x <= 12; x++) {
                        const d = x * x + y * y;
                        if (d > 150) continue;
                        const rim = d > 121;
                        dot(g, rim ? '#db9a4d' : y > 7 || x > 8 ? '#f1bb62' : y < -5 ? '#ffe8a5' : '#ffda83', 20 + x, 20 + y);
                    }
                    dot(g, '#fff0bc', 13, 12, 5, 2);
                    dot(g, '#fff0bc', 11, 14, 2, 3);
                    // Yeux chocolat avec petits points de lumière.
                    if (wink) {
                        dot(g, '#735344', 13, 19, 4, 1);
                        dot(g, '#735344', 14, 18, 2, 1);
                    } else {
                        dot(g, '#735344', 14, 17, 3, 5);
                        dot(g, '#fff4d1', 14, 17, 1, 2);
                    }
                    dot(g, '#735344', 24, 17, 3, 5);
                    dot(g, '#fff4d1', 24, 17, 1, 2);
                    // Joues pêche et sourire en escalier, visible dès le début.
                    dot(g, '#ec9b79', 10, 23, 5, 2);
                    dot(g, '#ec9b79', 26, 23, 5, 2);
                    dot(g, '#f5b68b', 11, 23, 3, 1);
                    dot(g, '#f5b68b', 27, 23, 3, 1);
                    dot(g, '#a2684c', 17, 24, 1, 2);
                    dot(g, '#a2684c', 24, 24, 1, 2);
                    dot(g, '#a2684c', 18, 26, 6, 1);
                    if (happy) {
                        dot(g, '#a2684c', 19, 27, 4, 1);
                        dot(g, '#ed9e80', 19, 26, 4, 1);
                    }
                });
                const diameter = Math.max(30, radius * 4);
                // Balancement discret sur la grille : aucune nouvelle texture par image.
                const bob = Math.round(Math.sin(t / 1100));
                blit(ctx, face, cx - diameter / 2, cy - diameter / 2 + bob, diameter, diameter);
            } else {
                for (let y = -radius; y <= radius; y++) for (let x = -radius; x <= radius; x++) {
                    if (x * x + y * y > radius * radius) continue;
                    if ((x + radius * .45) ** 2 + (y - radius * .25) ** 2 < radius * radius * .75) continue;
                    dot(ctx, '#d9e8ce', cx + x, cy + y);
                }
            }
            // Nuages en strates : silhouettes nettes, ombre mauve et lumière crème.
            for (let i = 0; i < 4; i++) {
                const width = C.W / 3;
                const x = ((i * width * .31 + t / 2600 * (i % 2 ? 1 : .6)) % (width + 60)) - 40;
                const y = C.H / 3 * (.2 + i * .11);
                dot(ctx, day ? '#8bb5b7' : '#304960', x, y + 5, 38, 3);
                dot(ctx, day ? '#cad8c5' : '#405c70', x + 3, y + 2, 30, 4);
                dot(ctx, day ? '#e7e5cc' : '#526e80', x + 10, y - 1, 14, 4);
                dot(ctx, day ? '#f1ead2' : '#627c89', x + 13, y - 2, 8, 2);
            }
            ctx.restore();
        },
        sea(ctx, C, period) {
            const night = period !== 'jour', tick = Math.floor(Date.now() / 160);
            const width = Math.max(1, Math.ceil(C.W));
            const key = `${width}:${night}:${tick}`;
            if (!seaFrame) seaFrame = document.createElement('canvas');
            if (key !== seaFrameKey) {
                if (seaFrame.width !== width || seaFrame.height !== 60) {
                    seaFrame.width = width; seaFrame.height = 60;
                }
                const g = seaFrame.getContext('2d');
                const colors = night ? ['#294b63','#203d57','#182f48','#12263d'] : ['#4d9ba3','#357f92','#286679','#204e68'];
                for (let row = 0; row < 4; row++) {
                    g.fillStyle = colors[row]; g.fillRect(0, row * 15, width, 15);
                }
                for (let row = 0; row < 7; row++) {
                    const offset = ((tick * (row % 2 ? 1 : -1) + row * 8) % 20 + 20) % 20 * 2;
                    for (let x = -80; x < width + 40; x += 40) {
                        const py = row * 8 + Math.floor(Math.sin(x * .04 + tick * .2 + row) * 2) * 2;
                        dot(g, night ? '#507c90' : '#93d1c6', x + offset, py, 16, 2);
                        dot(g, night ? '#365c76' : '#61afa9', x + offset + 16, py + 2, 6, 2);
                    }
                }
                seaFrameKey = key;
            }
            blit(ctx, seaFrame, 0, C.H - 60, width, 60);
        },
        shark(ctx, x, y, size) {
            const fin = surface('shark-fin', 16, 20, g => {
                for (let row = 0; row < 20; row++) {
                    const left = Math.max(0, 10 - Math.floor(row * .5));
                    const right = Math.min(15, 10 + Math.floor(row * .2));
                    dot(g, '#192d40', left, row, right - left + 1, 1);
                    if (right - left > 2) dot(g, '#426376', left + 1, row, right - left - 1, 1);
                }
                dot(g, '#63808b', 9, 5, 1, 7);
            });
            const height = Math.max(8, Math.round(size * 1.8 / 2) * 2);
            const width = Math.max(6, Math.round(height * .8 / 2) * 2);
            const px = Math.round((x - width / 2) / 2) * 2, py = Math.round((y - size) / 2) * 2;
            blit(ctx, fin, px, py, width, height);
            dot(ctx, '#6d939d', px - 6, py + height, width + 8, 2);
            dot(ctx, '#426b80', px - 12, py + height + 2, 8, 2);
        },
        boat(ctx, r, C, secret, time = Date.now()) {
            const sprite = surface(`boat:${secret}`, 64, 64, (g) => {
                // Voile tissée : silhouette en marches et coutures ombrées.
                for (let y = 4; y < 47; y++) {
                    const left = 31 - Math.floor((y - 4) * .52);
                    for (let x = left; x < 32; x++) {
                        const edge = x === left || y === 46;
                        dot(g, edge ? '#aa9a7b' : (x + y * 2) % 9 === 0 ? '#d4c8a6' : x > 27 ? '#ddd0ac' : '#fff0cc', x, y);
                    }
                }
                dot(g, '#483b3d', 32, 3, 2, 48);
                dot(g, '#b88855', 32, 4, 1, 45);
                dot(g, '#a83745', 34, 4, 9, 3); dot(g, '#ef7856', 34, 4, 6, 1);
                dot(g, '#48353c', 3, 49, 58, 3);
                for (let y = 52; y < 63; y++) {
                    const inset = Math.floor((y - 52) * .75);
                    for (let x = 5 + inset; x < 59 - inset; x++) {
                        const seam = y % 4 === 2;
                        const color = secret ? (seam ? '#254456' : '#56859a') : seam ? '#8e303f' : y < 56 ? '#df5c50' : '#b93c48';
                        dot(g, noise(x, y) > .89 ? (secret ? '#87a9ad' : '#f18a62') : color, x, y);
                    }
                }
                dot(g, secret ? '#95b9bb' : '#ffb078', 5, 52, 53, 1);
                for (let x = 17; x < 50; x += 13) {
                    dot(g, '#efd09a', x, 54, 5, 5); dot(g, '#263b50', x + 1, 55, 3, 3);
                    dot(g, '#8fc3bf', x + 1, 55);
                }
            });
            const height = C.PH * 4.8;
            blit(ctx, sprite, r.x, r.y + C.PH - height, C.PW, height);
            for (let i = 0; i < 3; i++) {
                const shift = Math.floor(Math.sin(time / 240 + i) * 3) * 2;
                dot(ctx, ['#c3e3cd','#86b8b3','#65999e'][i], r.x - 5 + shift - i * 3, r.y + C.PH + 4 + i * 5, C.PW + 10 + i * 6, 2);
            }
        }
    };
})();
