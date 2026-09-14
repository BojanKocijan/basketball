import { expect, test } from '@playwright/test'

test('loads the app and can switch tabs via the bottom nav', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()

  await page.getByRole('button', { name: /library/i }).click()
  await expect(page.getByRole('button', { name: /library/i })).toBeVisible()

  await page.getByRole('button', { name: /groups/i }).click()
  await expect(page.getByRole('button', { name: /groups/i })).toBeVisible()
})
