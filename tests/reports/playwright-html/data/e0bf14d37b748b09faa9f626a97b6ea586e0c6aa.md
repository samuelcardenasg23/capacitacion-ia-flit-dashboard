# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hu013-logout.spec.ts >> HU-013: Logout Functionality >> QA_TC02_LOGIN_LOGOUT - Estado de sesión se limpia del localStorage al hacer logout
- Location: tests/e2e/hu013-logout.spec.ts:46:3

# Error details

```
Error: expect(received).toBeNull()

Received: "true"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - generic [ref=e6]:
        - img [ref=e8]
        - generic [ref=e10]: Flit Analytics
      - navigation [ref=e11]:
        - link "Dashboard" [ref=e12] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e13]
          - generic [ref=e18]: Dashboard
        - link "Reports" [ref=e19] [cursor=pointer]:
          - /url: /reports
          - img [ref=e20]
          - generic [ref=e23]: Reports
        - link "Settings" [ref=e24] [cursor=pointer]:
          - /url: /settings
          - img [ref=e25]
          - generic [ref=e28]: Settings
    - generic [ref=e29]:
      - banner [ref=e30]:
        - generic [ref=e31]: Analytics Overview
        - generic [ref=e32]:
          - generic [ref=e33]:
            - img [ref=e35]
            - text: Jane Doe
          - button "Logout" [ref=e38]:
            - img [ref=e39]
      - main [ref=e42]:
        - generic [ref=e43]:
          - heading "Dashboard" [level=2] [ref=e44]
          - generic [ref=e45]:
            - generic [ref=e46]:
              - heading "Total Revenue" [level=3] [ref=e48]
              - generic [ref=e49]:
                - generic [ref=e50]: $45,231.89
                - paragraph [ref=e51]:
                  - img [ref=e52]
                  - text: 20.1% from last month
            - generic [ref=e55]:
              - heading "Active Users" [level=3] [ref=e57]
              - generic [ref=e58]:
                - generic [ref=e59]: "+2350"
                - paragraph [ref=e60]:
                  - img [ref=e61]
                  - text: 180.1% from last month
            - generic [ref=e64]:
              - heading "Sales" [level=3] [ref=e66]
              - generic [ref=e67]:
                - generic [ref=e68]: +12,234
                - paragraph [ref=e69]:
                  - img [ref=e70]
                  - text: 19% from last month
            - generic [ref=e73]:
              - heading "Active Now" [level=3] [ref=e75]
              - generic [ref=e76]:
                - generic [ref=e77]: "573"
                - paragraph [ref=e78]:
                  - img [ref=e79]
                  - text: 201% from last month
          - generic [ref=e82]:
            - generic [ref=e83]:
              - heading "Revenue Trend" [level=3] [ref=e85]
              - generic [ref=e88]:
                - list [ref=e90]:
                  - listitem [ref=e91]:
                    - img "revenue legend icon" [ref=e92]
                    - text: revenue
                - application [ref=e94]:
                  - generic [ref=e111]:
                    - generic [ref=e112]:
                      - generic [ref=e114]: Jan
                      - generic [ref=e116]: Feb
                      - generic [ref=e118]: Mar
                      - generic [ref=e120]: Apr
                      - generic [ref=e122]: May
                      - generic [ref=e124]: Jun
                      - generic [ref=e126]: Jul
                    - generic [ref=e127]:
                      - generic [ref=e129]: $0
                      - generic [ref=e131]: $1000
                      - generic [ref=e133]: $2000
                      - generic [ref=e135]: $3000
                      - generic [ref=e137]: $4000
            - generic [ref=e138]:
              - heading "Active Users" [level=3] [ref=e140]
              - generic [ref=e143]:
                - list [ref=e145]:
                  - listitem [ref=e146]:
                    - img "users legend icon" [ref=e147]
                    - text: users
                - application [ref=e149]:
                  - generic [ref=e178]:
                    - generic [ref=e179]:
                      - generic [ref=e181]: Jan
                      - generic [ref=e183]: Feb
                      - generic [ref=e185]: Mar
                      - generic [ref=e187]: Apr
                      - generic [ref=e189]: May
                      - generic [ref=e191]: Jun
                      - generic [ref=e193]: Jul
                    - generic [ref=e194]:
                      - generic [ref=e196]: "0"
                      - generic [ref=e198]: "2500"
                      - generic [ref=e200]: "5000"
                      - generic [ref=e202]: "7500"
                      - generic [ref=e204]: "10000"
          - generic [ref=e205]:
            - heading "Recent Reports" [level=3] [ref=e207]
            - table [ref=e210]:
              - rowgroup [ref=e211]:
                - row "Title Author Status Date" [ref=e212]:
                  - columnheader "Title" [ref=e213] [cursor=pointer]:
                    - generic [ref=e214]: Title
                  - columnheader "Author" [ref=e215] [cursor=pointer]:
                    - generic [ref=e216]: Author
                  - columnheader "Status" [ref=e217] [cursor=pointer]:
                    - generic [ref=e218]: Status
                  - columnheader "Date" [ref=e219] [cursor=pointer]:
                    - generic [ref=e220]:
                      - text: Date
                      - img [ref=e221]
              - rowgroup [ref=e223]:
                - row "Marketing Campaign ROI Alice Smith published 2026-05-05" [ref=e224]:
                  - cell "Marketing Campaign ROI" [ref=e225]
                  - cell "Alice Smith" [ref=e226]
                  - cell "published" [ref=e227]
                  - cell "2026-05-05" [ref=e228]
                - row "User Growth Analysis Bob Jones draft 2026-05-03" [ref=e229]:
                  - cell "User Growth Analysis" [ref=e230]
                  - cell "Bob Jones" [ref=e231]
                  - cell "draft" [ref=e232]
                  - cell "2026-05-03" [ref=e233]
                - row "Q1 Performance Alice Smith published 2026-05-01" [ref=e234]:
                  - cell "Q1 Performance" [ref=e235]
                  - cell "Alice Smith" [ref=e236]
                  - cell "published" [ref=e237]
                  - cell "2026-05-01" [ref=e238]
                - row "Server Costs 2025 Charlie Brown archived 2026-04-20" [ref=e239]:
                  - cell "Server Costs 2025" [ref=e240]
                  - cell "Charlie Brown" [ref=e241]
                  - cell "archived" [ref=e242]
                  - cell "2026-04-20" [ref=e243]
  - generic [ref=e244]: "0"
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
> 63  |     expect(authFake).toBeNull();
      |                      ^ Error: expect(received).toBeNull()
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
  91  |     await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
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