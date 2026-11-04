import { chromium } from "playwright";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:5173";
const TEST_USERNAME = process.env.E2E_USERNAME;

const browser = await chromium.launch();
const page = await browser.newPage();
let failures = 0;

try {
  if (!TEST_USERNAME) {
    throw new Error("Define E2E_USERNAME para ejecutar la prueba.");
  }
  await page.goto(`${BASE_URL}/login`);

  await page.getByLabel("Correo electrónico o nombre de usuario").fill(TEST_USERNAME);
  const codeResponsePromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/auth/request-code") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: "Enviar código" }).click();
  const codeResponse = await codeResponsePromise;
  const { code } = await codeResponse.json();
  await page.getByLabel("Código de acceso").fill(code);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await page.waitForURL("**/feed", { timeout: 10000 });
  console.log("PASS: inicio de sesión y acceso al feed");
  failures += 0;

  // Step 2: publish a tweet from the feed.
  await page.getByLabel("Contenido del tweet").fill("Tweet de prueba automatizado");
  await page.getByRole("button", { name: "Publicar" }).click();
  await page.getByText("¡Tweet publicado!").waitFor({ timeout: 5000 });
  console.log("PASS: publicar un tweet desde el feed funciona");
} catch (error) {
  failures += 1;
  console.error("FAIL:", error.message);
} finally {
  await browser.close();
}

process.exit(failures === 0 ? 0 : 1);
