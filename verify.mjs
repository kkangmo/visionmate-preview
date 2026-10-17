import { chromium } from "playwright-core";
import fs from "fs";

const TARGET = process.env.TARGET_URL || "https://kkangmo.github.io/visionmate-preview/";
const OUT = "results";
fs.mkdirSync(OUT, { recursive: true });

const log = [];
const L = (m) => { log.push(m); console.log(m); };
let failures = 0;
const fail = (m) => { failures++; L("FAIL: " + m); };
const pass = (m) => L("PASS: " + m);

const VIEWPORTS = [
  { name: "pc-1440x900", w: 1440, h: 900, mobile: false },
  { name: "mobile-390x844", w: 390, h: 844, mobile: true },
  { name: "mobile-360x800", w: 360, h: 800, mobile: true },
];

const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  L(`\n=== ${vp.name} ===`);
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const consoleErrors = [];
  const netFails = [];
  page.on("pageerror", (e) => consoleErrors.push(String(e).slice(0, 120)));
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 120)); });
  page.on("response", (r) => { if (r.status() >= 400) netFails.push(`${r.status()} ${r.url().slice(0, 100)}`); });

  try {
    await page.goto(TARGET, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(6000);

    // 1. 404 여부
    const title = await page.title();
    title.includes("VisionMate") ? pass(`${vp.name}: title OK`) : fail(`${vp.name}: title="${title}"`);

    // 2. Hero
    const hero = await page.evaluate(() => !!document.querySelector(".pin-journey"));
    hero ? pass(`${vp.name}: Hero present`) : fail(`${vp.name}: Hero missing`);

    // 3. 가로 오버플로
    const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    !hOverflow ? pass(`${vp.name}: no horizontal overflow`) : fail(`${vp.name}: horizontal overflow detected`);

    // 4. Live Stage 스크롤
    await page.evaluate(() => { const el = document.querySelector(".live-stage"); if (el) el.scrollIntoView(); });
    await page.waitForTimeout(2000);

    // 5. 4개 탭 클릭 + PNG
    const tabNames = ["corporate", "brand", "commerce", "ai"];
    for (let i = 0; i < 4; i++) {
      await page.evaluate((idx) => {
        const btns = [...document.querySelectorAll(".ls-tabs button")];
        if (btns[idx]) btns[idx].click();
      }, i);
      await page.waitForTimeout(1800);
      const tabVisible = await page.evaluate((n) => {
        const t = document.body.textContent;
        return n === "corporate" ? t.includes("ATELIER") : n === "brand" ? t.includes("LUMÉ") : n === "commerce" ? t.includes("GIFT STUDIO") : t.includes("ATLAS");
      }, tabNames[i]);
      tabVisible ? pass(`${vp.name}: tab ${tabNames[i]} visible`) : fail(`${vp.name}: tab ${tabNames[i]} not visible`);

      // 이미지 로딩 확인
      const imgsOk = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll(".live-stage img")];
        return imgs.length === 0 || imgs.every((img) => img.complete && img.naturalWidth > 0);
      });
      imgsOk ? pass(`${vp.name}: tab ${tabNames[i]} images loaded`) : fail(`${vp.name}: tab ${tabNames[i]} broken images`);

      await page.screenshot({ path: `${OUT}/${vp.name}-${tabNames[i]}.png` });
    }

    // 6. 텍스트 잘림 (상품명)
    await page.evaluate(() => { const btns = [...document.querySelectorAll(".ls-tabs button")]; if (btns[2]) btns[2].click(); });
    await page.waitForTimeout(1500);
    const truncated = await page.evaluate(() =>
      [...document.querySelectorAll(".ls-product h3")].filter((n) => n.scrollWidth > n.clientWidth + 1).map((n) => n.textContent.trim())
    );
    truncated.length === 0 ? pass(`${vp.name}: no truncated product names`) : fail(`${vp.name}: truncated: ${truncated.join(",")}`);

    // 7. 콘솔/네트워크
    consoleErrors.length === 0 ? pass(`${vp.name}: no console errors`) : fail(`${vp.name}: console errors: ${consoleErrors.join(" | ")}`);
    netFails.length === 0 ? pass(`${vp.name}: no network failures`) : fail(`${vp.name}: net fails: ${netFails.join(" | ")}`);

  } catch (e) {
    fail(`${vp.name}: exception ${String(e).slice(0, 120)}`);
    await page.screenshot({ path: `${OUT}/${vp.name}-error.png` }).catch(() => {});
  }
  await page.close();
}

await browser.close();

fs.writeFileSync("verify.log", log.join("\n") + `\n\nTOTAL FAILURES: ${failures}\n`);
L(`\nTOTAL FAILURES: ${failures}`);
process.exit(failures > 0 ? 1 : 0);
