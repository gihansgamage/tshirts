/**
 * TeeCraft - Professional Order Controller & State Management
 */

document.addEventListener("DOMContentLoaded", () => {
  // State for Couple T-Shirt Package (Both M = 5000 base)
  const coupleState = {
    packageId: "couple",
    packageName: "Couple T-Shirt",
    price: 5000,
    letter1: "A",
    letter2: "S",
    shirt1Color: "light_pink",
    shirt1Size: "M",
    shirt2Color: "light_pink",
    shirt2Size: "M"
  };

  // State for Name Printing Package (M = 2700 base)
  const nameState = {
    packageId: "name",
    packageName: "Name Printing",
    price: 2700,
    name: "Alex",
    gender: "boy", // "boy" or "girl"
    color: "white",
    size: "M"
  };

  // Active checkout package tracker
  let activeCheckoutPackage = "couple";

  // Init UI Components
  initGenderSelector();
  initColorSwatches();
  initSizeSelectors();
  initInputs();
  initCheckoutModal();
  initSizeGuideModal();

  // Header WhatsApp link sync
  const headerWhatsappLink = document.querySelector(".header-whatsapp-btn");
  if (headerWhatsappLink && window.CONFIG && CONFIG.business && CONFIG.business.whatsappNumber) {
    const cleanNum = CONFIG.business.whatsappNumber.replace(/[^0-9]/g, "");
    headerWhatsappLink.href = `https://api.whatsapp.com/send?phone=${cleanNum}`;
  }

  // Initial calculation and images update
  updatePricesUI();
  updateCoupleImages();
  updateNameImage();

  /**
   * Dynamic Price Calculation based on selected size tiers
   * XS, S, M = Base price (Couple: 5000, Name: 2700)
   * L, XL = +100 per shirt
   * XXL, 3XL = +200 per shirt
   */
  function calculateCouplePrice(size1, size2) {
    const surcharge1 = (CONFIG.sizeSurcharges && CONFIG.sizeSurcharges[size1]) || 0;
    const surcharge2 = (CONFIG.sizeSurcharges && CONFIG.sizeSurcharges[size2]) || 0;
    const base = (CONFIG.packages && CONFIG.packages.couple && CONFIG.packages.couple.basePrice) || 5000;
    return base + surcharge1 + surcharge2;
  }

  function calculateNamePrice(size) {
    const surcharge = (CONFIG.sizeSurcharges && CONFIG.sizeSurcharges[size]) || 0;
    const base = (CONFIG.packages && CONFIG.packages.name && CONFIG.packages.name.basePrice) || 2700;
    return base + surcharge;
  }

  function updatePricesUI() {
    // 1. Update couple state & UI badge
    coupleState.price = calculateCouplePrice(coupleState.shirt1Size, coupleState.shirt2Size);
    const couplePriceEl = document.getElementById("couple-price-display");
    if (couplePriceEl) {
      couplePriceEl.textContent = `${CONFIG.business.currencySymbol} ${coupleState.price.toLocaleString()}`;
    }

    // 2. Update name state & UI badge
    nameState.price = calculateNamePrice(nameState.size);
    const namePriceEl = document.getElementById("name-price-display");
    if (namePriceEl) {
      namePriceEl.textContent = `${CONFIG.business.currencySymbol} ${nameState.price.toLocaleString()}`;
    }
  }

  /**
   * Model / Gender Selector (Boy / Girl for Name Printing)
   */
  function initGenderSelector() {
    const genderBtns = document.querySelectorAll("#name-gender-selector .gender-btn");
    genderBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedGender = btn.dataset.gender;
        if (!selectedGender) return;
        nameState.gender = selectedGender;
        genderBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateNameImage();
      });
    });
  }

  /**
   * Helper: Subtle size scale multiplier for realistic mock visual
   * Smooth step of ~3% between sizes
   */
  function getSizeScale(size) {
    const scaleMap = {
      "XS": 0.94,
      "S": 0.97,
      "M": 1.0,
      "L": 1.03,
      "XL": 1.06,
      "XXL": 1.09,
      "3XL": 1.12
    };
    return scaleMap[size] || 1.0;
  }

  /**
   * Color Swatches Generator & Click Listeners
   */
  function initColorSwatches() {
    // 1. Couple Shirt 1 Swatches
    renderSwatches("couple-shirt1-swatches", "couple-s1", (colorId) => {
      coupleState.shirt1Color = colorId;
      updateCoupleImages();
    });

    // 2. Couple Shirt 2 Swatches
    renderSwatches("couple-shirt2-swatches", "couple-s2", (colorId) => {
      coupleState.shirt2Color = colorId;
      updateCoupleImages();
    });

    // 3. Name Printing Swatches
    renderSwatches("name-color-swatches", "name-s", (colorId) => {
      nameState.color = colorId;
      updateNameImage();
    });
  }

  function renderSwatches(containerId, groupKey, onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    CONFIG.colors.forEach(col => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `color-circle group-${groupKey}`;
      btn.dataset.colorId = col.id;
      btn.title = col.name;
      btn.style.backgroundColor = col.hex;
      btn.innerHTML = `<span class="circle-check">✓</span>`;

      btn.addEventListener("click", () => {
        document.querySelectorAll(`.color-circle.group-${groupKey}`).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        onSelect(col.id);
      });

      container.appendChild(btn);
    });

    // Set initial active swatch
    if (groupKey === "couple-s1") setActiveSwatch(groupKey, coupleState.shirt1Color);
    if (groupKey === "couple-s2") setActiveSwatch(groupKey, coupleState.shirt2Color);
    if (groupKey === "name-s") setActiveSwatch(groupKey, nameState.color);
  }

  function setActiveSwatch(groupKey, colorId) {
    const btn = document.querySelector(`.color-circle.group-${groupKey}[data-color-id="${colorId}"]`);
    if (btn) btn.classList.add("active");
  }

  /**
   * Size Selectors Generator & Click Listeners
   */
  function initSizeSelectors() {
    // 1. Couple Shirt 1 Sizes
    renderSizes("couple-shirt1-sizes", "couple-s1-size", (size) => {
      coupleState.shirt1Size = size;
      updateCoupleImages();
      updatePricesUI();
    }, coupleState.shirt1Size);

    // 2. Couple Shirt 2 Sizes
    renderSizes("couple-shirt2-sizes", "couple-s2-size", (size) => {
      coupleState.shirt2Size = size;
      updateCoupleImages();
      updatePricesUI();
    }, coupleState.shirt2Size);

    // 3. Name Printing Sizes
    renderSizes("name-sizes", "name-size", (size) => {
      nameState.size = size;
      updateNameImage();
      updatePricesUI();
    }, nameState.size);
  }

  function renderSizes(containerId, groupKey, onSelect, initialSize) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    CONFIG.sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `size-btn group-${groupKey} ${size === initialSize ? "active" : ""}`;
      btn.textContent = size;

      btn.addEventListener("click", () => {
        document.querySelectorAll(`.size-btn.group-${groupKey}`).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        onSelect(size);
      });

      container.appendChild(btn);
    });
  }

  /**
   * Text & Letters Inputs
   */
  function initInputs() {
    const l1Input = document.getElementById("couple-letter-1");
    const l2Input = document.getElementById("couple-letter-2");
    const nameInput = document.getElementById("name-input-text");

    if (l1Input) {
      l1Input.addEventListener("input", (e) => {
        coupleState.letter1 = (e.target.value || "").toUpperCase().slice(0, 1);
      });
    }

    if (l2Input) {
      l2Input.addEventListener("input", (e) => {
        coupleState.letter2 = (e.target.value || "").toUpperCase().slice(0, 1);
      });
    }

    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        nameState.name = (e.target.value || "").trim();
      });
    }
  }

  /**
   * Update Image Previews cleanly upon color & size changes
   */
  function updateCoupleImages() {
    const s1Obj = getColor(coupleState.shirt1Color);
    const s2Obj = getColor(coupleState.shirt2Color);

    const s1Img = document.getElementById("couple-s1-img");
    const s2Img = document.getElementById("couple-s2-img");

    if (s1Img && s1Obj) {
      s1Img.src = s1Obj.girlImage || s1Obj.flatImage;
      s1Img.alt = `Partner 1 (Girl) in ${s1Obj.name} T-Shirt`;
      s1Img.style.setProperty("--s1-scale", getSizeScale(coupleState.shirt1Size));
    }
    if (s2Img && s2Obj) {
      s2Img.src = s2Obj.boyImage || s2Obj.flatImage;
      s2Img.alt = `Partner 2 (Boy) in ${s2Obj.name} T-Shirt`;
      s2Img.style.setProperty("--s2-scale", getSizeScale(coupleState.shirt2Size));
    }
  }

  function updateNameImage() {
    const colObj = getColor(nameState.color);
    const nameImg = document.getElementById("name-preview-img");

    if (nameImg && colObj) {
      const isGirl = nameState.gender === "girl";
      nameImg.src = isGirl
        ? (colObj.girlImage || colObj.flatImage)
        : (colObj.boyImage || colObj.flatImage);
      nameImg.alt = `Custom ${colObj.name} T-Shirt 3D Mockup (${isGirl ? "Girl" : "Boy"})`;

      const scaleVal = getSizeScale(nameState.size);
      nameImg.style.transform = `scale(${scaleVal})`;
    }
  }

  function getColor(colorId) {
    return CONFIG.colors.find(c => c.id === colorId) || CONFIG.colors[0];
  }

  /**
   * Helper to detect mobile device
   */
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints > 1 && window.innerWidth <= 1024);
  }

  /**
   * Checkout Modal & WhatsApp Order Flow
   */
  function initCheckoutModal() {
    const coupleCheckoutBtn = document.getElementById("btn-checkout-couple");
    const nameCheckoutBtn = document.getElementById("btn-checkout-name");
    const checkoutModal = document.getElementById("checkout-modal");
    const closeCheckoutBtn = document.getElementById("btn-close-checkout");
    const orderForm = document.getElementById("order-checkout-form");
    const closeSuccessBtn = document.getElementById("btn-success-close");

    if (coupleCheckoutBtn) {
      coupleCheckoutBtn.addEventListener("click", () => {
        activeCheckoutPackage = "couple";
        resetCheckoutModalView();
        populateModalSummary("couple");
        openModal(checkoutModal);
      });
    }

    if (nameCheckoutBtn) {
      nameCheckoutBtn.addEventListener("click", () => {
        activeCheckoutPackage = "name";
        resetCheckoutModalView();
        populateModalSummary("name");
        openModal(checkoutModal);
      });
    }

    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener("click", () => {
        closeModal(checkoutModal);
        resetCheckoutModalView();
      });
    }

    if (closeSuccessBtn) {
      closeSuccessBtn.addEventListener("click", () => {
        closeModal(checkoutModal);
        resetCheckoutModalView();
      });
    }

    if (orderForm) {
      orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleOrderSubmission();
      });
    }
  }

  function resetCheckoutModalView() {
    const summaryBox = document.getElementById("modal-summary-content");
    const orderForm = document.getElementById("order-checkout-form");
    const successView = document.getElementById("order-success-view");
    if (summaryBox) summaryBox.style.display = "block";
    if (orderForm) orderForm.style.display = "block";
    if (successView) successView.style.display = "none";
  }

  function populateModalSummary(pkgType) {
    const container = document.getElementById("modal-summary-content");
    if (!container) return;

    if (pkgType === "couple") {
      const s1Col = getColor(coupleState.shirt1Color).name;
      const s2Col = getColor(coupleState.shirt2Color).name;
      container.innerHTML = `
        <div class="summary-row">
          <span class="summary-label">Package:</span>
          <span class="summary-val font-bold">Couple T-Shirt (Set of 2)</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Initials:</span>
          <span class="summary-val">${coupleState.letter1 || "A"} & ${coupleState.letter2 || "S"}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Partner 1:</span>
          <span class="summary-val">${s1Col} (Size ${coupleState.shirt1Size})</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Partner 2:</span>
          <span class="summary-val">${s2Col} (Size ${coupleState.shirt2Size})</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Price:</span>
          <span class="summary-val font-bold">${CONFIG.business.currencySymbol} ${coupleState.price.toLocaleString()}</span>
        </div>
      `;
    } else {
      const col = getColor(nameState.color).name;
      const modelName = nameState.gender === "girl" ? "Girl" : "Boy";
      container.innerHTML = `
        <div class="summary-row">
          <span class="summary-label">Package:</span>
          <span class="summary-val font-bold">Name Printing (1 Shirt)</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Model:</span>
          <span class="summary-val">${modelName}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Name / Text:</span>
          <span class="summary-val">"${nameState.name || "Alex"}"</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Color & Size:</span>
          <span class="summary-val">${col} (Size ${nameState.size})</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">Total Price:</span>
          <span class="summary-val font-bold">${CONFIG.business.currencySymbol} ${nameState.price.toLocaleString()}</span>
        </div>
      `;
    }
  }

  function handleOrderSubmission() {
    const nameInput = document.getElementById("customer-name");
    const phoneInput = document.getElementById("customer-phone");
    const addressInput = document.getElementById("customer-address");
    const cityInput = document.getElementById("customer-city");
    const paymentInput = document.getElementById("customer-payment");
    const notesInput = document.getElementById("customer-notes");

    const customerName = nameInput ? nameInput.value.trim() : "";
    const customerPhone = phoneInput ? phoneInput.value.trim() : "";
    const customerAddress = addressInput ? addressInput.value.trim() : "";
    const customerCity = cityInput ? cityInput.value.trim() : "";
    const paymentMethod = paymentInput ? paymentInput.value : "Cash on Delivery (COD)";
    const notes = notesInput ? notesInput.value.trim() : "None";

    if (!customerName || !customerPhone || !customerAddress) {
      showToast("Please fill in all required customer details.");
      return;
    }

    const orderId = "TC-" + Math.floor(100000 + Math.random() * 900000);
    const isCouple = activeCheckoutPackage === "couple";

    // Prepare Google Sheets payload
    const orderPayload = {
      orderId: orderId,
      packageType: isCouple ? "Couple T-Shirt" : "Name Printing",
      totalPrice: isCouple ? coupleState.price : nameState.price,
      customerName: customerName,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      customerCity: customerCity,
      paymentMethod: paymentMethod,
      delivery: "Free Delivery",
      notes: notes,
      timestamp: new Date().toISOString()
    };

    if (isCouple) {
      orderPayload.model = "Girl & Boy";
      orderPayload.customText = `Initials: ${coupleState.letter1} & ${coupleState.letter2}`;
      orderPayload.shirt1Color = getColor(coupleState.shirt1Color).name;
      orderPayload.shirt1Size = coupleState.shirt1Size;
      orderPayload.shirt2Color = getColor(coupleState.shirt2Color).name;
      orderPayload.shirt2Size = coupleState.shirt2Size;
    } else {
      orderPayload.model = nameState.gender === "girl" ? "Girl" : "Boy";
      orderPayload.customText = `Name: ${nameState.name || "Custom"}`;
      orderPayload.shirt1Color = getColor(nameState.color).name;
      orderPayload.shirt1Size = nameState.size;
      orderPayload.shirt2Color = "-";
      orderPayload.shirt2Size = "-";
    }

    // 1. Synchronously save order to local storage backup
    GoogleSheetsSync.saveLocalBackup(orderPayload);

    // 2. Fire Google Sheets sync in background without blocking UI or user gesture
    GoogleSheetsSync.syncOrder(orderPayload).catch(err => {
      console.warn("Google Sheets background sync:", err);
    });

    // 3. Generate clean WhatsApp message & universal mobile-friendly URL
    const whatsappMsg = buildCleanWhatsAppMessage(orderPayload, isCouple);
    const rawNumber = CONFIG.business.whatsappNumber || "94773248579";
    const cleanNumber = rawNumber.replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(whatsappMsg);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMsg}`;

    // 4. Update Modal UI to Success & WhatsApp direct fallback View
    const summaryBox = document.getElementById("modal-summary-content");
    const orderForm = document.getElementById("order-checkout-form");
    const successView = document.getElementById("order-success-view");
    const successBadge = document.getElementById("success-order-id-badge");
    const successLink = document.getElementById("success-whatsapp-link");

    if (summaryBox) summaryBox.style.display = "none";
    if (orderForm) {
      orderForm.style.display = "none";
      orderForm.reset();
    }
    if (successBadge) successBadge.textContent = `Order ID: ${orderPayload.orderId}`;
    if (successLink) successLink.href = whatsappUrl;
    if (successView) successView.style.display = "block";

    showToast("Connecting to WhatsApp...");

    // 5. Open WhatsApp using Mobile-Optimized Strategy during the active User Gesture
    const isMobile = isMobileDevice();

    if (isMobile) {
      // Direct navigation launches WhatsApp app directly via Universal Links / Android Intent
      window.location.href = whatsappUrl;
    } else {
      // Desktop: Open in new tab; fallback to location if blocked
      const newTab = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
        window.location.href = whatsappUrl;
      }
    }
  }

  function buildCleanWhatsAppMessage(order, isCouple) {
    let msg = `NEW T-SHIRT ORDER - ${CONFIG.business.name.toUpperCase()}\n`;
    msg += `----------------------------------------\n`;
    msg += `Order ID: ${order.orderId}\n`;
    msg += `Package: ${order.packageType}\n\n`;

    if (isCouple) {
      msg += `Initials: ${coupleState.letter1} & ${coupleState.letter2}\n\n`;
      msg += `Partner 1 (Initial: ${coupleState.letter1}):\n`;
      msg += `- Color: ${getColor(coupleState.shirt1Color).name}\n`;
      msg += `- Size: ${coupleState.shirt1Size}\n\n`;
      msg += `Partner 2 (Initial: ${coupleState.letter2}):\n`;
      msg += `- Color: ${getColor(coupleState.shirt2Color).name}\n`;
      msg += `- Size: ${coupleState.shirt2Size}\n`;
    } else {
      msg += `Custom Name: "${nameState.name}"\n`;
      msg += `- Model: ${nameState.gender === "girl" ? "Girl" : "Boy"}\n`;
      msg += `- Color: ${getColor(nameState.color).name}\n`;
      msg += `- Size: ${nameState.size}\n`;
    }

    msg += `\n----------------------------------------\n`;
    msg += `Customer Details:\n`;
    msg += `- Name: ${order.customerName}\n`;
    msg += `- Phone: ${order.customerPhone}\n`;
    msg += `- Address: ${order.customerAddress}\n`;
    if (order.customerCity) msg += `- City: ${order.customerCity}\n`;
    msg += `- Delivery: Free Island-wide Delivery\n`;
    msg += `- Payment Method: ${order.paymentMethod}\n`;
    if (order.notes && order.notes !== "None") msg += `- Notes: ${order.notes}\n`;

    msg += `\nTotal Amount: ${CONFIG.business.currencySymbol} ${order.totalPrice.toLocaleString()}\n`;
    msg += `----------------------------------------\n`;
    msg += `Please confirm my order and dispatch details.`;

    return msg;
  }

  /**
   * Size Guide Modal
   */
  function initSizeGuideModal() {
    const openBtns = document.querySelectorAll(".btn-open-size-guide");
    const modal = document.getElementById("size-guide-modal");
    const closeBtn = document.getElementById("btn-close-size-guide");
    const tbody = document.getElementById("size-table-body");

    if (tbody && CONFIG.sizeChart) {
      tbody.innerHTML = CONFIG.sizeChart.map(r => {
        const surcharge = (CONFIG.sizeSurcharges && CONFIG.sizeSurcharges[r.size]) || 0;
        const priceBadge = surcharge > 0 
          ? `<span style="display: inline-block; padding: 2px 8px; background-color: #FEF3C7; color: #92400E; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">+ Rs. ${surcharge}</span>`
          : `<span style="color: var(--text-secondary); font-size: 0.82rem;">Standard</span>`;

        return `
          <tr>
            <td><strong>${r.size}</strong></td>
            <td>${r.chestIn}"</td>
            <td>${r.lengthIn}"</td>
            <td>${r.chestCm} cm</td>
            <td>${r.lengthCm} cm</td>
            <td>${priceBadge}</td>
          </tr>
        `;
      }).join("");
    }

    openBtns.forEach(b => b.addEventListener("click", () => openModal(modal)));
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
  }

  /**
   * Modal & Toast Helpers
   */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".modal-backdrop").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  function showToast(msg) {
    let wrap = document.getElementById("toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "toast-wrap";
      wrap.className = "toast-wrap";
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }
});
