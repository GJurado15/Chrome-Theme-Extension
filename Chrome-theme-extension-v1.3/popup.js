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
 * Theme configuration object shape for import/export/history.
 *
 * @typedef {Object} ThemeConfig
 * @property {string} name
 * @property {"solid"|"gradient"|"image"} bgType
 * @property {string} bgColor
 * @property {string[]} gradColors
 * @property {string} gradDirection
 * @property {string} frameColor
 * @property {string} toolbarColor
 * @property {string} activeTabColor
 * @property {string} inactiveTabColor
 * @property {string} textColor
 * @property {string|null} bgImageData
 * @property {string|null} bgImageName
 * @property {string} [savedAt]
 */

/**
 * Convert a base64 data URL to a Blob.
 *
 * @param {string} dataurl - Data URL (e.g. "data:image/png;base64,...")
 * @returns {Blob}
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

/** @type {Record<string, any>} */
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
  importFileInput: document.getElementById("importFileInput"),
  frameColor: document.getElementById("frameColor"),
  toolbarColor: document.getElementById("toolbarColor"),
  activeTabColor: document.getElementById("activeTabColor"),
  inactiveTabColor: document.getElementById("inactiveTabColor"),
  textColor: document.getElementById("textColor"),
  confirmBtn: document.getElementById("confirmBtn"),
  resetBtn: document.getElementById("resetBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
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
        })(i)
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
      els.previewContent.style.background = "radial-gradient(circle, " + stops + ")";
    } else {
      els.previewContent.style.background = "linear-gradient(" + cssDir + ", " + stops + ")";
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
["frameColor", "toolbarColor", "activeTabColor", "inactiveTabColor", "textColor", "bgColor"].forEach(
  function (id) {
    document.getElementById(id).addEventListener("input", updatePreview);
  }
);
els.gradDirection.addEventListener("change", updatePreview);

document.getElementById("bgImageBtn").addEventListener("click", function () {
  els.bgImageFile.click();
});

els.bgImageFile.addEventListener("change", function () {
  var file = els.bgImageFile.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB.", "error");
      els.bgImageFile.value = "";
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      state.bgImageData = e.target.result;
      state.bgImageName = file.name;
      els.fileNameDisplay.textContent = file.name;
      updatePreview();
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
 * Apply a ThemeConfig (or preset-like object) to the UI.
 *
 * @param {Object} config - Config/preset object. May be a ThemeConfig or a preset shape.
 */
function applyConfig(config) {
  if (config.name !== undefined) els.themeName.value = config.name;
  if (config.frameColor) els.frameColor.value = config.frameColor;
  if (config.toolbarColor) els.toolbarColor.value = config.toolbarColor;
  if (config.activeTabColor) els.activeTabColor.value = config.activeTabColor;
  if (config.inactiveTabColor) els.inactiveTabColor.value = config.inactiveTabColor;
  if (config.textColor) els.textColor.value = config.textColor;

  if (config.bgType) {
    els.bgType.value = config.bgType;
    els.solidGroup.style.display = config.bgType === "solid" ? "block" : "none";
    els.gradientGroup.style.display = config.bgType === "gradient" ? "block" : "none";
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
 * Validate inputs before generating theme output.
 *
 * @returns {boolean}
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
 * Create a PNG gradient background using Canvas and return it as a Blob.
 *
 * @param {string[]} colors
 * @param {string} direction
 * @returns {Promise<Blob>}
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
          Math.max(canvas.width, canvas.height) / 2
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
      els.historyList.innerHTML = '<div class="history-empty">No saved themes yet.</div>';
      return;
    }

    els.historyList.innerHTML = "";

    history.forEach(function (theme, i) {
      var item = document.createElement("div");
      item.className = "history-item";

      var info = document.createElement("div");
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
      loadBtn.setAttribute("aria-label", "Load theme: " + (theme.name || "Untitled"));
      loadBtn.addEventListener(
        "click",
        (function (t) {
          return function () {
            applyConfig(t);
            showToast('Loaded "' + (t.name || "Untitled") + '"', "info");
          };
        })(theme)
      );

      var deleteBtn = document.createElement("button");
      deleteBtn.className = "btn-danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.setAttribute("aria-label", "Delete theme: " + (theme.name || "Untitled"));
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
        })(i)
      );

      actions.appendChild(loadBtn);
      actions.appendChild(deleteBtn);
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

// ===== Export / Import =====

els.exportBtn.addEventListener("click", function () {
  var config = getCurrentConfig();
  var json = JSON.stringify(config, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  // eslint-disable-next-line no-undef
  var filename = ThemeUtils.sanitizeFilename(config.name, "theme-config") + ".json";
  downloadFile(blob, filename);
  showToast("Config exported!", "success");
});

els.importBtn.addEventListener("click", function () {
  els.importFileInput.click();
});

els.importFileInput.addEventListener("change", function () {
  var file = els.importFileInput.files[0];
  if (!file) return;

  if (file.name.endsWith(".json")) {
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var config = JSON.parse(ev.target.result);
        applyConfig(config);
        showToast("Config imported!", "success");
      } catch {
        showToast("Invalid JSON config.", "error");
      }
    };
    reader.readAsText(file);
  } else if (file.name.endsWith(".zip")) {
    // eslint-disable-next-line no-undef
    JSZip.loadAsync(file).then(function (zip) {
      var configFile = zip.file("theme-config.json");
      if (!configFile) {
        showToast("No theme-config.json found in zip.", "error");
        return;
      }
      configFile.async("string").then(function (text) {
        try {
          var config = JSON.parse(text);
          applyConfig(config);
          showToast("Config imported from zip!", "success");
        } catch {
          showToast("Invalid config in zip.", "error");
        }
      });
    }).catch(function () {
      showToast("Could not read zip file.", "error");
    });
  } else {
    showToast("Select a .json or .zip file.", "error");
  }
  els.importFileInput.value = "";
});

// ===== Download File Helper =====

/**
 * Trigger a download in the browser for a given Blob.
 *
 * @param {Blob} blob
 * @param {string} filename
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
      bgBlob = await createGradientBlob(state.gradientStops, els.gradDirection.value);
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

  // Generate and download
  try {
    if (bgBlob) {

      var zip = new JSZip();
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("background.png", bgBlob);
      zip.file("theme-config.json", JSON.stringify(getCurrentConfig(), null, 2));
      var content = await zip.generateAsync({ type: "blob" });
      downloadFile(content, "theme.zip");
    } else {
      var jsonString = JSON.stringify(manifest, null, 2);
      var blob = new Blob([jsonString], { type: "application/json" });
      downloadFile(blob, "manifest.json");
    }

    saveToHistory(getCurrentConfig());
    showToast("Theme downloaded!", "success");
  } catch (e) {
    console.error("Error generating theme:", e);
    showToast("Error generating theme.", "error");
  }
});

// ===== Initialize =====

renderGradientStops();
renderHistoryList();
updatePreview();
