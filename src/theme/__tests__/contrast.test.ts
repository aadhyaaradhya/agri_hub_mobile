import { colors } from '../colors';

function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.substring(i, i + 2), 16) / 255);
  const [rl, gl, bl] = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA);
  const l2 = relativeLuminance(hexB);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

// Guards against reintroducing the WCAG AA contrast failures found and
// fixed in the theme rework (light textMuted 2.74:1, light warning 2.53:1,
// light info 3.68:1, dark onPrimary-on-primary 2.54:1). A future palette
// edit that drops any of these pairs below 4.5:1 fails this test.
describe('theme contrast (WCAG AA, 4.5:1 minimum for text)', () => {
  const AA_TEXT = 4.5;

  (['light', 'dark'] as const).forEach((mode) => {
    const t = colors[mode];

    it(`${mode}: text vs background`, () => {
      expect(contrastRatio(t.text, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: textSecondary vs background`, () => {
      expect(contrastRatio(t.textSecondary, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: textMuted vs background`, () => {
      expect(contrastRatio(t.textMuted, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: onPrimary vs primary (button text)`, () => {
      expect(contrastRatio(t.onPrimary, t.primary)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: warning vs background`, () => {
      expect(contrastRatio(t.warning, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: error vs background`, () => {
      expect(contrastRatio(t.error, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: success vs background`, () => {
      expect(contrastRatio(t.success, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
    it(`${mode}: info vs background`, () => {
      expect(contrastRatio(t.info, t.background)).toBeGreaterThanOrEqual(AA_TEXT);
    });
  });

  it("dark brand tokens share the light theme's yellowish-green hue family", () => {
    // Rough hue check (not exact HSL match) — dark primary should not be
    // teal/blue (hue ~150-260) the way the pre-rework palette was.
    const hexToHue = (hex: string): number => {
      const c = hex.replace('#', '');
      const r = parseInt(c.substring(0, 2), 16) / 255;
      const g = parseInt(c.substring(2, 4), 16) / 255;
      const b = parseInt(c.substring(4, 6), 16) / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max === min) return 0;
      const d = max - min;
      let h = 0;
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
      return h;
    };

    const lightHue = hexToHue(colors.light.primary);
    const darkHue = hexToHue(colors.dark.primary);
    expect(Math.abs(lightHue - darkHue)).toBeLessThan(30);
  });
});
