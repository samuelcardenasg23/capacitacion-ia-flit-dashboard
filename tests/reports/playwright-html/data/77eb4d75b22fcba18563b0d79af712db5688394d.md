# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu013-logout.spec.ts >> HU-013: Logout Functionality >> QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout
- Location: tests/e2e/hu013-logout.spec.ts:76:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:5173/dashboard"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:5173/dashboard"

```

```yaml
- complementary:
  - text: Flit Analytics
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Reports":
      - /url: /reports
    - link "Settings":
      - /url: /settings
- banner:
  - text: Analytics Overview Jane Doe
  - button "Logout"
- main:
  - heading "Dashboard" [level=2]
  - heading "Total Revenue" [level=3]
  - text: $45,231.89
  - paragraph: 20.1% from last month
  - heading "Active Users" [level=3]
  - text: "+2350"
  - paragraph: 180.1% from last month
  - heading "Sales" [level=3]
  - text: +12,234
  - paragraph: 19% from last month
  - heading "Active Now" [level=3]
  - text: "573"
  - paragraph: 201% from last month
  - heading "Revenue Trend" [level=3]
  - list:
    - listitem:
      - img "revenue legend icon"
      - text: revenue
  - application: Jan Feb Mar Apr May Jun Jul $0 $1000 $2000 $3000 $4000
  - heading "Active Users" [level=3]
  - list:
    - listitem:
      - img "users legend icon"
      - text: users
  - application: Jan Feb Mar Apr May Jun Jul 0 2500 5000 7500 10000
  - heading "Recent Reports" [level=3]
  - table:
    - rowgroup:
      - row "Title Author Status Date":
        - columnheader "Title"
        - columnheader "Author"
        - columnheader "Status"
        - columnheader "Date"
    - rowgroup:
      - row "Marketing Campaign ROI Alice Smith published 2026-05-05":
        - cell "Marketing Campaign ROI"
        - cell "Alice Smith"
        - cell "published"
        - cell "2026-05-05"
      - row "User Growth Analysis Bob Jones draft 2026-05-03":
        - cell "User Growth Analysis"
        - cell "Bob Jones"
        - cell "draft"
        - cell "2026-05-03"
      - row "Q1 Performance Alice Smith published 2026-05-01":
        - cell "Q1 Performance"
        - cell "Alice Smith"
        - cell "published"
        - cell "2026-05-01"
      - row "Server Costs 2025 Charlie Brown archived 2026-04-20":
        - cell "Server Costs 2025"
        - cell "Charlie Brown"
        - cell "archived"
        - cell "2026-04-20"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const BASE_URL = 'http://localhost:5173';
  4   | const VALID_EMAIL = 'test@example.com';
  5   | const VALID_PASSWORD = 'password123';
  6   | 
  7   | test.describe('HU-013: Logout Functionality', () => {
  8   |   test.beforeEach(async ({ page }) => {
  9   |     await page.context().clearCookies();
  10  |     await page.goto(BASE_URL);
  11  |     await page.evaluate(() => localStorage.clear());
  12  |   });
  13  | 
  14  |   /**
  15  |    * QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido
  16  |    * Gherkin: Scenario: Usuario hace logout exitosamente después de login
  17  |    */
  18  |   test('QA_TC01_LOGIN_LOGOUT - Logout exitoso después de login válido', async ({ page }) => {
  19  |     // Navegar a login
  20  |     await page.goto(`${BASE_URL}/login`);
  21  |     await expect(page).toHaveURL(/\/login/);
  22  | 
  23  |     // Ingresar credenciales válidas
  24  |     await page.fill('input[type="email"]', VALID_EMAIL);
  25  |     await page.fill('input[type="password"]', VALID_PASSWORD);
  26  |     await page.click('button[type="submit"]');
  27  | 
  28  |     // Verificar redirección al dashboard
  29  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  30  | 
  31  |     // Verificar nombre de usuario visible en el header
  32  |     const userName = page.locator('header').getByText('Jane Doe');
  33  |     await expect(userName).toBeVisible();
  34  | 
  35  |     // Verificar botón de logout visible
  36  |     const logoutButton = page.locator('header button[title="Logout"]');
  37  |     await expect(logoutButton).toBeVisible();
  38  | 
  39  |     await page.screenshot({ path: 'tests/reports/TC01_login_exitoso.png' });
  40  |   });
  41  | 
  42  |   /**
  43  |    * QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout
  44  |    * Gherkin: Scenario: Estado se limpia después del logout
  45  |    */
  46  |   test('QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout', async ({ page }) => {
  47  |     // Autenticar usuario
  48  |     await page.goto(`${BASE_URL}/login`);
  49  |     await page.fill('input[type="email"]', VALID_EMAIL);
  50  |     await page.fill('input[type="password"]', VALID_PASSWORD);
  51  |     await page.click('button[type="submit"]');
  52  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  53  | 
  54  |     // Hacer logout
  55  |     const logoutButton = page.locator('header button[title="Logout"]');
  56  |     await logoutButton.click();
  57  | 
  58  |     // Verificar redirección a login
  59  |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  60  | 
  61  |     // Verificar que localStorage no contenga auth_fake
  62  |     const authFake = await page.evaluate(() => localStorage.getItem('auth_fake'));
  63  |     expect(authFake).toBeNull();
  64  | 
  65  |     // Verificar que no se puede acceder al dashboard
  66  |     await page.goto(`${BASE_URL}/dashboard`);
  67  |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  68  | 
  69  |     await page.screenshot({ path: 'tests/reports/TC02_localstorage_limpio.png' });
  70  |   });
  71  | 
  72  |   /**
  73  |    * QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout
  74  |    * Gherkin: Scenario: Acceso denegado a rutas protegidas después del logout
  75  |    */
  76  |   test('QA_TC03_LOGIN_LOGOUT - Acceso denegado a ruta protegida después del logout', async ({ page }) => {
  77  |     // Autenticar usuario
  78  |     await page.goto(`${BASE_URL}/login`);
  79  |     await page.fill('input[type="email"]', VALID_EMAIL);
  80  |     await page.fill('input[type="password"]', VALID_PASSWORD);
  81  |     await page.click('button[type="submit"]');
  82  |     await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  83  | 
  84  |     // Hacer logout
  85  |     const logoutButton = page.locator('header button[title="Logout"]');
  86  |     await logoutButton.click();
  87  |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  88  | 
  89  |     // Intentar acceder directamente a /dashboard después del logout
  90  |     await page.goto(`${BASE_URL}/dashboard`);
> 91  |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
      |                        ^ Error: expect(page).toHaveURL(expected) failed
  92  | 
  93  |     // Verificar que no hay contenido del dashboard
  94  |     const dashboardContent = page.locator('text=Analytics Overview');
  95  |     await expect(dashboardContent).not.toBeVisible();
  96  | 
  97  |     await page.screenshot({ path: 'tests/reports/TC03_acceso_denegado_post_logout.png' });
  98  |   });
  99  | 
  100 |   /**
  101 |    * QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa
  102 |    * Gherkin: Scenario: Botón de logout no visible en página de login
  103 |    */
  104 |   test('QA_TC04_LOGIN_LOGOUT - Botón de logout no visible sin autenticación activa', async ({ page }) => {
  105 |     // Ir directamente a login sin autenticarse
  106 |     await page.goto(`${BASE_URL}/login`);
  107 |     await expect(page).toHaveURL(/\/login/);
  108 | 
  109 |     // Intentar navegar al dashboard sin autenticación
  110 |     await page.goto(`${BASE_URL}/dashboard`);
  111 | 
  112 |     // Verificar redirección a login
  113 |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  114 | 
  115 |     // Verificar que el botón de logout NO está visible
  116 |     const logoutButton = page.locator('button[title="Logout"]');
  117 |     await expect(logoutButton).not.toBeVisible();
  118 | 
  119 |     await page.screenshot({ path: 'tests/reports/TC04_logout_no_visible_sin_auth.png' });
  120 |   });
  121 | });
  122 | 
```