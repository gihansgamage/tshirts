/**
 * T-Shirt Live Interactive Customizer Studio
 * Handles real-time mockup rendering, color swatch selection, typography overlay, and live previews
 */

class TShirtCustomizer {
  constructor(config) {
    this.config = config;
    this.activePackage = "couple"; // 'couple' or 'name'

    // State for Couple T-Shirt Package
    this.coupleState = {
      letter1: "A",
      letter2: "S",
      shirt1Color: "light_pink",
      shirt1Size: "M",
      shirt2Color: "black",
      shirt2Size: "L",
      style: "heart_monogram",
      textColor: "auto"
    };

    // State for Name T-Shirt Package
    this.nameState = {
      text: "Alex",
      color: "white",
      size: "L",
      font: "font-streetwear",
      textColor: "#1E293B",
      position: "chest"
    };

    this.listeners = [];
  }

  // Subscribe to state changes
  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.getState()));
  }

  setPackage(pkgId) {
    if (this.config.packages[pkgId]) {
      this.activePackage = pkgId;
      this.notify();
    }
  }

  // Update Couple Package properties
  updateCouple(field, value) {
    if (field === "letter1" || field === "letter2") {
      value = (value || "").toUpperCase().slice(0, 1);
    }
    this.coupleState[field] = value;
    this.notify();
  }

  // Update Name Package properties
  updateName(field, value) {
    if (field === "text") {
      value = (value || "").slice(0, 18); // limit for realistic placement
    }
    this.nameState[field] = value;
    this.notify();
  }

  // Helper to retrieve color object
  getColorObject(colorId) {
    return this.config.colors.find(c => c.id === colorId) || this.config.colors[0];
  }

  // Helper to retrieve font object
  getFontObject(fontId) {
    return this.config.packages.name.fonts.find(f => f.id === fontId) || this.config.packages.name.fonts[0];
  }

  // Helper to determine optimal contrasting text color
  getContrastingTextColor(shirtColorId, preferredTextColor = "auto") {
    if (preferredTextColor && preferredTextColor !== "auto") {
      return preferredTextColor;
    }
    const colorObj = this.getColorObject(shirtColorId);
    return colorObj ? colorObj.textColorDefault : "#1E293B";
  }

  // Get full current state
  getState() {
    const isCouple = this.activePackage === "couple";
    const packageConfig = this.config.packages[this.activePackage];

    if (isCouple) {
      const shirt1ColorObj = this.getColorObject(this.coupleState.shirt1Color);
      const shirt2ColorObj = this.getColorObject(this.coupleState.shirt2Color);
      const shirt1TextCol = this.getContrastingTextColor(this.coupleState.shirt1Color, this.coupleState.textColor);
      const shirt2TextCol = this.getContrastingTextColor(this.coupleState.shirt2Color, this.coupleState.textColor);

      return {
        packageType: "couple",
        packageName: packageConfig.name,
        price: packageConfig.basePrice,
        data: {
          ...this.coupleState,
          shirt1ColorObj,
          shirt2ColorObj,
          shirt1TextCol,
          shirt2TextCol
        }
      };
    } else {
      const colorObj = this.getColorObject(this.nameState.color);
      const fontObj = this.getFontObject(this.nameState.font);

      return {
        packageType: "name",
        packageName: packageConfig.name,
        price: packageConfig.basePrice,
        data: {
          ...this.nameState,
          colorObj,
          fontObj
        }
      };
    }
  }

  // Generate visual monogram HTML based on chosen couple style
  getCoupleMonogramHtml(letter1, letter2, styleId, textColor) {
    const l1 = letter1 || "?";
    const l2 = letter2 || "?";
    
    switch (styleId) {
      case "heart_monogram":
        return `
          <div class="monogram-design style-heart" style="color: ${textColor};">
            <span class="letter l1">${l1}</span>
            <span class="connector heart-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <span class="letter l2">${l2}</span>
          </div>
        `;
      case "crown_royalty":
        return `
          <div class="monogram-design style-crown" style="color: ${textColor};">
            <div class="crown-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
              </svg>
            </div>
            <div class="letters-row">
              <span class="letter l1">${l1}</span>
              <span class="connector amp">&</span>
              <span class="letter l2">${l2}</span>
            </div>
          </div>
        `;
      case "minimal_serif":
        return `
          <div class="monogram-design style-serif" style="color: ${textColor};">
            <span class="letter l1">${l1}</span>
            <span class="connector dot">•</span>
            <span class="letter l2">${l2}</span>
            <div class="sub-est">EST. 2026</div>
          </div>
        `;
      case "modern_streetwear":
        return `
          <div class="monogram-design style-street" style="color: ${textColor};">
            <div class="badge-border">
              <span class="letter l1">${l1}</span>
              <span class="slash">/</span>
              <span class="letter l2">${l2}</span>
            </div>
          </div>
        `;
      case "aesthetic_script":
      default:
        return `
          <div class="monogram-design style-script" style="color: ${textColor};">
            <span class="letter l1">${l1}</span>
            <span class="connector heart-outline">♡</span>
            <span class="letter l2">${l2}</span>
          </div>
        `;
    }
  }

  // Render single letter monogram for individual shirt in couple set
  getIndividualLetterHtml(letter, partnerLabel, styleId, textColor) {
    const char = letter || "?";
    return `
      <div class="individual-monogram" style="color: ${textColor};">
        <div class="monogram-letter font-style-${styleId}">${char}</div>
        <div class="monogram-sub">${partnerLabel}</div>
      </div>
    `;
  }
}

window.TShirtCustomizer = TShirtCustomizer;
