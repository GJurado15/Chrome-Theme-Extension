// ===== Utility Functions =====

/**
 * Mutable UI state for the extension popup.
 *
 * @type {{ bgImageData: string|null, bgImageName: string|null, gradientStops: string[] }}
 */
var state = {
  bgImageData: null,
  bgImageName: null,
  gradientStops: ["#ff0000", "#00ff00", "#0000ff"],
};

/**
 * Theme configuration object used throughout the popup UI,
 * for export/import, theme generation, and history storage.
 *
 * @typedef {Object} ThemeConfig
 * @property {string} name - Display name of the theme.
 * @property {"solid"|"gradient"|"image"} bgType - Background type.
 * @property {string} bgColor - Solid background color (hex).
 * @property {string[]} gradColors - Gradient color stops.
 * @property {string} gradDirection - Gradient direction.
 * @property {string} frameColor - Browser frame color.
 * @property {string} toolbarColor - Toolbar background color.
 * @property {string} activeTabColor - Active tab color.
 * @property {string} inactiveTabColor - Inactive tab color.
 * @property {string} textColor - Text/icon color.
 * @property {string|null} bgImageData - Base64 image data.
 * @property {string|null} bgImageName - Background image filename.
 * @property {string} [savedAt] - Timestamp used for history entries.
 */

/**
 * Theme preset structure used by the preset dropdown.
 *
 * @typedef {Object} PresetTheme
 * @property {string} name
 * @property {string} frameColor
 * @property {string} toolbarColor
 * @property {string} textColor
 * @property {string} activeTabColor
 * @property {string} inactiveTabColor
 * @property {"solid"|"gradient"} bgType
 * @property {string} [bgColor]
 * @property {string[]} [gradColors]
 * @property {string} [gradDirection]
 */

/**
 * Convert a Base64 data URL into a Blob object.
 *
 * Used when packaging uploaded background images into
 * the downloadable theme ZIP.
 *
 * @param {string} dataurl - Data URL string (e.g. "data:image/png;base64,...").
 * @returns {Blob} Converted binary Blob.
 */
function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Show a toast message.
 *
 * @param {string} message
 * @param {"info"|"success"|"error"} type
 */
function showToast(message, type) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast toast-" + type + " toast-show";
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function () {
    toast.className = "toast";
  }, 3000);
}

// ===== Preset Themes =====

/** @type {Record<string, PresetTheme>} */
var PRESETS = {
  dark: {
    name: "Dark Mode",
    frameColor: "#1a1a2e",
    toolbarColor: "#16213e",
    textColor: "#e0e0e0",
    activeTabColor: "#16213e",
    inactiveTabColor: "#0f3460",
    bgType: "solid",
    bgColor: "#0a0a1a",
  },
  ocean: {
    name: "Ocean Breeze",
    frameColor: "#006994",
    toolbarColor: "#00a8cc",
    textColor: "#ffffff",
    activeTabColor: "#00a8cc",
    inactiveTabColor: "#005f73",
    bgType: "gradient",
    gradColors: ["#001f3f", "#006994", "#00b4d8"],
    gradDirection: "top-bottom",
  },
  sunset: {
    name: "Sunset Glow",
    frameColor: "#c2185b",
    toolbarColor: "#ff6f00",
    textColor: "#ffffff",
    activeTabColor: "#ff6f00",
    inactiveTabColor: "#c2185b",
    bgType: "gradient",
    gradColors: ["#ff6f00", "#c2185b", "#4a148c"],
    gradDirection: "top-bottom",
  },
  forest: {
    name: "Forest",
    frameColor: "#1b5e20",
    toolbarColor: "#2e7d32",
    textColor: "#ffffff",
    activeTabColor: "#2e7d32",
    inactiveTabColor: "#1b5e20",
    bgType: "gradient",
    gradColors: ["#1b5e20", "#4caf50", "#81c784"],
    gradDirection: "top-bottom",
  },
  monochrome: {
    name: "Monochrome",
    frameColor: "#212121",
    toolbarColor: "#424242",
    textColor: "#ffffff",
    activeTabColor: "#616161",
    inactiveTabColor: "#303030",
    bgType: "solid",
    bgColor: "#1a1a1a",
  },
};

// ===== DOM References =====

var els = {
  presetSelect: document.getElementById("presetSelect"),
  themeName: document.getElementById("themeName"),
  bgType: document.getElementById("bgType"),
  solidGroup: document.getElementById("solidColorGroup"),
  gradientGroup: document.getElementById("gradientColorGroup"),
  imageGroup: document.getElementById("imageUploadGroup"),
  bgColor: document.getElementById("bgColor"),
  gradDirection: document.getElementById("gradDirection"),
  gradStopsContainer: document.getElementById("gradientStopsContainer"),
  addStopBtn: document.getElementById("addStopBtn"),
  bgImageFile: document.getElementById("bgImageFile"),
  fileNameDisplay: document.getElementById("fileNameDisplay"),
  frameColor: document.getElementById("frameColor"),
  toolbarColor: document.getElementById("toolbarColor"),
  activeTabColor: document.getElementById("activeTabColor"),
  inactiveTabColor: document.getElementById("inactiveTabColor"),
  textColor: document.getElementById("textColor"),
  confirmBtn: document.getElementById("confirmBtn"),
  resetBtn: document.getElementById("resetBtn"),
  historyToggle: document.getElementById("historyToggle"),
  historyContent: document.getElementById("historyContent"),
  historyList: document.getElementById("historyList"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  previewFrame: document.getElementById("previewFrame"),
  previewActiveTab: document.getElementById("previewActiveTab"),
  previewInactiveTab: document.getElementById("previewInactiveTab"),
  previewToolbar: document.getElementById("previewToolbar"),
  previewContent: document.getElementById("previewContent"),
};

// ===== Gradient Stops =====

var MIN_STOPS = 2;
var MAX_STOPS = 6;

/**
 * Render gradient stop inputs and wire their event handlers.
 */
function renderGradientStops() {
  els.gradStopsContainer.innerHTML = "";

  state.gradientStops.forEach(function (color, i) {
    var row = document.createElement("div");
    row.className = "gradient-stop-row";

    var input = document.createElement("input");
    input.type = "color";
    input.value = color;
    input.setAttribute("aria-label", "Gradient color stop " + (i + 1));
    input.addEventListener("input", function (e) {
      state.gradientStops[i] = e.target.value;
      updatePreview();
    });
    row.appendChild(input);

    if (state.gradientStops.length > MIN_STOPS) {
      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-stop";
      removeBtn.textContent = "\u00D7";
      removeBtn.setAttribute("aria-label", "Remove color stop " + (i + 1));
      removeBtn.addEventListener(
        "click",
        (function (index) {
          return function () {
            state.gradientStops.splice(index, 1);
            renderGradientStops();
            updatePreview();
          };
        })(i),
      );
      row.appendChild(removeBtn);
    }

    els.gradStopsContainer.appendChild(row);
  });

  els.addStopBtn.style.display =
    state.gradientStops.length >= MAX_STOPS ? "none" : "inline-block";
}

els.addStopBtn.addEventListener("click", function () {
  if (state.gradientStops.length < MAX_STOPS) {
    state.gradientStops.push("#888888");
    renderGradientStops();
    updatePreview();
  }
});

// ===== Live Preview =====

/**
 * Update the live preview UI based on current inputs.
 */
function updatePreview() {
  var frame = els.frameColor.value;
  var toolbar = els.toolbarColor.value;
  var activeTab = els.activeTabColor.value;
  var inactiveTab = els.inactiveTabColor.value;
  var text = els.textColor.value;

  els.previewFrame.style.backgroundColor = frame;
  els.previewToolbar.style.backgroundColor = toolbar;
  els.previewToolbar.style.color = text;
  els.previewActiveTab.style.backgroundColor = activeTab;
  els.previewActiveTab.style.color = text;
  els.previewInactiveTab.style.backgroundColor = inactiveTab;
  els.previewInactiveTab.style.color = text;
  els.previewContent.style.color = text;

  var bgType = els.bgType.value;

  if (bgType === "solid") {
    els.previewContent.style.background = els.bgColor.value;
  } else if (bgType === "gradient") {
    var dir = els.gradDirection.value;
    var cssDir;
    switch (dir) {
      case "left-right":
        cssDir = "to right";
        break;
      case "diagonal-tlbr":
        cssDir = "to bottom right";
        break;
      case "diagonal-trbl":
        cssDir = "to bottom left";
        break;
      case "radial":
        cssDir = null;
        break;
      default:
        cssDir = "to bottom";
    }
    var stops = state.gradientStops.join(", ");
    if (dir === "radial") {
      els.previewContent.style.background =
        "radial-gradient(circle, " + stops + ")";
    } else {
      els.previewContent.style.background =
        "linear-gradient(" + cssDir + ", " + stops + ")";
    }
  } else if (bgType === "image") {
    if (state.bgImageData) {
      els.previewContent.style.background =
        "url(" + state.bgImageData + ") center/cover no-repeat";
    } else {
      els.previewContent.style.background = "#f5f5f5";
    }
  }
}

// Attach preview listeners to all color inputs
[
  "frameColor",
  "toolbarColor",
  "activeTabColor",
  "inactiveTabColor",
  "textColor",
  "bgColor",
].forEach(function (id) {
  document.getElementById(id).addEventListener("input", updatePreview);
});
els.gradDirection.addEventListener("change", updatePreview);

els.bgImageFile.addEventListener("change", function () {
  var file = els.bgImageFile.files[0];
  if (file) {
    if (file.size > 20 * 1024 * 1024) {
      showToast("Image must be under 20MB.", "error");
      els.bgImageFile.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        if (img.width === 0 || img.height === 0) {
          showToast("Image has no dimensions — file may be corrupt.", "error");
          els.bgImageFile.value = "";
          return;
        }
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        state.bgImageData = canvas.toDataURL("image/png");
        state.bgImageName = file.name;
        els.fileNameDisplay.textContent = file.name;
        updatePreview();
      };
      img.onerror = function () {
        showToast(
          "Could not load image — format may not be supported.",
          "error",
        );
        els.bgImageFile.value = "";
      };
      img.src = e.target.result;
    };
    reader.onerror = function () {
      showToast("Could not read file.", "error");
      els.bgImageFile.value = "";
    };
    reader.readAsDataURL(file);
  }
});

// ===== Background Type Switching =====

els.bgType.addEventListener("change", function () {
  var type = els.bgType.value;
  els.solidGroup.style.display = type === "solid" ? "block" : "none";
  els.gradientGroup.style.display = type === "gradient" ? "block" : "none";
  els.imageGroup.style.display = type === "image" ? "block" : "none";
  updatePreview();
});

// ===== Preset Loading =====

els.presetSelect.addEventListener("change", function () {
  var key = els.presetSelect.value;
  if (!key) return;
  var preset = PRESETS[key];
  if (!preset) return;
  applyConfig(preset);
  showToast('Loaded "' + preset.name + '" preset', "info");
});

// ===== Get / Apply Config =====

/**
 * Read current inputs into a ThemeConfig.
 *
 * @returns {ThemeConfig}
 */
function getCurrentConfig() {
  return {
    name: els.themeName.value,
    bgType: els.bgType.value,
    bgColor: els.bgColor.value,
    gradColors: state.gradientStops.slice(),
    gradDirection: els.gradDirection.value,
    frameColor: els.frameColor.value,
    toolbarColor: els.toolbarColor.value,
    activeTabColor: els.activeTabColor.value,
    inactiveTabColor: els.inactiveTabColor.value,
    textColor: els.textColor.value,
    bgImageData: els.bgType.value === "image" ? state.bgImageData : null,
    bgImageName: els.bgType.value === "image" ? state.bgImageName : null,
  };
}

/**
 * Apply a theme configuration or preset to the popup UI.
 *
 * Updates form controls and preview elements so the interface
 * reflects the provided theme settings.
 *
 * @param {ThemeConfig|PresetTheme} config - Theme configuration or preset to apply.
 */
function applyConfig(config) {
  if (config.name !== undefined) els.themeName.value = config.name;
  if (config.frameColor) els.frameColor.value = config.frameColor;
  if (config.toolbarColor) els.toolbarColor.value = config.toolbarColor;
  if (config.activeTabColor) els.activeTabColor.value = config.activeTabColor;
  if (config.inactiveTabColor)
    els.inactiveTabColor.value = config.inactiveTabColor;
  if (config.textColor) els.textColor.value = config.textColor;

  if (config.bgType) {
    els.bgType.value = config.bgType;
    els.solidGroup.style.display = config.bgType === "solid" ? "block" : "none";
    els.gradientGroup.style.display =
      config.bgType === "gradient" ? "block" : "none";
    els.imageGroup.style.display = config.bgType === "image" ? "block" : "none";
  }

  if (config.bgType === "image" && config.bgImageData) {
    state.bgImageData = config.bgImageData;
    state.bgImageName = config.bgImageName || "background.png";
    els.fileNameDisplay.textContent = state.bgImageName;
  } else if (config.bgType === "image" && !config.bgImageData) {
    els.fileNameDisplay.textContent = "No file chosen";
  }

  if (config.bgColor) els.bgColor.value = config.bgColor;
  if (config.gradColors && config.gradColors.length >= MIN_STOPS) {
    state.gradientStops = config.gradColors.slice();
    renderGradientStops();
  }
  if (config.gradDirection) els.gradDirection.value = config.gradDirection;

  updatePreview();
}

// ===== Reset =====

var DEFAULTS = {
  name: "",
  bgType: "solid",
  bgColor: "#f5f5f5",
  gradColors: ["#ff0000", "#00ff00", "#0000ff"],
  gradDirection: "top-bottom",
  frameColor: "#4285f4",
  toolbarColor: "#ffffff",
  activeTabColor: "#ffffff",
  inactiveTabColor: "#d0d0d0",
  textColor: "#000000",
};

els.resetBtn.addEventListener("click", function () {
  applyConfig(DEFAULTS);
  els.presetSelect.value = "";
  els.bgImageFile.value = "";
  state.bgImageData = null;
  state.bgImageName = null;
  els.fileNameDisplay.textContent = "No file chosen";
  showToast("Reset to defaults", "info");
});

// ===== Validation =====

/**
 * Validate the current UI configuration before generating a theme.
 *
 * Ensures required fields are populated and background
 * settings are valid for the selected background type.
 *
 * @returns {boolean} True if the configuration is valid.
 */
function validate() {
  if (els.bgType.value === "image" && !state.bgImageData) {
    showToast("Please select a background image.", "error");
    return false;
  }
  return true;
}

// ===== Gradient Blob Creation =====

/**
 * Generate a PNG image Blob representing a gradient background.
 *
 * This is used when exporting gradient backgrounds so they can
 * be included as the New Tab Page background image.
 *
 * @param {string[]} colors - Array of hex color stops.
 * @param {string} direction - Gradient direction.
 * @returns {Promise<Blob>} Resolves with the generated PNG Blob.
 */
function createGradientBlob(colors, direction) {
  return new Promise(function (resolve) {
    var canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    var ctx = canvas.getContext("2d");

    var gradient;
    switch (direction) {
      case "left-right":
        gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        break;
      case "diagonal-tlbr":
        gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        break;
      case "diagonal-trbl":
        gradient = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height);
        break;
      case "radial":
        gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) / 2,
        );
        break;
      default:
        gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    }

    colors.forEach(function (color, i) {
      gradient.addColorStop(i / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.toBlob(function (blob) {
      resolve(blob);
    }, "image/png");
  });
}

// ===== Theme History (chrome.storage) =====

/**
 * Load theme history from chrome.storage.local.
 *
 * @returns {Promise<ThemeConfig[]>}
 */
function loadHistory() {
  return new Promise(function (resolve) {
    try {
      chrome.storage.local.get("themeHistory", function (result) {
        resolve(result.themeHistory || []);
      });
    } catch {
      resolve([]);
    }
  });
}

/**
 * Save a ThemeConfig to history (max 10 entries).
 *
 * @param {ThemeConfig} config
 */
function saveToHistory(config) {
  loadHistory().then(function (history) {
    config.savedAt = new Date().toISOString();
    history.unshift(config);
    if (history.length > 10) history.length = 10;
    try {
      chrome.storage.local.set({ themeHistory: history }, function () {
        renderHistoryList();
      });
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  });
}

/**
 * Render the theme history list UI.
 */
function renderHistoryList() {
  loadHistory().then(function (history) {
    if (history.length === 0) {
      els.historyList.innerHTML =
        '<div class="history-empty">No saved themes yet.</div>';
      els.clearHistoryBtn.style.display = "none";
      return;
    }

    els.clearHistoryBtn.style.display = "inline-block";
    els.historyList.innerHTML = "";

    history.forEach(function (theme, i) {
      var item = document.createElement("div");
      item.className = "history-item";

      var swatch = document.createElement("div");
      swatch.className = "history-swatch";
      swatch.style.backgroundColor = theme.frameColor || "#4285f4";

      var info = document.createElement("div");
      info.className = "history-item-info";
      var nameEl = document.createElement("div");
      nameEl.className = "history-item-name";
      nameEl.textContent = theme.name || "Untitled Theme";
      var dateEl = document.createElement("div");
      dateEl.className = "history-item-date";
      dateEl.textContent = new Date(theme.savedAt).toLocaleDateString();
      info.appendChild(nameEl);
      info.appendChild(dateEl);

      var actions = document.createElement("div");
      actions.className = "history-item-actions";

      var loadBtn = document.createElement("button");
      loadBtn.className = "btn-small";
      loadBtn.textContent = "Load";
      loadBtn.setAttribute(
        "aria-label",
        "Load theme: " + (theme.name || "Untitled"),
      );
      loadBtn.addEventListener(
        "click",
        (function (t) {
          return function () {
            applyConfig(t);
            showToast('Loaded "' + (t.name || "Untitled") + '"', "info");
          };
        })(theme),
      );

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute(
        "aria-label",
        "Delete theme: " + (theme.name || "Untitled"),
      );
      deleteBtn.addEventListener(
        "click",
        (function (index) {
          return function () {
            history.splice(index, 1);
            chrome.storage.local.set({ themeHistory: history }, function () {
              renderHistoryList();
              showToast("Theme deleted", "info");
            });
          };
        })(i),
      );

      actions.appendChild(loadBtn);
      actions.appendChild(deleteBtn);
      item.appendChild(swatch);
      item.appendChild(info);
      item.appendChild(actions);
      els.historyList.appendChild(item);
    });
  });
}

// History toggle (collapsible)
els.historyToggle.addEventListener("click", function () {
  els.historyToggle.classList.toggle("open");
  els.historyContent.classList.toggle("open");
  var expanded = els.historyContent.classList.contains("open");
  els.historyToggle.setAttribute("aria-expanded", expanded);
});

els.historyToggle.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    els.historyToggle.click();
  }
});

els.clearHistoryBtn.addEventListener("click", function () {
  try {
    chrome.storage.local.set({ themeHistory: [] }, function () {
      renderHistoryList();
      showToast("History cleared", "info");
    });
  } catch (e) {
    console.error("Failed to clear history:", e);
  }
});

// ===== Download File Helper =====

/**
 * Download a file using the browser download API.
 *
 * NOTE: This helper is currently not used by the main
 * theme export workflow which relies on the File System API.
 *
 * @param {Blob} blob - File data.
 * @param {string} filename - Download filename.
 */
function downloadFile(blob, filename) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ===== Main Download Handler =====

els.confirmBtn.addEventListener("click", async function () {
  if (!validate()) return;

  var themeName = els.themeName.value || "My Custom Theme";
  var bgType = els.bgType.value;
  var bgBlob = null;
  var solidBgRGB = null;

  try {
    if (bgType === "gradient") {
      bgBlob = await createGradientBlob(
        state.gradientStops,
        els.gradDirection.value,
      );
    } else if (bgType === "image") {
      if (state.bgImageData) {
        bgBlob = dataURLtoBlob(state.bgImageData);
      }
    } else {
      // eslint-disable-next-line no-undef
      solidBgRGB = ThemeUtils.hexToRgb(els.bgColor.value);
    }
  } catch (e) {
    console.error("Error preparing background:", e);
    showToast("Error preparing background image.", "error");
    return;
  }

  var hasBackgroundImage = !!bgBlob;

  // eslint-disable-next-line no-undef
  var manifest = ThemeUtils.buildChromeThemeManifest({
    themeName: themeName,
    frameHex: els.frameColor.value,
    toolbarHex: els.toolbarColor.value,
    textHex: els.textColor.value,
    activeTabHex: els.activeTabColor.value,
    inactiveTabHex: els.inactiveTabColor.value,
    bgType: bgType,
    solidBgHex: bgType === "solid" ? els.bgColor.value : null,
    hasBackgroundImage: hasBackgroundImage,
  });

  // Add background-specific properties
  if (bgBlob) {
    manifest.theme.images = { theme_ntp_background: "background.png" };
    manifest.theme.properties = {
      ntp_background_alignment: "center",
      ntp_background_repeat: "no-repeat",
    };
    manifest.theme.colors.ntp_background = [255, 255, 255];
  } else if (solidBgRGB) {
    manifest.theme.colors.ntp_background = solidBgRGB;
  }

  // Pick a folder and write files directly into it
  try {
    var dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });

    var manifestHandle = await dirHandle.getFileHandle("manifest.json", {
      create: true,
    });
    var manifestWritable = await manifestHandle.createWritable();
    await manifestWritable.write(JSON.stringify(manifest, null, 2));
    await manifestWritable.close();

    if (bgBlob) {
      var bgHandle = await dirHandle.getFileHandle("background.png", {
        create: true,
      });
      var bgWritable = await bgHandle.createWritable();
      await bgWritable.write(bgBlob);
      await bgWritable.close();
    }

    saveToHistory(getCurrentConfig());
    showToast("Theme saved! Opening extensions page...", "success");
    setTimeout(function () {
      chrome.tabs.create({ url: "chrome://extensions" });
    }, 1500);
  } catch (e) {
    if (e.name === "AbortError") return;
    console.error("Error saving theme:", e);
    showToast("Error saving theme.", "error");
  }
});

// ===== Initialize =====

renderGradientStops();
renderHistoryList();
updatePreview();
