const { test, expect } = require('@playwright/test');

test.afterEach(async ({ page }, testInfo) => {
  try {
    const video = page?.video?.();
    if (video) {
      const path = await video.path();
      if (path) await testInfo.attach('video', { path, contentType: 'video/webm' });
    }
  } catch (_) {}
});

module.exports = { test, expect };
