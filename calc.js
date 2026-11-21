/* ==========================================================
   calc.js – حاسبة الحصص + تحكم الأسعار (بدون تنبيهات)
   ========================================================== */

// 1️⃣ الأسعار الافتراضية
const DEFAULT_PRICES = {
  "الشعير (حبوب)"      : 35,
  "الذرة (حبوب)"       : 40,
  "كسب الصوجا"         : 80,
  "نخالة القمح"        : 25,
  "تفل الشمندر"        : 20,
  "التبن"              : 15,
  "دريس الشوفان"       : 22,
  "دريس الفصة"         : 30,
  "الشعير الأخضر"      : 18,
  "الحلفاء"            : 12,
  "الشيح"              : 15,
  "مركب معدني (CMV)"   : 150,
  "الملح"              : 10,
  "الكلس"              : 8
};

/* -------------------------------------------------- */
function loadPrices() {
  const saved = localStorage.getItem("feedPrices");
  return saved ? Object.assign({}, DEFAULT_PRICES, JSON.parse(saved))
               : Object.assign({}, DEFAULT_PRICES);
}

function savePrices() {
  const prices = {};
  document.querySelectorAll(".price-input").forEach(function (input) {
    const name = input.getAttribute("data-name");
    const val  = parseFloat(input.value);
    prices[name] = isNaN(val) ? 0 : val;
  });
  localStorage.setItem("feedPrices", JSON.stringify(prices));
  calculateRation();
}

function buildPriceControls() {
  const grid = document.getElementById("prices-grid");
  if (!grid) return;
  const prices = loadPrices();
  grid.innerHTML = "";
  Object.keys(DEFAULT_PRICES).forEach(function (name) {
    const val = prices[name] !== undefined ? prices[name] : DEFAULT_PRICES[name];
    const div = document.createElement("div");
    div.style.cssText = "background:#fff;padding:12px;border:1px solid #ccc;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.06)";
    div.innerHTML = `
      <label style="display:block;font-weight:bold;margin-bottom:6px;color:#333;">${name}</label>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="number" class="price-input" data-name="${name}" value="${val}" step="0.5" min="0"
               style="flex:1;padding:7px 10px;border:1px solid #bbb;border-radius:5px;font-size:14px;">
        <span style="color:#888;font-size:13px;">DA/كغ</span>
      </div>`;
    grid.appendChild(div);
  });
}

/* -------------------------------------------------- */
function calculateRation() {

  const stageIdx = parseInt(document.getElementById("calc-stage").value);
  const animals  = parseFloat(document.getElementById("calc-animals").value);
  const weight   = parseFloat(document.getElementById("calc-weight").value);
  const result   = document.getElementById("calc-result");
  const warnings = document.getElementById("warnings"); // لا نحتاج له الآن، لكنه يبقى موجودًا

  // لا نحتاج أي فحص للتحذيرات هنا
  if (isNaN(animals) || animals <= 0) {
    result.innerHTML = '<p style="color:red;padding:10px">⚠️ أدخل عدد الحيوانات.</p>';
    return;
  }

  const stage  = FarmData.STAGES[stageIdx];
  const ration = FarmData.RATIONS[stageIdx];
  const feeds  = FarmData.FEEDS;

  if (!stage || !ration) {
    result.innerHTML = '<p style="color:red;padding:10px">⚠️ مرحلة غير موجودة.</p>';
    return;
  }

  const prices = loadPrices();

  let rows             = "";
  let totalKgPerAnimal = 0;
  let totalCost        = 0;
  const totalWeight    = animals * weight;

  ration.forEach(function (pair) {
    const feedIdx  = pair[0];
    const qty      = pair[1];
    const feed     = feeds[feedIdx];
    if (!feed) return;

    const feedName = feed[0];
    const feedCat  = feed[1];
    const price    = (prices[feedName] !== undefined) ? prices[feedName] : 30;
    const qtyTotal = qty * animals;
    const cost     = qtyTotal * price;

    totalKgPerAnimal += qty;
    totalCost        += cost;

    rows += `<tr>
      <td style="text-align:right;padding:6px 10px">${feedName}</td>
      <td style="padding:6px 10px;text-align:center">${qty} كغ</td>
      <td style="padding:6px 10px;text-align:center">${qtyTotal.toFixed(2)} كغ</td>
      <td style="padding:6px 10px;text-align:center;color:#888">${feedCat}</td>
      <td style="padding:6px 10px;text-align:center;color:#27ae60;">${cost.toFixed(0)} DA</td>
    </tr>`;
  });

  const totalKgAll = (totalKgPerAnimal * animals).toFixed(2);

  // ---------- بناء النتيجة ----------
  result.innerHTML = `
    <h3 style="color:#4a90d9;margin:0 0 6px;">${stage[0]}</h3>
    <p style="color:#888;font-size:13px;margin:0 0 12px;">
      المادة الجافة: <b>${stage[1]}–${stage[2]} كغ</b> · الطاقة: <b>${stage[4]}–${stage[5]} ${stage[3]}</b>
    </p>

    <div style="overflow-x:auto;">
      <table style="border-collapse:collapse;width:100%;font-size:14px;border:1px solid #ddd;border-radius:8px;">
        <thead style="background:#f0f4ff;">
          <tr>
            <th style="padding:9px 10px;text-align:right">العلف</th>
            <th style="padding:9px 10px">لكل رأس</th>
            <th style="padding:9px 10px">للقطيع (${animals} رأس)</th>
            <th style="padding:9px 10px">الفئة</th>
            <th style="padding:9px 10px">التكلفة</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot style="font-weight:bold;background:#f0fff4;">
          <tr>
            <td style="padding:9px 10px;text-align:right">المجموع</td>
            <td style="padding:9px 10px;text-align:center">${totalKgPerAnimal.toFixed(2)} كغ</td>
            <td style="padding:9px 10px;text-align:center">${totalKgAll} كغ</td>
            <td></td>
            <td style="padding:9px 10px;text-align:center;color:#27ae60;font-size:16px">${totalCost.toFixed(0)} DA</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p style="color:#e67e22;font-size:13px;margin-top:12px;">
      ⚠️ أضف دائماً حجر ملح ومكمل معدني خاص بالأغنام.
    </p>
  `;
}

/* -------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  buildPriceControls();

  const saveBtn = document.getElementById("save-prices");
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      savePrices();
      saveBtn.textContent = "✅ تم الحفظ!";
      saveBtn.style.background = "#27ae60";
      setTimeout(() => { saveBtn.textContent = "حفظ الأسعار"; saveBtn.style.background = ""; }, 2000);
    });
  }

  const resetBtn = document.getElementById("reset-prices");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("هل تريد إعادة جميع الأسعار إلى القيم الافتراضية؟")) {
        localStorage.removeItem("feedPrices");
        buildPriceControls();
        calculateRation();
        resetBtn.textContent = "✅ تمت الإعادة!";
        setTimeout(() => { resetBtn.textContent = "إعادة التعيين"; }, 2000);
      }
    });
  }

  const calcBtn = document.getElementById("calc-btn");
  const calcSel = document.getElementById("calc-stage");
  if (calcBtn) calcBtn.addEventListener("click", calculateRation);
  if (calcSel) calcSel.addEventListener("change", calculateRation);

  calculateRation();
});