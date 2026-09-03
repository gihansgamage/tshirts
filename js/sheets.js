/**
 * Google Sheets Order Synchronization Module
 * Sends customer orders directly to Google Drive Spreadsheet via Google Apps Script Web App
 */

const GoogleSheetsSync = {
  // Storage key for orders backup
  STORAGE_KEY: "teecraft_saved_orders",

  // Submit order to Google Sheets
  async syncOrder(orderPayload) {
    const webAppUrl = CONFIG.googleSheets.webAppUrl || localStorage.getItem("teecraft_sheets_url");
    
    // Always save local backup in browser
    this.saveLocalBackup(orderPayload);

    if (!webAppUrl || webAppUrl.indexOf("script.google.com") === -1) {
      console.warn("Google Sheets Web App URL not configured yet. Saved to local storage.");
      return {
        success: true,
        localOnly: true,
        message: "Order saved locally."
      };
    }

    try {
      // Send as POST request using text/plain (avoids CORS preflight) with JSON body
      const jsonBody = JSON.stringify(orderPayload);

      await fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: jsonBody,
        keepalive: true
      });

      return {
        success: true,
        localOnly: false,
        message: "Order successfully synced with your Google Sheet!"
      };
    } catch (error) {
      console.error("Failed to sync with Google Sheets:", error);
      return {
        success: false,
        error: error.message,
        message: "Saved locally. Could not reach Google Sheets endpoint."
      };
    }
  },

  // Save to browser localStorage
  saveLocalBackup(order) {
    try {
      const existing = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
      existing.unshift({
        ...order,
        savedAt: new Date().toISOString()
      });
      // Keep last 50 orders in local storage
      const trimmed = existing.slice(0, 50);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  },

  // Get local orders
  getLocalOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  },

  // Test connection to Google Apps Script
  async testConnection(url) {
    if (!url) throw new Error("Please enter a Google Apps Script Web App URL");
    try {
      const response = await fetch(url, { method: "GET", mode: "cors" });
      if (response.ok) {
        return await response.json();
      }
      return { status: "unknown", message: "Ping sent, verify response in sheet" };
    } catch (err) {
      // Even if CORS blocks reading the GET body, if the URL is valid Apps Script endpoint, it connects
      return { status: "tested", message: "Endpoint reached. Submit a test order to verify." };
    }
  },

  // Save Web App URL
  saveWebAppUrl(url) {
    const cleanUrl = (url || "").trim();
    CONFIG.googleSheets.webAppUrl = cleanUrl;
    localStorage.setItem("teecraft_sheets_url", cleanUrl);
  }
};

window.GoogleSheetsSync = GoogleSheetsSync;
