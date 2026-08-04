import { chromium } from 'file:///C:/Users/Furry_Xiyi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge Dev/Application/msedge.exe'
});
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:5174/WinUIonWeb/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.win-nav-item');

const navigateTo = async (names) => {
  const result = await page.locator('.win-nav-item .label').evaluateAll((labels, expected) => {
    const target = labels.find((label) => expected.some((name) => label.textContent.trim().toLowerCase() === name.toLowerCase()));
    target?.closest('.win-nav-item')?.click();
    return { clicked: target?.textContent.trim() ?? null, labels: labels.map((label) => label.textContent.trim()) };
  }, names);
  if (!result.clicked) throw new Error(`Navigation item not found: ${names.join(', ')}\n${result.labels.join(' | ')}`);
  await page.waitForTimeout(500);
};

const infoBarSnapshot = () => page.locator('.example-display .win-infobar').evaluateAll((bars) => bars.map((bar) => {
  const panel = bar.querySelector('.win-infobar-panel');
  const title = bar.querySelector('.win-infobar-title');
  const message = bar.querySelector('.win-infobar-message');
  const action = bar.querySelector('.win-infobar-action');
  const rect = (element) => {
    if (!element) return null;
    const value = element.getBoundingClientRect();
    return { x: value.x, y: value.y, width: value.width, height: value.height, right: value.right, bottom: value.bottom };
  };
  return {
    className: panel?.className,
    bar: rect(bar),
    panel: rect(panel),
    title: rect(title),
    message: rect(message),
    action: rect(action),
    actionChild: rect(action?.firstElementChild),
    titleMessageGap: title && message ? message.getBoundingClientRect().x - title.getBoundingClientRect().right : null,
    titleTop: title && panel ? title.getBoundingClientRect().y - panel.getBoundingClientRect().y : null,
    messageTop: message && panel ? message.getBoundingClientRect().y - panel.getBoundingClientRect().y : null,
    clientHeight: bar.clientHeight,
    scrollHeight: bar.scrollHeight,
    messageText: message?.textContent ?? ''
  };
}));

await navigateTo(['InfoBar', '信息栏']);
const infoBars = {};
for (const width of [1600, 1300, 1100, 900, 760]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.waitForTimeout(300);
  const states = [];
  for (let frame = 0; frame < 8; frame += 1) {
    states.push(await infoBarSnapshot());
    await page.waitForTimeout(50);
  }
  infoBars[width] = {
    stable: states.every((state) => JSON.stringify(state) === JSON.stringify(states[0])),
    snapshot: states.at(-1)
  };
}

await page.setViewportSize({ width: 1600, height: 1000 });
await page.waitForTimeout(300);
const secondExample = page.locator('.control-example-frame').nth(1);
const selectComboItem = async (comboIndex, labels) => {
  await secondExample.locator('[role="combobox"]').nth(comboIndex).click();
  const option = page.locator('[role="option"]').filter({ hasText: new RegExp(`^(${labels.join('|')})$`) });
  await option.click();
  await page.waitForTimeout(400);
};
const secondInfoBarSnapshot = async () => (await infoBarSnapshot())[1];
await selectComboItem(1, ['按钮', 'Button']);
const actionButtonLong = await secondInfoBarSnapshot();
await selectComboItem(1, ['超链接', 'Hyperlink']);
const hyperlinkLong = await secondInfoBarSnapshot();
await selectComboItem(0, ['短', 'Short']);
const hyperlinkShort = await secondInfoBarSnapshot();
await selectComboItem(1, ['按钮', 'Button']);
const actionButtonShort = await secondInfoBarSnapshot();
await page.screenshot({ path: 'layout-check-infobar.png', fullPage: true });

await page.setViewportSize({ width: 1400, height: 1100 });
await page.waitForTimeout(300);
await navigateTo(['InfoBadge', '信息徽章']);

const firstBadgeExample = page.locator('.control-example-frame').first();
await firstBadgeExample.locator('[role="combobox"]').click();
await page.locator('[role="option"]').filter({ hasText: /^(顶部|Top)$/ }).click();
await page.waitForTimeout(400);
const topNavigationBadge = await firstBadgeExample.locator('.example-display .win-nav-item[role="button"]').filter({ hasText: /收件箱|Inbox/ }).evaluate((item) => {
  const badge = item.querySelector('.win-nav-infobadge');
  const itemRect = item.getBoundingClientRect();
  const badgeRect = badge.getBoundingClientRect();
  return {
    item: { x: itemRect.x, y: itemRect.y, width: itemRect.width, height: itemRect.height },
    badge: { x: badgeRect.x, y: badgeRect.y, width: badgeRect.width, height: badgeRect.height },
    margin: getComputedStyle(badge).margin
  };
});

const numberInput = page.locator('.gallery-page-content input').last();
const dynamicBadge = page.locator('.example-display .win-infobadge-value').last();
const setBadgeValue = async (value) => {
  await numberInput.fill(String(value));
  await numberInput.press('Enter');
  await page.waitForTimeout(350);
  return dynamicBadge.evaluate((badge) => {
    const rect = badge.getBoundingClientRect();
    const text = badge.querySelector('.win-infobadge-value-text')?.getBoundingClientRect();
    return {
      value: badge.textContent,
      width: rect.width,
      height: rect.height,
      radius: getComputedStyle(badge).borderRadius,
      text: text ? { x: text.x, y: text.y, width: text.width, height: text.height } : null
    };
  });
};

const badges = {
  value9: await setBadgeValue(9),
  value10: await setBadgeValue(10),
  examples: await page.locator('.example-display .win-infobadge').evaluateAll((items) => items.map((badge) => {
    const rect = badge.getBoundingClientRect();
    return { text: badge.textContent, className: badge.className, width: rect.width, height: rect.height, x: rect.x, y: rect.y };
  }))
};

console.log(JSON.stringify({
  infoBars,
  actions: { actionButtonLong, hyperlinkLong, hyperlinkShort, actionButtonShort },
  topNavigationBadge,
  badges
}, null, 2));
await page.screenshot({ path: 'layout-check.png', fullPage: true });
await browser.close();
