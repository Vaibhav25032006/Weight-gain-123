const GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/1krG5NFJ2Uo2tP90fgh9ZeuIJRN80GRkcbik63KXX2Es/edit?gid=339189941#gid=339189941";
const STORAGE_KEY = "wellness_planner_reports_v3";

const MEMBERS = [
  { id: "1205175935", name: "Vaibhav Vashisth", goal: "Muscle Building", weight: 68, bmi: 23.5 },
  { id: "1205172534", name: "Meenu Sharma", goal: "Healthy Fitness", weight: 67.6, bmi: 26.4 },
  { id: "1205190731", name: "Hemant Sharma", goal: "Weight Loss", weight: 80, bmi: 27.7 },
  { id: "1405100910", name: "User 1405", goal: "Weight Gain", weight: 85, bmi: 27.8 },
  { id: "1205174000", name: "Alka Jha", goal: "Weight Loss", weight: 72, bmi: 28.1 }
];

const PLANS = {
  "Kids": [
    plan("06:30 AM", "Lukewarm Water", "1 glass", false),
    plan("07:00 AM", "Morning Activity", "Exercise/Yoga/Stretching", true),
    plan("07:30 AM", "Breakfast", "DinoShake + Milk + Banana", true),
    plan("10:00 AM", "School Snack", "Seasonal fruit + almonds", true),
    plan("01:00 PM", "Lunch", "2 roti + dal + sabzi + curd + salad", true),
    plan("03:00 PM", "Light Snack", "Banana/Apple/Roasted chana/Makhana", true),
    plan("05:00 PM", "Outdoor Play", "Running/Cycling/Outdoor games", true),
    plan("06:00 PM", "Herbal Aloe", "Aloe in water", true),
    plan("07:30 PM", "Dinner", "Roti + vegetables", true),
    plan("09:00 PM", "Night Nutrition", "Warm milk", true),
    plan("10:00 PM", "Sleep", "Rest", false)
  ],
  "Healthy Fitness": [
    plan("06:00 AM", "Hydration", "1-2 glass lukewarm water", false),
    plan("06:30 AM", "Class + Afresh", "Motivation + Afresh 1 scoop", true),
    plan("07:30 AM", "Breakfast Shake", "Formula 1 + ShakeMate", true),
    plan("10:30 AM", "Mid Fruit", "Seasonal fruit", true),
    plan("01:00 PM", "Lunch", "2-3 roti + dal + sabzi + salad + curd", true),
    plan("02:00 PM", "Afresh", "1 scoop", true),
    plan("04:00 PM", "Evening Snack", "Makhana/Sprouts/Roasted chana", true),
    plan("05:00 PM", "Evening Class", "Yoga/Stretching", true),
    plan("06:00 PM", "Evening Activity", "Walk/Cycling", true),
    plan("08:00 PM", "Dinner", "Light dinner", true),
    plan("10:00 PM", "Night", "Warm milk/water", false)
  ],
  "Muscle Building": [
    plan("06:00 AM", "Hydration", "2 glass water", false),
    plan("06:30 AM", "Session + Afresh", "Afresh + banana/dates", true),
    plan("07:00 AM", "Workout", "Resistance/Core/HIIT", true),
    plan("08:15 AM", "Post Workout Shake", "F1 + PPP + ShakeMate", true),
    plan("09:00 AM", "Protein Breakfast", "Paneer/Chilla/Oats", true),
    plan("10:30 AM", "Snack", "Fruit + nuts", true),
    plan("01:00 PM", "Protein Lunch", "Roti + dal + paneer/tofu", true),
    plan("03:30 PM", "Energy Snack", "Roasted chana/makhana", true),
    plan("05:30 PM", "Evening Session", "PPP/F1 light shake", true),
    plan("08:00 PM", "Dinner", "Roti/rice + paneer/tofu", true),
    plan("10:00 PM", "Pre Sleep", "Milk + almonds + walnuts", false)
  ],
  "Weight Loss": [
    plan("06:00 AM", "Hydration", "1 glass lukewarm water", false),
    plan("06:30 AM", "Morning Club", "Workout + Afresh", true),
    plan("07:30 AM", "Shake", "F1 + ShakeMate + Fiber", true),
    plan("10:30 AM", "Snack", "Any fruit + Afresh after 10 min", true),
    plan("01:00 PM", "Lunch", "2 roti + sabzi + salad + curd", true),
    plan("02:00 PM", "Afresh", "2 spoons", true),
    plan("04:00 PM", "Evening Snack", "Fruits/salad/makhana", true),
    plan("05:00 PM", "Evening Club", "Workout + Afresh", true),
    plan("08:00 PM", "Dinner", "Shake or thin moong khichdi", true),
    plan("10:00 PM", "Sleep", "Rest", false)
  ],
  "Weight Gain": [
    plan("06:00 AM", "Hydration", "1 glass water", false),
    plan("06:30 AM", "Morning Club", "Wellness session", true),
    plan("08:00 AM", "Afresh", "1 scoop", true),
    plan("10:00 AM", "Breakfast", "F1 + ShakeMate", true),
    plan("12:00 PM", "Mid Snack", "Banana/chiku/mango", true),
    plan("01:00 PM", "Lunch", "4 roti + sabzi + salad + curd", true),
    plan("04:00 PM", "Afresh", "1 scoop", true),
    plan("05:00 PM", "Snack", "Tea + healthy snack", true),
    plan("08:00 PM", "Dinner", "Sprouts + dry fruits + 3 roti + sabzi", true),
    plan("10:00 PM", "Sleep", "Rest", false)
  ]
};

function plan(time, title, details, camera) { return { time, title, details, camera }; }

const reportStore = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
let activeUser = null;
let activePlan = [];

const $ = (id) => document.getElementById(id);
$("loadPlanBtn").addEventListener("click", handleLoad);
document.querySelectorAll(".tab-btn").forEach((btn) => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));

function handleLoad() {
  hideError();
  const isChild = $("childCheckbox").checked;
  const enteredId = $("memberIdInput").value.trim();

  if (isChild) {
    activeUser = { id: "CHILD", name: "Child User", goal: "Kids", weight: "--", bmi: "--" };
  } else {
    activeUser = MEMBERS.find((m) => m.id === enteredId);
    if (!activeUser) return showError("Valid member ID dijiye. Agar child user hai to checkbox select karein.");
  }

  activePlan = PLANS[activeUser.goal] || PLANS["Healthy Fitness"];
  renderDashboard();
  speakHindi(`Namaste. Aapka goal ${activeUser.goal} hai. Aaj ka plan ready hai.`);
}

function renderDashboard() {
  $("authSection").classList.add("hidden");
  $("dashboardSection").classList.remove("hidden");
  $("statusBadge").textContent = "Online";
  $("statusBadge").className = "text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700";

  $("profileName").textContent = activeUser.name;
  $("profileInfo").textContent = `Member ID: ${activeUser.id} | Weight: ${activeUser.weight} | BMI: ${activeUser.bmi}`;
  $("profileGoalLine").textContent = `Goal: ${activeUser.goal} | Sheet Source: ${GOOGLE_SHEET_URL} | Fruits similar allowed, Herbalife exact required.`;

  renderDietTab();
  renderTasksTab();
  renderReportsTab();
}

function renderDietTab() {
  $("tab-diet").innerHTML = activePlan.map((item) => `
    <div class="task-item">
      <div class="flex justify-between items-center gap-2">
        <h4 class="font-bold">${item.title}</h4>
        <span class="text-xs font-bold text-green-700">${item.time}</span>
      </div>
      <p class="text-sm text-slate-600 mt-1">${item.details}</p>
    </div>
  `).join("");
}

function renderTasksTab() {
  const key = getDayKey(activeUser.id, today());
  if (!reportStore[key]) reportStore[key] = { total: activePlan.length, items: {} };

  $("taskList").innerHTML = activePlan.map((item, idx) => {
    const taskId = `${idx}_${item.title.replace(/\s+/g, "_")}`;
    const checked = !!reportStore[key].items[taskId];
    const label = item.camera ? "Camera verification required" : "Sleep/rest task: direct tick";
    const color = item.camera ? "text-emerald-700" : "text-indigo-700";

    return `
      <label class="task-item flex gap-3 items-start">
        <input type="checkbox" class="mt-1" ${checked ? "checked" : ""} onchange="toggleTask('${taskId}', ${item.camera})" />
        <div>
          <p class="font-semibold">${item.title}</p>
          <p class="text-xs text-slate-500">${item.time} (2-hour open window)</p>
          <p class="text-sm text-slate-600">${item.details}</p>
          <p class="text-xs mt-1 ${color}">${label}</p>
        </div>
      </label>
    `;
  }).join("");

  updateProgress();
}

window.toggleTask = function toggleTask(taskId, needsCamera) {
  const key = getDayKey(activeUser.id, today());
  if (!reportStore[key]) reportStore[key] = { total: activePlan.length, items: {} };

  const next = !reportStore[key].items[taskId];
  if (next && needsCamera && !simulateCameraVerification()) {
    alert("Camera verification fail. Healthy similar fruit allowed hai, Herbalife item exact hona chahiye.");
    return;
  }

  reportStore[key].items[taskId] = next;
  persistReports();
  renderTasksTab();
  renderReportsTab();
};

function updateProgress() {
  const key = getDayKey(activeUser.id, today());
  const rec = reportStore[key] || { total: 1, items: {} };
  const done = Object.values(rec.items).filter(Boolean).length;
  const pct = Math.round((done / rec.total) * 100);

  $("progressLabel").textContent = `${pct}% (${done}/${rec.total})`;
  $("progressBar").style.width = `${pct}%`;
}

function renderReportsTab() {
  renderCalendar();
  drawChart($("dailyGraph"), buildDailySeries(activeUser.id, 7));
  drawChart($("monthlyGraph"), buildMonthlySeries(activeUser.id));
}

function renderCalendar() {
  const entries = Object.entries(reportStore)
    .filter(([k]) => k.startsWith(`${activeUser.id}__`))
    .sort((a, b) => a[0].localeCompare(b[0]));

  $("calendarReport").innerHTML = entries.length
    ? entries.map(([k, v]) => {
        const date = k.split("__")[1];
        const done = Object.values(v.items || {}).filter(Boolean).length;
        return `<div class="p-2 rounded border">${date}: ${done}/${v.total} tasks complete</div>`;
      }).join("")
    : `<p class="text-slate-500">No report data yet.</p>`;
}

function buildDailySeries(userId, days) {
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(0, 10);
    const rec = reportStore[getDayKey(userId, dStr)];
    const done = rec ? Object.values(rec.items || {}).filter(Boolean).length : 0;
    const pct = rec ? Math.round((done / rec.total) * 100) : 0;
    out.push({ label: dStr.slice(5), value: pct });
  }
  return out;
}

function buildMonthlySeries(userId) {
  const monthly = {};
  Object.entries(reportStore).forEach(([k, v]) => {
    if (!k.startsWith(`${userId}__`)) return;
    const month = k.split("__")[1].slice(0, 7);
    if (!monthly[month]) monthly[month] = { done: 0, total: 0 };

    const d = Object.values(v.items || {}).filter(Boolean).length;
    monthly[month].done += d;
    monthly[month].total += v.total;
  });

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([m, info]) => ({ label: m, value: info.total ? Math.round((info.done / info.total) * 100) : 0 }));
}

function drawChart(canvas, points) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width = canvas.clientWidth;
  const h = canvas.height = 120;
  ctx.clearRect(0, 0, w, h);
  if (!points.length) return;

  const stepX = points.length > 1 ? w / (points.length - 1) : w;

  ctx.beginPath();
  ctx.strokeStyle = "#4f46e5";
  ctx.lineWidth = 2;
  points.forEach((p, i) => {
    const x = i * stepX;
    const y = h - 16 - ((p.value || 0) / 100) * (h - 32);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.fillStyle = "#334155";
  ctx.font = "10px sans-serif";
  points.forEach((p, i) => ctx.fillText(p.label, i * stepX, h - 2));
}

function switchTab(tabName) {
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.add("hidden"));
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("tab-active"));

  $(`tab-${tabName}`).classList.remove("hidden");
  document.querySelector(`.tab-btn[data-tab='${tabName}']`).classList.add("tab-active");
}

function persistReports() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reportStore));
}

function getDayKey(userId, day) { return `${userId}__${day}`; }
function today() { return new Date().toISOString().slice(0, 10); }
function simulateCameraVerification() { return true; }

function showError(message) {
  $("errorText").textContent = message;
  $("errorText").classList.remove("hidden");
}

function hideError() {
  $("errorText").classList.add("hidden");
}

function speakHindi(text) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "hi-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
