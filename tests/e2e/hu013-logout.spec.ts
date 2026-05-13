import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';
const VALID_EMAIL = 'test@example.com';
const VALID_PASSWORD = 'password123';

test.describe('HU-013: Logout Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
  });

  /**
   * QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido
   * Gherkin: Scenario: Usuario hace logout exitosamente después de login
   */
  test('QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido', async ({ page }) => {
    // Navegar a login
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(/\/login/);

    // Ingresar credenciales válidas
    await page.fill('input[type="email"]', VALID_EMAIL);
    await page.fill('input[type="password"]', VALID_PASSWORD);
    await page.click('button[type="submit"]');

    // Verificar redirección al dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    // Verificar nombre de usuario visible en el header
    const userName = page.locator('header').getByText('Jane Doe');
    await expect(userName).toBeVisible();

    // Verificar botón de logout visible
    const logoutButton = page.locator('header button[title="Logout"]');
    await expect(logoutButton).toBeVisible();

    await page.screenshot({ path: 'tests/reports/TC01_login_exitoso.png' });
  });

  /**
   * QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout
   * Gherkin: Scenario: Estado se limpia después del logout
   */
  test('QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout', async ({ page }) => {
    // Autenticar usuario
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', VALID_EMAIL);
    await page.fill('input[type="password"]', VALID_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    // Hacer logout
    const logoutButton = page.locator('header button[title="Logout"]');
    await logoutButton.click();

    // Verificar redirección a login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Verificar que localStorage no contenga auth_fake
    const authFake = await page.evaluate(() => localStorage.getItem('auth_fake'));
    expect(authFake).toBeNull();

    // Verificar que no se puede acceder al dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    await page.screenshot({ path: 'tests/reports/TC02_localstorage_limpio.png' });
  });

  /**
   * QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout
   * Gherkin: Scenario: Acceso denegado a rutas protegidas después del logout
   */
  test('QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout', async ({ page }) => {
    // Autenticar usuario
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', VALID_EMAIL);
    await page.fill('input[type="password"]', VALID_PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    // Hacer logout
    const logoutButton = page.locator('header button[title="Logout"]');
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Intentar acceder directamente a /dashboard después del logout
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Verificar que no hay contenido del dashboard
    const dashboardContent = page.locator('text=Analytics Overview');
    await expect(dashboardContent).not.toBeVisible();

    await page.screenshot({ path: 'tests/reports/TC03_acceso_denegado_post_logout.png' });
  });

  /**
   * QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa
   * Gherkin: Scenario: Botón de logout no visible en página de login
   */
  test('QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa', async ({ page }) => {
    // Ir directamente a login sin autenticarse
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveURL(/\/login/);

    // Intentar navegar al dashboard sin autenticación
    await page.goto(`${BASE_URL}/dashboard`);

    // Verificar redirección a login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Verificar que el botón de logout NO está visible
    const logoutButton = page.locator('button[title="Logout"]');
    await expect(logoutButton).not.toBeVisible();

    await page.screenshot({ path: 'tests/reports/TC04_logout_no_visible_sin_auth.png' });
  });
});
