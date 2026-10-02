# PLAYCALL 取扱説明書 — 公開用セット

このフォルダの中身が、そのまま「ウェブサイト」として公開できる一式です。
フォルダの外にあるファイル（企画書、README、.srcmap.json、screenshots など）は不要です。

## 中身

```
web/
├── index.html            ← トップページ（これが入口）
├── manual-manual.css     ← 見た目（紙の質感・レイアウト）
├── manual-data.js        ← カード／相性／用語集／FAQ のデータ
├── manual-app.js         ← 動き（進捗バー、目次、現在位置表示）
├── README.md             ← このファイル（アップしても無害です）
└── assets/
    ├── playcall-logo.png
    ├── playcall-cover.png
    └── football/
        ├── huddle.jpg
        ├── qb-pass.jpg
        ├── scrimmage.jpg
        └── ball-on-grass.jpg
```

- 画像は `assets/` の中に同梱済みです。外部サービスから読み込んでいる画像はありません。
- フォントだけは Google Fonts（Big Shoulders Display / Graduate / Saira Condensed / JetBrains Mono / Permanent Marker / Zen Kaku Gothic New）を読み込んでいます。表示にはインターネット接続が必要です。
- ページ単体は JavaScript で描画しています。ローカルで開くときは、`index.html` をダブルクリックせず、簡易サーバー経由で開いてください（`cd web && python3 -m http.server 8000` → `http://localhost:8000`）。

## アップロードのしかた

### 1. Netlify Drop（いちばん簡単・アカウント登録なしでも可）
1. `web` フォルダを ZIP に圧縮します。
2. https://app.netlify.com/drop を開き、ZIP をドラッグ＆ドロップします。
3. 数十秒で `https://xxxx.netlify.app` の URL が発行されます。
   - ZIP を解凍せず、**ZIP のまま**ドロップしてOKです（中に `index.html` が入っている必要があります）。

### 2. Cloudflare Pages / Vercel
- 「静的サイト」として新規プロジェクトを作成し、この ZIP をアップロードするか、Git リポジトリに `web/` の中身を push します。
- ビルドコマンドは不要（空欄）、出力ディレクトリは `web`（リポジトリ直下に置く場合は `.`）。

### 3. レンタルサーバー（FTP）
- `web` フォルダの中身を、公開ディレクトリ（`public_html` など）へそのままアップロードします。
- フォルダ構造を崩さないでください（`assets/` は `index.html` と同じ階層に置く）。

## 自分でURLを配る場合
- ドメイン直下（`https://example.com/`）で見せたい場合は、`web` の中身をそのままルートに置きます。
- サブディレクトリ（`https://example.com/manual/`）に置く場合も、相対パスで書かれているのでそのまま動きます。
