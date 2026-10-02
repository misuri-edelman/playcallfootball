/* ============================================================
   PLAYCALL Football — 取扱説明書 / レンダリング
   ============================================================ */
(function () {
  const D = window.PC_DATA;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const C = {
    turfA: '#1B5033', turfB: '#1E5738', ez: '#0E3A22',
    chalk: '#F8F4E8', gold: '#D0A02C', red: '#AE3A2C',
    navy: '#1C3B6E', ink: '#16233A', paper: '#EFE6D2', green: '#2A7A4E'
  };

  /* ===================== 目次 ===================== */
  const sections = Array.from(document.querySelectorAll('.leaf[id], .colophon[id], .sign-off[id]'));
  const tocGrid = $('#toc-grid');
  if (tocGrid) {
    tocGrid.innerHTML = sections.map(sec => {
      const num = sec.dataset.num || '';
      const h2 = sec.querySelector('h2');
      const title = h2 ? h2.textContent.trim() : (sec.dataset.toc || 'サインオフ');
      const en = (sec.dataset.sec || '').replace(/&amp;/g, '&');
      return `<a href="#${sec.id}"><span class="n">${num}</span><span class="t">${esc(title)}</span><span class="en">${esc(en)}</span></a>`;
    }).join('');
  }
  const tocSub = document.querySelector('.toc-sub');
  if (tocSub) tocSub.textContent = `全${sections.length}章。気になる章から読み進めてください。各章はクリックで移動できます。`;

  /* ===================== 進行バー / 現在地 ===================== */
  const bar = $('#progress'), now = $('#tb-now');
  const labelOf = el => {
    const n = el.dataset.num || '00';
    const sec = (el.dataset.sec || 'COVER').replace(/&amp;/g, '&');
    return `${n} / ${sec}`;
  };
  const watch = Array.from(document.querySelectorAll('[data-sec]'));
  let ticking = false;
  function onScroll() {
    const doc = document.documentElement;
    const p = doc.scrollTop / Math.max(1, doc.scrollHeight - doc.clientHeight);
    if (bar) bar.style.width = (p * 100).toFixed(2) + '%';
    const y = window.scrollY + 140;
    let cur = watch[0];
    for (const el of watch) { if (el.offsetTop <= y) cur = el; }
    if (cur && now) now.textContent = labelOf(cur);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ===================== 試合の準備 ===================== */
  const lenStrip = $('#len-strip');
  if (lenStrip) {
    const opts = [
      ['SHORT', '短め', 'プレー数が少なく、1枚の判断が重い。集中力の勝負。'],
      ['STANDARD', '標準', '手札の消費と回復のリズムが最もよく見える長さ。'],
      ['LONG', '長め', '枚数が尽きる局面まで到達し、終盤の読みが効いてくる。']
    ];
    lenStrip.innerHTML = opts.map(o => `
      <div class="ds">
        <b>${o[0]}</b>
        <span style="display:block;color:var(--ink);font-family:var(--f-jp);font-size:14px;font-weight:700;letter-spacing:0;text-transform:none;margin-top:2px">${o[1]}</span>
        <em style="display:block;font-style:normal;font-size:12.5px;line-height:1.7;color:var(--ink-3);margin-top:6px">${o[2]}</em>
      </div>`).join('');
  }
  const driveStrip = $('#drive-strip');
  if (driveStrip) {
    const opts = [
      ['OFFENSE FIRST', 'オフェンスから', '自分からカードを切る。主導権はあるが、手札も早く減る。'],
      ['DEFENSE FIRST', 'ディフェンスから', '相手の出方を見てから、最初の1枚を選べる。'],
      ['COIN TOSS', 'コイントス', 'ランダムに決まる。試合ごとに条件が変わる。']
    ];
    driveStrip.innerHTML = opts.map(o => `
      <div class="ds">
        <b style="font-size:11.5px">${o[0]}</b>
        <span style="display:block;color:var(--ink);font-family:var(--f-jp);font-size:14px;font-weight:700;letter-spacing:0;text-transform:none;margin-top:2px">${o[1]}</span>
        <em style="display:block;font-style:normal;font-size:12.5px;line-height:1.7;color:var(--ink-3);margin-top:6px">${o[2]}</em>
      </div>`).join('');
  }

  /* ===================== 図1 フロー ===================== */
  const flow = $('#flow-diagram');
  if (flow) {
    const W = 1040, H = 210;
    const steps = [
      ['START', '試合を開く', 'index.html をブラウザで開く'],
      ['SETUP', '2つを選ぶ', '試合の長さ / 最初のドライブ'],
      ['KICKOFF', '試合開始', '最初のドライブが決まる'],
      ['1ST PLAY', 'カードを選ぶ', 'ここから読み合いが始まる']
    ];
    const bw = 216, gap = (W - 40 - bw * 4) / 3;
    let s = '';
    steps.forEach((st, i) => {
      const x = 20 + i * (bw + gap);
      s += `<rect x="${x}" y="52" width="${bw}" height="94" fill="${i === 3 ? C.turfA : '#FFFCF3'}" stroke="${i === 3 ? C.turfA : 'rgba(22,35,58,.22)'}" stroke-width="1.5"/>`;
      s += `<rect x="${x}" y="52" width="${bw}" height="22" fill="${i === 3 ? C.gold : C.navy}"/>`;
      s += `<text x="${x + 10}" y="67" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="2.6" fill="${i === 3 ? C.ink : C.chalk}">${st[0]}</text>`;
      s += `<text x="${x + 12}" y="98" font-family="Zen Kaku Gothic New,sans-serif" font-size="16" font-weight="700" fill="${i === 3 ? C.chalk : C.ink}">${esc(st[1])}</text>`;
      s += `<text x="${x + 12}" y="122" font-family="Zen Kaku Gothic New,sans-serif" font-size="12.5" fill="${i === 3 ? 'rgba(248,244,232,.75)' : '#77839A'}">${esc(st[2])}</text>`;
      s += `<text x="${x + bw - 14}" y="140" text-anchor="end" font-family="Big Shoulders Display,sans-serif" font-size="30" font-weight="900" fill="${i === 3 ? 'rgba(248,244,232,.30)' : 'rgba(28,59,110,.16)'}">0${i + 1}</text>`;
      if (i < 3) {
        const ax = x + bw + 6, ay = 99;
        s += `<path d="M${ax} ${ay} L${ax + gap - 14} ${ay}" stroke="${C.navy}" stroke-width="2" marker-end="url(#arw)"/>`;
      }
    });
    s = `<defs><marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${C.navy}"/></marker></defs>` + s;
    s += `<text x="20" y="34" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#A2761A">MATCH FLOW</text>`;
    s += `<line x1="20" y1="42" x2="${W - 20}" y2="42" stroke="rgba(22,35,58,.15)"/>`;
    flow.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="試合開始までの流れ">${s}</svg>`;
  }

  /* ===================== 図2 フィールド全体 ===================== */
  const fieldEl = $('#field-diagram');
  if (fieldEl) fieldEl.innerHTML = fieldSVG();

  function fieldSVG() {
    const W = 1080, H = 500, pad = 18, ez = 56;
    const fx = pad + ez, fw = W - 2 * (pad + ez);
    const px = y => fx + (y / 100) * fw;
    const fy0 = 84, fy1 = 386, fh = fy1 - fy0;
    const los = 34, fd = 44;
    let s = '';

    s += `<rect x="${pad}" y="${fy0}" width="${ez}" height="${fh}" fill="${C.ez}"/>`;
    s += `<rect x="${W - pad - ez}" y="${fy0}" width="${ez}" height="${fh}" fill="${C.ez}"/>`;
    s += `<text x="${pad + ez / 2}" y="${(fy0 + fy1) / 2}" transform="rotate(-90 ${pad + ez / 2} ${(fy0 + fy1) / 2})" text-anchor="middle" font-family="Graduate,serif" font-size="15" letter-spacing="4" fill="rgba(248,244,232,.42)">END ZONE</text>`;
    s += `<text x="${W - pad - ez / 2}" y="${(fy0 + fy1) / 2 + 4}" text-anchor="middle" font-family="Big Shoulders Display,sans-serif" font-size="26" font-weight="900" letter-spacing="2" fill="rgba(248,244,232,.30)">TD</text>`;

    for (let i = 0; i < 20; i++) {
      s += `<rect x="${fx + i * fw / 20}" y="${fy0}" width="${fw / 20}" height="${fh}" fill="${i % 2 ? C.turfA : C.turfB}"/>`;
    }
    for (let yd = 0; yd <= 100; yd += 5) {
      const x = px(yd), isTen = yd % 10 === 0;
      s += `<line x1="${x}" y1="${fy0}" x2="${x}" y2="${fy1}" stroke="rgba(248,244,232,${isTen ? .78 : .30})" stroke-width="${isTen ? 2 : 1}"/>`;
    }
    for (let yd = 10; yd <= 90; yd += 10) {
      const n = yd <= 50 ? yd : 100 - yd;
      if (yd !== 50) {
        s += `<text x="${px(yd)}" y="${fy0 + 22}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="12" fill="rgba(248,244,232,.55)">${n}</text>`;
        s += `<text x="${px(yd)}" y="${fy1 - 12}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="12" fill="rgba(248,244,232,.55)">${n}</text>`;
      }
    }
    s += `<text x="${px(50)}" y="${(fy0 + fy1) / 2 + 10}" text-anchor="middle" font-family="Big Shoulders Display,sans-serif" font-size="44" font-weight="900" fill="rgba(248,244,232,.22)">50</text>`;
    s += `<rect x="${fx}" y="${fy0}" width="${fw}" height="${fh}" fill="none" stroke="rgba(248,244,232,.85)" stroke-width="3"/>`;

    /* ライン・オブ・スクリメージ */
    s += `<line x1="${px(los)}" y1="${fy0 - 10}" x2="${px(los)}" y2="${fy1 + 10}" stroke="${C.chalk}" stroke-width="3.5"/>`;
    s += `<text x="${px(los)}" y="${fy0 - 18}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="${C.chalk}">LOS / 3rd &amp; 4</text>`;
    /* ファーストダウン更新線 */
    s += `<line x1="${px(fd)}" y1="${fy0 - 10}" x2="${px(fd)}" y2="${fy1 + 10}" stroke="${C.gold}" stroke-width="3" stroke-dasharray="10 7"/>`;
    s += `<text x="${px(fd) + 8}" y="${fy1 + 34}" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="#A2761A">1ST DOWN 更新線</text>`;

    /* 守備 X */
    const X = (x, y) => `<path d="M${x - 7} ${y - 7} L${x + 7} ${y + 7} M${x + 7} ${y - 7} L${x - 7} ${y + 7}" stroke="#F2EAD6" stroke-width="3" stroke-linecap="round"/>`;
    /* 攻撃 O */
    const O = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${C.gold}" stroke-width="3"/>`;

    const lx = px(los), cy = (fy0 + fy1) / 2;
    /* DL */
    [0, 1, 2, 3].forEach(i => { s += X(lx + 24 + i * 22, cy - 40 + i * 27); });
    /* LB */
    [0, 1, 2].forEach(i => { s += X(lx + 100 + i * 10, cy - 46 + i * 46); });
    /* CB */
    s += X(lx + 34, fy0 + 34); s += X(lx + 34, fy1 - 34);
    /* S */
    s += X(lx + 172, cy - 52); s += X(lx + 172, cy + 52);

    /* 攻撃陣形 */
    [-30, -15, 0, 15, 30].forEach(dx => { s += O(lx - 20 + dx, cy + 22); });
    s += O(lx - 62, cy + 50);
    s += O(lx - 104, cy + 50);
    s += O(lx - 12, fy0 + 34);
    s += O(lx + 14, cy - 6);

    /* ドライブ矢印 */
    s += `<path d="M${px(30)} ${fy1 + 16} L${px(74)} ${fy1 + 16}" stroke="${C.red}" stroke-width="3" stroke-dasharray="8 6" marker-end="url(#arw2)"/>`;
    s += `<text x="${px(52)}" y="${fy1 + 46}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="1.6" fill="${C.red}">DRIVE の向き</text>`;
    s += `<defs><marker id="arw2" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="${C.red}"/></marker></defs>`;

    /* 凡例 */
    s += `<g transform="translate(20,${H - 26})">`;
    s += `<path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="#3D4E68" stroke-width="3" stroke-linecap="round"/>`;
    s += `<text x="16" y="5" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="#3D4E68">守備（X）</text>`;
    s += `<circle cx="128" cy="0" r="8" fill="none" stroke="#A2761A" stroke-width="3"/><text x="146" y="5" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="#3D4E68">攻撃（O）</text>`;
    s += `<line x1="248" y1="-9" x2="248" y2="9" stroke="#3D4E68" stroke-width="3.5"/><text x="260" y="5" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="#3D4E68">LOS</text>`;
    s += `<line x1="316" y1="-9" x2="316" y2="9" stroke="#A2761A" stroke-width="3" stroke-dasharray="7 5"/><text x="330" y="5" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.4" fill="#3D4E68">更新線</text>`;
    s += `</g>`;

    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="フィールド全体図">${s}</svg>`;
  }

  /* ===================== 図3 ダウンの推移 ===================== */
  const downEl = $('#down-diagram');
  if (downEl) downEl.innerHTML = downSVG();

  function downSVG() {
    const W = 1040, panels = [
      { label: '1st & 10', from: 30, gain: 2, play: 'POWER RUN', next: '2nd & 8', x: 32 },
      { label: '2nd & 8', from: 32, gain: 0, play: 'SCREEN PASS', next: '3rd & 8', x: 32 },
      { label: '3rd & 8', from: 32, gain: 12, play: 'PLAY ACTION', next: '1st & 10', x: 44 },
      { label: '1st & 10', from: 44, gain: 0, play: '— 更新 —', next: '継続', x: 44 }
    ];
    const win0 = 22, win1 = 56;
    const rowH = 104, top = 44;
    const H = top + panels.length * rowH + 14;
    const bx0 = 150, bw = W - bx0 - 150;
    const px = y => bx0 + (y - win0) / (win1 - win0) * bw;
    let s = `<text x="14" y="26" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#A2761A">DOWN BY DOWN</text>`;
    s += `<line x1="14" y1="34" x2="${W - 14}" y2="34" stroke="rgba(22,35,58,.15)"/>`;

    panels.forEach((p, i) => {
      const y = top + i * rowH;
      const fh = 52;
      s += `<text x="14" y="${y + 30}" font-family="Big Shoulders Display,sans-serif" font-size="19" font-weight="800" fill="${C.navy}">${p.label}</text>`;
      s += `<text x="14" y="${y + 48}" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.2" fill="#77839A">${p.play}</text>`;

      s += `<rect x="${bx0}" y="${y + 6}" width="${bw}" height="${fh}" fill="#1B5033"/>`;
      for (let k = 0; k < 8; k++) s += `<rect x="${bx0 + k * bw / 8}" y="${y + 6}" width="${bw / 8}" height="${fh}" fill="${k % 2 ? '#1B5033' : '#1E5738'}"/>`;
      for (let yd = win0; yd <= win1; yd += 5) {
        const x = px(yd);
        s += `<line x1="${x}" y1="${y + 6}" x2="${x}" y2="${y + 6 + fh}" stroke="rgba(248,244,232,${yd % 10 === 0 ? .6 : .25})" stroke-width="${yd % 10 === 0 ? 1.6 : 1}"/>`;
        if (yd % 10 === 0) s += `<text x="${x}" y="${y + 22}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="10" fill="rgba(248,244,232,.5)">${yd}</text>`;
      }
      /* LOS */
      s += `<line x1="${px(p.from)}" y1="${y}" x2="${px(p.from)}" y2="${y + 6 + fh + 6}" stroke="${C.chalk}" stroke-width="3"/>`;
      /* 更新線 */
      s += `<line x1="${px(p.from + 10)}" y1="${y}" x2="${px(p.from + 10)}" y2="${y + 6 + fh + 6}" stroke="${C.gold}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
      /* 獲得の矢印 */
      if (p.gain > 0) {
        s += `<path d="M${px(p.from)} ${y + fh / 2 + 6} L${px(p.from + p.gain)} ${y + fh / 2 + 6}" stroke="${C.red}" stroke-width="3" marker-end="url(#arw3)"/>`;
        s += `<text x="${(px(p.from) + px(p.from + p.gain)) / 2}" y="${y + fh / 2 - 2}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="500" fill="#FFD9CF">+${p.gain}</text>`;
      }
      /* 結果 */
      s += `<text x="${W - 14}" y="${y + 28}" text-anchor="end" font-family="Big Shoulders Display,sans-serif" font-size="18" font-weight="800" fill="${i === 2 ? C.green : '#77839A'}">${p.next}</text>`;
      s += `<text x="${W - 14}" y="${y + 46}" text-anchor="end" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.2" fill="#77839A">${i === 2 ? '更新線を越えた' : (i === 3 ? 'ドライブ続行' : '未更新')}</text>`;
      if (i < panels.length - 1) s += `<line x1="${bx0}" y1="${y + rowH - 8}" x2="${W - 14}" y2="${y + rowH - 8}" stroke="rgba(22,35,58,.10)"/>`;
    });
    s = `<defs><marker id="arw3" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${C.red}"/></marker></defs>` + s;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="ダウンの推移">${s}</svg>`;
  }

  /* ===================== 図4 判定の3ステップ ===================== */
  const resEl = $('#resolve-diagram');
  if (resEl) resEl.innerHTML = resolveSVG();
  function resolveSVG() {
    const W = 1040, H = 320;
    const cw = 300, gap = (W - 40 - cw * 3) / 2;
    const rows = D.READ.preview.slice(0, 4);
    let s = `<text x="20" y="26" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#A2761A">RESOLUTION SEQUENCE</text>`;
    s += `<line x1="20" y1="34" x2="${W - 20}" y2="34" stroke="rgba(22,35,58,.15)"/>`;
    for (let i = 0; i < 3; i++) {
      const x = 20 + i * (cw + gap), y = 58, h = 210;
      s += `<rect x="${x}" y="${y}" width="${cw}" height="${h}" fill="#FFFCF3" stroke="rgba(22,35,58,.2)" stroke-width="1.5"/>`;
      s += `<rect x="${x}" y="${y}" width="${cw}" height="26" fill="${i === 2 ? C.turfA : C.navy}"/>`;
      s += `<text x="${x + 12}" y="${y + 18}" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="2.4" fill="${C.chalk}">STEP ${i + 1}</text>`;
      s += `<text x="${x + cw - 12}" y="${y + 18}" text-anchor="end" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.6" fill="rgba(248,244,232,.7)">${['SELECT', 'PREVIEW', 'COMMIT'][i]}</text>`;
      if (i === 0) {
        s += `<rect x="${x + 26}" y="${y + 52}" width="${cw - 52}" height="96" fill="${C.green}"/>`;
        s += `<text x="${x + 40}" y="${y + 76}" font-family="Saira Condensed,sans-serif" font-size="10.5" letter-spacing="2.2" fill="rgba(255,255,255,.85)">OFFENSE</text>`;
        s += `<text x="${x + 40}" y="${y + 106}" font-family="Big Shoulders Display,sans-serif" font-size="28" font-weight="800" fill="#fff">QUICK SLANT</text>`;
        s += `<text x="${x + 40}" y="${y + 130}" font-family="Zen Kaku Gothic New,sans-serif" font-size="13" fill="rgba(255,255,255,.85)">クイック・スラント</text>`;
        s += `<text x="${x + cw / 2}" y="${y + 178}" text-anchor="middle" font-family="Zen Kaku Gothic New,sans-serif" font-size="13" fill="#3D4E68">手札から1枚をタップ／クリック</text>`;
        s += `<text x="${x + cw / 2}" y="${y + 198}" text-anchor="middle" font-family="Zen Kaku Gothic New,sans-serif" font-size="13" fill="#77839A">この時点ではまだ確定しない</text>`;
      } else if (i === 1) {
        rows.forEach((r, k) => {
          const ry = y + 44 + k * 40;
          s += `<rect x="${x + 16}" y="${ry}" width="${cw - 32}" height="32" fill="${r.s === 'g' ? 'rgba(31,93,58,.16)' : (r.s === 'e' ? 'rgba(208,160,44,.2)' : 'rgba(174,58,44,.16)')}" stroke="rgba(22,35,58,.12)"/>`;
          s += `<text x="${x + 28}" y="${ry + 21}" font-family="Saira Condensed,sans-serif" font-size="12.5" letter-spacing="1.2" fill="#3D4E68">${r.k}</text>`;
          s += `<text x="${x + cw - 30}" y="${ry + 21}" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="13" font-weight="500" fill="#16233A">${r.v >= 0 ? '+' + r.v : r.v}</text>`;
        });
        s += `<text x="${x + cw / 2}" y="${y + 202}" text-anchor="middle" font-family="Zen Kaku Gothic New,sans-serif" font-size="13" fill="#77839A">相手の残りカードごとの結果</text>`;
      } else {
        s += `<rect x="${x + 26}" y="${y + 62}" width="${cw - 52}" height="58" fill="${C.navy}"/>`;
        s += `<text x="${x + cw / 2}" y="${y + 97}" text-anchor="middle" font-family="Zen Kaku Gothic New,sans-serif" font-size="16" font-weight="700" fill="#fff">このカードでコール</text>`;
        s += `<path d="M${x + cw / 2} ${y + 132} L${x + cw / 2} ${y + 156}" stroke="#3D4E68" stroke-width="2" marker-end="url(#arw)"/>`;
        s += `<text x="${x + cw / 2}" y="${y + 178}" text-anchor="middle" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="1.6" fill="#77839A">SIMULTANEOUS REVEAL</text>`;
        s += `<text x="${x + cw / 2}" y="${y + 200}" text-anchor="middle" font-family="Zen Kaku Gothic New,sans-serif" font-size="13" fill="#3D4E68">両者のカードが同時に開く</text>`;
      }
      if (i < 2) {
        const ax = x + cw + 8, ay = y + h / 2;
        s += `<path d="M${ax} ${ay} L${ax + gap - 16} ${ay}" stroke="${C.navy}" stroke-width="2" marker-end="url(#arw)"/>`;
      }
    }
    s = `<defs><marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${C.navy}"/></marker></defs>` + s;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="判定の流れ">${s}</svg>`;
  }

  /* ===================== カードカタログ ===================== */
  const cardHTML = (c, role) => `
    <article class="pc ${role}" tabindex="0">
      <div class="pc-hint">拡大</div>
      <div class="pc-top">
        <span class="role">${role === 'off' ? 'Offense' : 'Defense'}</span>
        <span class="cnt">×${c.count}</span>
      </div>
      <div class="pc-name">${esc(c.en)}</div>
      <div class="pc-jp">${esc(c.jp)}</div>
      <div class="pc-body">
        ${esc(c.body)}
        <div class="pc-meta">${c.meta.map(m => `<span class="tag ${m.k}">${esc(m.t)}</span>`).join('')}</div>
      </div>
    </article>`;
  const offEl = $('#cards-off'), defEl = $('#cards-def');
  if (offEl) offEl.innerHTML = D.OFFENSE.map(c => cardHTML(c, 'off')).join('');
  if (defEl) defEl.innerHTML = D.DEFENSE.map(c => cardHTML(c, 'def')).join('');

  /* ===================== 相性表 ===================== */
  const mx = $('#mx-table');
  if (mx) {
    let s = '<thead><tr><th class="corner">OFF ↓ &nbsp;/&nbsp; DEF →</th>';
    D.MATRIX.cols.forEach(c => { s += `<th>${esc(c)}</th>`; });
    s += '</tr></thead><tbody>';
    D.MATRIX.rows.forEach(r => {
      s += `<tr><th>${esc(r.off)}<span style="display:block;font-family:'Zen Kaku Gothic New',sans-serif;font-size:11.5px;font-weight:500;letter-spacing:0;color:#77839A;text-transform:none">${esc(r.offJp)}</span></th>`;
      r.vals.forEach(v => {
        const V = D.VERDICT[v[1]];
        s += `<td class="${V.cls}"><span class="v">${v[0] >= 0 ? '+' + v[0] : v[0]}</span><span class="s">${V.sym}</span></td>`;
      });
      s += '</tr>';
    });
    s += '</tbody>';
    mx.innerHTML = s;
  }

  /* ===================== 読み合いの図（画面構造） ===================== */
  const rh = $('#read-hand');
  if (rh) rh.innerHTML = D.READ.myHand.map(c => `<span class="hcard ${c.state}">${esc(c.en)}</span>`).join('');
  const rl = $('#read-list');
  if (rl) rl.innerHTML = D.READ.preview.map(r => `
    <div class="read-row ${r.s}">
      <span class="rk">${esc(r.k)}</span>
      <span class="rv">${r.v >= 0 ? '+' + r.v : r.v} yd</span>
      <span class="rs">${r.vs}</span>
    </div>`).join('');

  /* ===================== 図5 残りカードの推移 ===================== */
  const readDia = $('#read-diagram');
  if (readDia) readDia.innerHTML = readSVG();
  function readSVG() {
    const W = 1040, H = 300;
    const names = ['BLITZ', 'ZONE COV.', 'MAN COV.', 'RUN STUFF', 'PREVENT'];
    const before = [2, 2, 2, 2, 1], after = [0, 2, 1, 2, 1];
    const bx = 190, bw = W - bx - 190, barH = 24, gh = 20, top = 76;
    const maxV = 2;
    const px = v => bx + v / maxV * bw;
    let s = `<text x="20" y="26" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#D0A02C">REMAINING CARDS</text>`;
    s += `<line x1="20" y1="34" x2="${W - 20}" y2="34" stroke="rgba(248,244,232,.2)"/>`;
    s += `<text x="${bx}" y="60" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.6" fill="rgba(248,244,232,.6)">ドライブ開始時</text>`;
    s += `<text x="${bx + bw}" y="60" text-anchor="end" font-family="JetBrains Mono,monospace" font-size="11.5" fill="rgba(248,244,232,.6)">0 → 1 → 2 枚</text>`;
    names.forEach((n, i) => {
      const y = top + i * (barH * 2 + gh);
      s += `<text x="20" y="${y + 17}" font-family="Big Shoulders Display,sans-serif" font-size="17" font-weight="800" fill="${after[i] === 0 ? '#F0917F' : C.chalk}">${n}</text>`;
      s += `<rect x="${bx}" y="${y}" width="${bw}" height="${barH}" fill="rgba(248,244,232,.07)"/>`;
      s += `<rect x="${bx}" y="${y}" width="${px(before[i]) - bx}" height="${barH}" fill="rgba(248,244,232,.30)"/>`;
      s += `<text x="${px(before[i]) + 10}" y="${y + 17}" font-family="JetBrains Mono,monospace" font-size="12" fill="rgba(248,244,232,.6)">${before[i]}</text>`;

      const y2 = y + barH + 7;
      s += `<rect x="${bx}" y="${y2}" width="${bw}" height="${barH - 8}" fill="rgba(248,244,232,.05)"/>`;
      s += `<rect x="${bx}" y="${y2}" width="${Math.max(0, px(after[i]) - bx)}" height="${barH - 8}" fill="${after[i] === 0 ? '#F0917F' : C.gold}"/>`;
      s += `<text x="${bx + 10}" y="${y2 + 13}" font-family="Saira Condensed,sans-serif" font-size="11" letter-spacing="1.2" fill="${after[i] === 0 ? '#F0917F' : 'rgba(13,31,60,.85)'}">${after[i] === 0 ? '使い切り — ここはもう来ない' : '残り ' + after[i] + ' 枚'}</text>`;
    });
    s += `<text x="20" y="${H - 14}" font-family="Zen Kaku Gothic New,sans-serif" font-size="12.5" fill="rgba(248,244,232,.55)">上段＝ドライブ開始時の手持ち／下段＝3プレー後の残り。消えた行が、いちばん重要な情報。</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="残りカードの推移">${s}</svg>`;
  }

  /* ===================== 図6 CPUの混合戦略 ===================== */
  const cpuDia = $('#cpu-diagram');
  if (cpuDia) cpuDia.innerHTML = cpuSVG();
  function cpuSVG() {
    const W = 1040, H = 300;
    const rows = [
      { label: '局面A', sub: '自陣・残りダウン多い', mix: [30, 30, 20, 15, 5] },
      { label: '局面B', sub: '中盤・1stダウン', mix: [22, 26, 24, 22, 6] },
      { label: '局面C', sub: '要前進・終盤', mix: [14, 20, 16, 12, 38] }
    ];
    const cols = ['BLITZ', 'ZONE', 'MAN', 'RUN STUFF', 'PREVENT'];
    const colors = ['#2A7A4E', '#D0A02C', '#7FA8D9', '#AE3A2C', '#F2EAD6'];
    const bx = 172, bw = W - bx - 150, bh = 40, gh = 34, top = 66;
    let s = `<text x="20" y="26" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#A2761A">MIXED STRATEGY</text>`;
    s += `<line x1="20" y1="34" x2="${W - 20}" y2="34" stroke="rgba(22,35,58,.15)"/>`;
    rows.forEach((r, i) => {
      const y = top + i * (bh + gh);
      s += `<text x="20" y="${y + 22}" font-family="Big Shoulders Display,sans-serif" font-size="19" font-weight="800" fill="${C.navy}">${r.label}</text>`;
      s += `<text x="20" y="${y + 40}" font-family="Zen Kaku Gothic New,sans-serif" font-size="11.5" fill="#77839A">${r.sub}</text>`;
      let acc = 0;
      r.mix.forEach((v, k) => {
        const w = v / 100 * bw;
        s += `<rect x="${bx + acc}" y="${y}" width="${w}" height="${bh}" fill="${colors[k]}"/>`;
        if (v >= 12) s += `<text x="${bx + acc + w / 2}" y="${y + 25}" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="12" font-weight="500" fill="${k === 4 ? C.ink : (k === 1 || k === 2 ? '#16233A' : '#fff')}">${v}%</text>`;
        acc += w;
      });
      s += `<rect x="${bx}" y="${y}" width="${bw}" height="${bh}" fill="none" stroke="rgba(22,35,58,.18)"/>`;
      s += `<text x="${W - 14}" y="${y + 25}" text-anchor="end" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.2" fill="#77839A">合計 100%</text>`;
    });
    /* 凡例 */
    let lx = bx, ly = H - 26;
    cols.forEach((c, k) => {
      s += `<rect x="${lx}" y="${ly - 11}" width="13" height="13" fill="${colors[k]}" stroke="rgba(22,35,58,.2)"/>`;
      s += `<text x="${lx + 19}" y="${ly}" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="1.3" fill="#3D4E68">${c}</text>`;
      lx += 26 + c.length * 7.6;
    });
    s += `<text x="20" y="${H - 26}" font-family="Zen Kaku Gothic New,sans-serif" font-size="12" fill="#77839A">出現比率の作例</text>`;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="CPUの混合戦略">${s}</svg>`;
  }

  /* ===================== 図7 保存の仕組み ===================== */
  const saveDia = $('#save-diagram');
  if (saveDia) saveDia.innerHTML = saveSVG();
  function saveSVG() {
    const W = 1040, H = 220;
    const boxes = [
      ['PLAY', 'ゲーム画面', 'プレーごとに進行状況が更新', C.navy],
      ['AUTO', 'ブラウザ内に保存', '自動で書き込まれる', C.turfA],
      ['RESUME', '「続きから」', '保存された地点から再開', C.gold]
    ];
    const bw = 268, gap = (W - 40 - bw * 3) / 2;
    let s = `<text x="20" y="26" font-family="Saira Condensed,sans-serif" font-size="12" letter-spacing="3" fill="#A2761A">SAVE &amp; RESUME</text>`;
    s += `<line x1="20" y1="34" x2="${W - 20}" y2="34" stroke="rgba(22,35,58,.15)"/>`;
    boxes.forEach((b, i) => {
      const x = 20 + i * (bw + gap), y = 62, h = 114;
      s += `<rect x="${x}" y="${y}" width="${bw}" height="${h}" fill="#FFFCF3" stroke="rgba(22,35,58,.2)" stroke-width="1.5"/>`;
      s += `<rect x="${x}" y="${y}" width="6" height="${h}" fill="${b[3]}"/>`;
      s += `<text x="${x + 20}" y="${y + 28}" font-family="Saira Condensed,sans-serif" font-size="11.5" letter-spacing="2.4" fill="#A2761A">${b[0]}</text>`;
      s += `<text x="${x + 20}" y="${y + 58}" font-family="Zen Kaku Gothic New,sans-serif" font-size="17" font-weight="700" fill="#16233A">${b[1]}</text>`;
      s += `<text x="${x + 20}" y="${y + 82}" font-family="Zen Kaku Gothic New,sans-serif" font-size="12.5" fill="#77839A">${b[2]}</text>`;
      if (b[4]) s += `<text x="${x + 20}" y="${y + 104}" font-family="Saira Condensed,sans-serif" font-size="11" letter-spacing="1.6" fill="#AE3A2C">${b[4]}</text>`;
      if (i < 2) {
        const ax = x + bw + 8, ay = y + h / 2;
        s += `<path d="M${ax} ${ay} L${ax + gap - 16} ${ay}" stroke="${C.navy}" stroke-width="2" marker-end="url(#arw)"/>`;
      }
    });
    s += `<text x="20" y="${H - 16}" font-family="Zen Kaku Gothic New,sans-serif" font-size="12.5" fill="#77839A">サーバーもアカウントも不要。データは端末のブラウザ内に閉じているため、別の端末には引き継がれない。</text>`;
    s = `<defs><marker id="arw" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${C.navy}"/></marker></defs>` + s;
    return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="保存の仕組み">${s}</svg>`;
  }

  /* ===================== Tips / 用語集 / FAQ ===================== */
  const tips = $('#tips');
  if (tips) tips.innerHTML = D.TIPS.map(t => `
    <div class="tip"><div class="tn">${t.n}</div><h4>${esc(t.t)}</h4><p>${esc(t.p)}</p></div>`).join('');

  const gl = $('#glossary');
  if (gl) gl.innerHTML = D.GLOSSARY.map(g => `
    <div class="row"><dt>${esc(g.jp)}<small>${esc(g.en)}</small></dt><dd>${esc(g.d)}</dd></div>`).join('');

  const faq = $('#faq');
  if (faq) faq.innerHTML = D.FAQ.map((f, i) => `
    <details${i === 0 ? ' open' : ''}><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join('');

  /* ===================== アンカー移動の補正 ===================== */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 62), behavior: 'smooth' });
  });
})();
