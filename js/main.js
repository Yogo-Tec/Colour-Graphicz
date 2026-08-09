/**
 * Sri Mahavishnu Colour Graphicz - Main Application Logic
 * Dynamic Interactive Features, Calculators, Portfolio Filters & FAQs
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. Sticky Header Background Blur on Scroll
  // --------------------------------------------------------------------------
  const header = document.querySelector(".site-header");
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 2. Material Finish Inspector (CMYK / Metallic Foil / Spot UV)
  // --------------------------------------------------------------------------
  const finishTabBtns = document.querySelectorAll(".finish-tab-btn");
  const finishStage = document.getElementById("finishPreviewStage");
  const finishText = document.getElementById("finishPreviewText");
  const finishDesc = document.getElementById("finishPreviewDesc");

  if (finishTabBtns.length > 0 && finishStage) {
    const finishData = {
      cmyk: {
        stageClass: "",
        text: "CMYK PRINT",
        desc: "Full-color ultra-HD offset printing with 2400 DPI sharpness and vibrant RGB-to-CMYK color accuracy."
      },
      foil: {
        stageClass: "foil-mode",
        text: "GOLD FOIL",
        desc: "Hot metallic foil stamping in Gold, Rose Gold, Silver, and Holographic finishes for high-end luxury packaging."
      },
      uv: {
        stageClass: "uv-mode",
        text: "SPOT UV GLOSS",
        desc: "Precision raised spot UV varnish that creates a glassy 3D contrast over matte-laminated surfaces."
      }
    };

    finishTabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        finishTabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const mode = btn.dataset.mode || "cmyk";
        const data = finishData[mode] || finishData.cmyk;

        if (finishStage) finishStage.className = `finish-preview-stage ${data.stageClass}`;
        if (finishText) finishText.textContent = data.text;
        if (finishDesc) finishDesc.textContent = data.desc;
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Portfolio Category Filter Engine
  // --------------------------------------------------------------------------
  const portfolioTabs = document.querySelectorAll(".portfolio-tab");
  const portfolioItems = document.querySelectorAll(".portfolio-item-col");

  if (portfolioTabs.length > 0 && portfolioItems.length > 0) {
    portfolioTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        portfolioTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const category = tab.dataset.filter;

        portfolioItems.forEach((item) => {
          if (category === "all" || item.dataset.category === category) {
            item.style.display = "block";
            setTimeout(() => {
              item.style.opacity = "1";
              item.style.transform = "scale(1)";
            }, 50);
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.9)";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Live Dynamic Instant Quote / Price Estimator Widget
  // --------------------------------------------------------------------------
  const calcProduct = document.getElementById("calcProduct");
  const calcGSM = document.getElementById("calcGSM");
  const calcQuantity = document.getElementById("calcQuantity");
  const calcFinish = document.getElementById("calcFinish");
  const priceDisplay = document.getElementById("calcPriceDisplay");
  const priceUnitDisplay = document.getElementById("calcUnitDisplay");

  function calculateInstantEstimate() {
    if (!calcProduct || !calcGSM || !calcQuantity || !calcFinish || !priceDisplay) return;

    const basePriceMap = {
      box: 25,
      brochure: 12,
      label: 4,
      card: 3,
      catalogue: 85,
      rigid: 140
    };

    const gsmMultiplierMap = {
      170: 1.0,
      250: 1.2,
      300: 1.35,
      350: 1.5,
      board: 1.8
    };

    const finishMultiplierMap = {
      none: 1.0,
      matte: 1.15,
      gloss: 1.15,
      foil: 1.45,
      uv: 1.55,
      luxury: 1.85
    };

    const prod = calcProduct.value;
    const gsm = calcGSM.value;
    const qty = parseInt(calcQuantity.value, 10) || 500;
    const finish = calcFinish.value;

    const base = basePriceMap[prod] || 15;
    const gsmMult = gsmMultiplierMap[gsm] || 1.2;
    const finishMult = finishMultiplierMap[finish] || 1.2;

    // Quantity scale discount calculation
    let qtyDiscount = 1.0;
    if (qty >= 5000) qtyDiscount = 0.55;
    else if (qty >= 2000) qtyDiscount = 0.68;
    else if (qty >= 1000) qtyDiscount = 0.8;

    const unitPrice = base * gsmMult * finishMult * qtyDiscount;
    const totalPrice = Math.round(unitPrice * qty);

    priceDisplay.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;
    if (priceUnitDisplay) {
      priceUnitDisplay.textContent = `(Approx. ₹${unitPrice.toFixed(2)} per unit for ${qty.toLocaleString()} units)`;
    }
  }

  if (calcProduct && calcQuantity) {
    [calcProduct, calcGSM, calcQuantity, calcFinish].forEach((input) => {
      if (input) input.addEventListener("change", calculateInstantEstimate);
      if (input) input.addEventListener("input", calculateInstantEstimate);
    });
    calculateInstantEstimate();
  }

  // --------------------------------------------------------------------------
  // 5. FAQ Accordion & Live Search Filter
  // --------------------------------------------------------------------------
  const faqButtons = document.querySelectorAll(".faq-button");
  const faqSearch = document.getElementById("faqSearchInput");

  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const isActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("active"));
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });

  if (faqSearch) {
    faqSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".faq-item").forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 6. Live India Timezone Clock Widget
  // --------------------------------------------------------------------------
  const clockContainer = document.getElementById("liveIndiaClock");
  function updateIndiaClock() {
    if (!clockContainer) return;
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const timeStr = new Intl.DateTimeFormat("en-IN", options).format(now);
    clockContainer.textContent = `${timeStr} (IST)`;
  }
  if (clockContainer) {
    updateIndiaClock();
    setInterval(updateIndiaClock, 1000);
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Form Handler (Quote & Contact)
  // --------------------------------------------------------------------------
  const forms = document.querySelectorAll(".ajax-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const alertBox = form.querySelector(".form-alert");
      if (alertBox) {
        alertBox.className = "alert alert-success mt-3";
        alertBox.innerHTML = "<i class='bi bi-check-circle-fill me-2'></i> Thank you! Your request has been received. Our print specialist will contact you within 2 hours.";
        alertBox.style.display = "block";
      }
      form.reset();
    });
  });
});
