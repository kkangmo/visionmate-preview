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
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const txt = m.text();
    // /api/actions 405는 정적 호스팅에서 예상된 동작 (URL이 메시지에 없어도 405 리소스 실패는 무시)
    if (txt.includes("/api/actions")) return;
    if (txt.includes("Failed to load resource") && txt.includes("405")) return;
    consoleErrors.push(txt.slice(0, 120));
  });
  page.on("response", (r) => {
    // /api/actions 405는 정적 호스팅에서 예상된 동작 (mock-cms.json 폴백 사용)
    if (r.url().includes("/api/actions")) return;
    if (r.status() >= 400) netFails.push(`${r.status()} ${r.url().slice(0, 100)}`);
  });

  try {
    // ===== HOME (/) =====
    // Live Stage는 2026-10-18 구조 변경으로 /showcase로 이동됨. 홈에서는 검증하지 않음.
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

    // 4. 콘솔/네트워크 (홈)
    consoleErrors.length === 0 ? pass(`${vp.name}: no console errors`) : fail(`${vp.name}: console errors: ${consoleErrors.join(" | ")}`);
    netFails.length === 0 ? pass(`${vp.name}: no network failures`) : fail(`${vp.name}: net fails: ${netFails.join(" | ")}`);

    // ===== SHOWCASE (/showcase) — Live Stage 4개 데모 검증 =====
    // CONCEPT Showcase 정책: 실제 구축사례가 아닌 콘셉트 시연
    await page.goto(TARGET + "showcase", { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(6000);

    // 5. 4개 탭 클릭 + PNG (ATELIER / LUMÉ / GIFT STUDIO / ATLAS)
    const tabNames = ["corporate", "brand", "commerce", "ai"];
    const tabLabels = ["ATELIER", "LUMÉ", "GIFT STUDIO", "ATLAS"];
    for (let i = 0; i < 4; i++) {
      await page.evaluate((idx) => {
        const btns = [...document.querySelectorAll(".ls-tabs button")];
        if (btns[idx]) btns[idx].click();
      }, i);
      await page.waitForTimeout(1800);
      const tabVisible = await page.evaluate((label) => document.body.textContent.includes(label), tabLabels[i]);
      tabVisible ? pass(`${vp.name}: showcase tab ${tabNames[i]} (${tabLabels[i]}) visible`) : fail(`${vp.name}: showcase tab ${tabNames[i]} not visible`);

      // 이미지 로딩 확인
      const imgsOk = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll(".live-stage img")];
        return imgs.length === 0 || imgs.every((img) => img.complete && img.naturalWidth > 0);
      });
      imgsOk ? pass(`${vp.name}: showcase tab ${tabNames[i]} images loaded`) : fail(`${vp.name}: showcase tab ${tabNames[i]} broken images`);

      await page.screenshot({ path: `${OUT}/${vp.name}-showcase-${tabNames[i]}.png` });
    }

    // 6. 텍스트 잘림 (상품명)
    await page.evaluate(() => { const btns = [...document.querySelectorAll(".ls-tabs button")]; if (btns[2]) btns[2].click(); });
    await page.waitForTimeout(1500);
    const truncated = await page.evaluate(() =>
      [...document.querySelectorAll(".ls-product h3")].filter((n) => n.scrollWidth > n.clientWidth + 1).map((n) => n.textContent.trim())
    );
    truncated.length === 0 ? pass(`${vp.name}: showcase no truncated product names`) : fail(`${vp.name}: showcase truncated: ${truncated.join(",")}`);

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
