const { hexToRgb, sanitizeFilename, buildChromeThemeManifest } = require("./themeUtils");

test("hexToRgb parses hex with #", () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
});

test("hexToRgb parses hex without #", () => {
    expect(hexToRgb("000000")).toEqual([0, 0, 0]);
});

test("sanitizeFilename replaces invalid characters (Option B)", () => {
    expect(sanitizeFilename("My Theme!! 2026", "fallback")).toBe("My_Theme_2026");
});

test("buildChromeThemeManifest sets solid ntp_background", () => {
    const m = buildChromeThemeManifest({
        themeName: "Test",
        frameHex: "#000000",
        toolbarHex: "#ffffff",
        textHex: "#111111",
        activeTabHex: "#222222",
        inactiveTabHex: "#333333",
        bgType: "solid",
        solidBgHex: "#abcdef",
        hasBackgroundImage: false
    });

    expect(m.theme.colors.ntp_background).toEqual([171, 205, 239]);
});

test("buildChromeThemeManifest sets images/properties when background image is present", () => {
    const m = buildChromeThemeManifest({
        themeName: "Test",
        frameHex: "#000000",
        toolbarHex: "#ffffff",
        textHex: "#111111",
        activeTabHex: "#222222",
        inactiveTabHex: "#333333",
        bgType: "image",
        solidBgHex: null,
        hasBackgroundImage: true
    });

    expect(m.theme.images).toEqual({ theme_ntp_background: "background.png" });
    expect(m.theme.properties.ntp_background_repeat).toBe("no-repeat");
    expect(m.theme.colors.ntp_background).toEqual([255, 255, 255]);
});
