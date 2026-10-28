# Soap — Catalog + WhatsApp Website (Sample)

Stack we are using (best for this project):
- **Next.js 16** (App Router) — pages, SEO, easy deploy on Vercel
- **TypeScript** — safer editing
- **Tailwind CSS v4** — styling
- **React 19**, **ESLint**

No database / payment gateway yet — orders go to WhatsApp, payment is COD / JazzCash / Easypaisa. That is intentional for a new homemade soap business in Pakistan.

## Where this goes on your PC

```
D:\projects\project-five\soap\
```

## Run it on Windows

You need Node.js LTS installed first (from nodejs.org), then in PowerShell / VS Code terminal:

```powershell
cd D:\projects\project-five\soap
npm install
npm run dev
```

Open http://localhost:3000

## Edit the sample content

Everything sample is in ONE file: `src/app/page.tsx`
- `WHATSAPP_NUMBER` at the top — replace `923001234567` with the real number (92 + number, no +, no spaces, no leading 0)
- `SOAPS` list — name, scent, skin type, price, ingredients
- Brand name in the `<h1>` and in `src/app/layout.tsx` title

## If you ever want to create it fresh yourself on Windows

```powershell
cd D:\projects
mkdir project-five
cd project-five
npx create-next-app@latest soap --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
cd soap
npm run dev
```

## Build check

```bash
npm run build
```
