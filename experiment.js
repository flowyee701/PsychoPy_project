"use strict";

const REQUIRED_SCENARIO_COLUMNS = [
  "scenario_id",
  "scenario_text",
  "option_1",
  "option_2",
  "option_1_type",
  "option_2_type",
];

const DATA_COLUMNS = [
  "participant_id",
  "session",
  "gender",
  "age",
  "education_profile",
  "trial_index",
  "scenario_id",
  "scenario_text",
  "option_1",
  "option_2",
  "option_1_type",
  "option_2_type",
  "first_response_key",
  "first_response_text",
  "first_response_type",
  "first_rt",
  "correctness_rating",
  "correctness_rating_rt",
  "second_response_key",
  "second_response_text",
  "second_response_type",
  "second_rt",
  "changed_response",
  "timestamp",
];

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwE3G9wZA0no5NcV1tp4GVMSOT6uliMItCydTl3iWOMuL3MB3SZvlA36xuRvNQcigrMiQ/exec";
const SUBMISSION_SECRET = "sce8_2026_05_12_M7q4T9x2";

const FALLBACK_SCENARIOS = [
  {
    scenario_id: "3",
    scenario_text: "Вы с нетерпением ждали вечеринку в честь Хэллоуина в этом году. У вас есть подходящая накидка, парик и шляпа. Всю неделю вы пытались усовершенствовать свой наряд, вырезая большое количество крошечных звездочек, чтобы приклеить их к накидке и шляпе, и вам еще предстоит их приклеить. В день Хэллоуина вы решаете, что костюм выглядит лучше без всех этих звездочек, над которыми вы так усердно трудились. Что вы сделаете?",
    option_1: "Приклею звездочки",
    option_2: "не буду приклеивать звездочки",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "6",
    scenario_text: "Вас попросили произнести тост на свадьбе вашего друга. Вы часами работали над одной историей о том, как вы с другом учились в автошколе, но вам еще нужно немного доработать ее. Затем вы понимаете, что сможете закончить написание речи быстрее, если начнёте заново и расскажете более смешную историю о совместных занятиях танцами. Что вы сделаете?",
    option_1: "Закончу тост про вождение",
    option_2: "перепишу тост про танцы",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "10",
    scenario_text: "Вы красите стены своей спальни в любимый цвет и рисуете узоры. На это уходит много времени. После того, как вы покрасили две из четырех стен, вы понимаете, что предпочли бы однотонный цвет вместо узоров . У вас осталось достаточно краски, чтобы перекрасить всю комнату в однотонный цвет. Это займет у вас столько же времени, сколько и завершение узора на двух оставшихся стенах. Что вы сделаете?",
    option_1: "продолжу нанесение узоров",
    option_2: "перекрашу комнату в однотонный цвет",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "11",
    scenario_text: "Вы потратили много времени на проект, и он, кажется, проваливается. У вас есть возможность начать что-то другое, что, как вы теперь знаете, имеет больше шансов на успех, но вы не можете вернуть время, потраченное на проект. Что вы сделаете?",
    option_1: "Продолжу заниматься проектом",
    option_2: "начну что-то другое",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "12",
    scenario_text: "Вы разрабатывали инвестиционную стратегию в течение нескольких месяцев. Она не работает, и вы теряете деньги, но у вас нет возможности вернуть потраченные усилия на разработку этой стратегии. Что вы сделаете?",
    option_1: "Начну разработку новой стратегии",
    option_2: "Продолжу в том же духе",
    option_1_type: "rational",
    option_2_type: "sunk_cost",
  },
  {
    scenario_id: "14",
    scenario_text: "Ваши отношения с партнёром складываются не очень хорошо. Вы много думали и поняли, что если бы вы знали, как всё сложится с самого начала, то не стали бы вступать в эти отношения. Теперь у вас есть возможность расстаться, но вы были вместе уже много месяцев. Что вы сделаете?",
    option_1: "Продолжу отношения",
    option_2: "Расстанусь",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "15",
    scenario_text: "Вы долго думали о том, как проголосовать на выборах, и потратили много времени, чтобы попытаться принять правильное решение, включая чтение газет, комментариев в интернете и серьёзное обдумывание всех вопросов. Вы обнаруживаете, что большая часть информации, которую вы читали, была ложной, а более надёжный источник указывает на то, что ваше первоначальное мнение было неверным. Что вы сделаете?",
    option_1: "Сохраню прежние убеждения",
    option_2: "Изменю свои убеждения",
    option_1_type: "sunk_cost",
    option_2_type: "rational",
  },
  {
    scenario_id: "16",
    scenario_text: "Вы усердно думали о том, как лучше всего добраться до места, где вы никогда раньше не были. К сожалению, ваше интернет-соединение не работает, поэтому вам приходится принимать решение, основываясь на своих представлениях о планировке города. Вы приходите к выводу о наилучшем возможном маршруте, но внезапно интернет снова появляется. Что вы сделаете?",
    option_1: "Посмотрите маршрут в телефоне",
    option_2: "пойдете по запланированному маршруту",
    option_1_type: "rational",
    option_2_type: "sunk_cost",
  },
];

const app = document.getElementById("app");

// State is kept in one object so every screen writes to the same data model.
const state = {
  participant: {},
  scenarios: [],
  rows: [],
  trialIndex: 0,
  currentTrial: null,
  screenStartedAt: 0,
  activeKeyHandler: null,
  usedScenarioFallback: false,
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  state.scenarios = await loadScenarios();
  renderStartScreen();
}

async function loadScenarios() {
  try {
    const response = await fetch("scenarios.csv", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Не удалось загрузить scenarios.csv: ${response.status}`);
    }
    const text = await response.text();
    const parsed = parseCSV(text);
    validateScenarios(parsed);
    return parsed;
  } catch (error) {
    // Opening index.html as file:// often blocks fetch, so the experiment falls back
    // to the same scenarios embedded below and remains testable without a server.
    state.usedScenarioFallback = true;
    validateScenarios(FALLBACK_SCENARIOS);
    return FALLBACK_SCENARIOS.map((scenario) => ({ ...scenario }));
  }
}

function validateScenarios(scenarios) {
  if (scenarios.length !== 8) {
    throw new Error(`В сценариях должно быть ровно 8 строк, найдено ${scenarios.length}`);
  }

  const firstScenario = scenarios[0] || {};
  const missingColumns = REQUIRED_SCENARIO_COLUMNS.filter(
    (column) => !(column in firstScenario),
  );
  if (missingColumns.length > 0) {
    throw new Error(`В scenarios.csv не хватает колонок: ${missingColumns.join(", ")}`);
  }
}

function parseCSV(text) {
  // Small CSV parser for quoted Russian text, commas and line breaks.
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        cell += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  const headers = rows.shift().map((header) => header.trim().replace(/^\uFEFF/, ""));
  return rows.map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    return record;
  });
}

function setScreen(html) {
  removeKeyHandler();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

function renderStartScreen() {
  setScreen(`
    <section class="card narrow">
      <h1 class="screen-title">Психологический эксперимент</h1>
      <form id="participant-form" class="form-grid">
        <div class="field">
          <label for="gender">Пол</label>
          <input id="gender" name="gender" autocomplete="off">
        </div>
        <div class="field">
          <label for="age">Возраст</label>
          <input id="age" name="age" inputmode="numeric" autocomplete="off">
        </div>
        <div class="field">
          <label for="education_profile">Профиль образования</label>
          <input id="education_profile" name="education_profile" autocomplete="off">
        </div>
        <p id="warning" class="warning"></p>
        <div class="actions">
          <button class="primary-button" type="submit">Начать</button>
        </div>
      </form>
      ${state.usedScenarioFallback ? "<p class=\"notice\">Файл scenarios.csv не был загружен браузером, используются встроенные сценарии</p>" : ""}
    </section>
  `);

  const form = document.getElementById("participant-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const participantId = makeParticipantId();
    const sessionId = makeSessionId();

    state.participant = {
      participant_id: participantId,
      session: sessionId,
      gender: String(formData.get("gender") || "").trim(),
      age: String(formData.get("age") || "").trim(),
      education_profile: String(formData.get("education_profile") || "").trim(),
    };
    saveProgress();
    renderWelcomeScreen();
  });
}

function renderWelcomeScreen() {
  renderInstructionScreen(
    "Здравствуйте! Меня зовут Анна, я обучаюсь на 4 курсе факультета психологии и провожу исследование в рамках написания дипломной работы. Прохождение исследования не займет у Вас более 20 минут. Вас будет ждать несколько заданий, и перед каждым из них будет представлена краткая инструкция.",
    "Нажмите “Продолжить”, чтобы перейти к следующему экрану",
    startNextTrial,
  );
}

function renderFastInstruction() {
  renderInstructionScreen(
    "Сейчас Вам будет предложен сценарий. Ваша задача — как можно быстрее дать первый ответ, который пришел Вам в голову.",
    "Нажмите “Продолжить”, чтобы перейти к сценарию",
    renderFirstResponseScreen,
  );
}

function renderSecondInstruction() {
  renderInstructionScreen(
    "Сейчас Вам предстоит дать ответ на тот же самый сценарий, однако теперь Вы не ограничены во времени и можете потратить на решение столько времени, сколько необходимо.\n\nВы можете изменить свой ответ и дать тот, который считаете правильным.",
    "Нажмите “Продолжить”, чтобы перейти к сценарию",
    renderSecondResponseScreen,
  );
}

function renderInstructionScreen(text, buttonText, nextAction) {
  setScreen(`
    <section class="card">
      <p class="lead">${escapeHTML(text).replace(/\n/g, "<br>")}</p>
      <div class="actions">
        <button id="continue-button" class="primary-button" type="button">${escapeHTML(buttonText)}</button>
      </div>
    </section>
  `);
  const continueOnce = once(nextAction);
  document.getElementById("continue-button").addEventListener("click", continueOnce);
  setKeyHandler([" "], continueOnce);
}

function startNextTrial() {
  if (state.trialIndex >= state.scenarios.length) {
    renderFinalScreen();
    return;
  }

  state.currentTrial = {
    trial_index: state.trialIndex + 1,
    scenario: state.scenarios[state.trialIndex],
  };
  renderFastInstruction();
}

function renderFirstResponseScreen() {
  renderChoiceScreen("first", (key, rt) => {
    const scenario = state.currentTrial.scenario;
    const choice = getChoiceDetails(scenario, key);
    state.currentTrial.first_response_key = key;
    state.currentTrial.first_response_text = choice.responseText;
    state.currentTrial.first_response_type = choice.responseType;
    state.currentTrial.first_rt = formatSeconds(rt);
    saveProgress();
    renderRatingScreen();
  });
}

function renderSecondResponseScreen() {
  renderChoiceScreen("second", (key, rt) => {
    const scenario = state.currentTrial.scenario;
    const choice = getChoiceDetails(scenario, key);
    state.currentTrial.second_response_key = key;
    state.currentTrial.second_response_text = choice.responseText;
    state.currentTrial.second_response_type = choice.responseType;
    state.currentTrial.second_rt = formatSeconds(rt);
    completeTrial();
  });
}

function renderChoiceScreen(phase, onAnswer) {
  const scenario = state.currentTrial.scenario;
  const progressText = `Сценарий ${state.currentTrial.trial_index} из ${state.scenarios.length}`;
  setScreen(`
    <section class="card">
      <p class="scenario-progress">${progressText}</p>
      <div class="scenario-text">${escapeHTML(scenario.scenario_text)}</div>
      <div class="options">
        <button class="choice-button" type="button" data-key="1">1 — ${escapeHTML(scenario.option_1)}</button>
        <button class="choice-button" type="button" data-key="2">2 — ${escapeHTML(scenario.option_2)}</button>
      </div>
      <p class="hint">
        Нажмите клавишу 1, если выбираете первый вариант<br>
        Нажмите клавишу 2, если выбираете второй вариант
      </p>
    </section>
  `);

  const answerOnce = once((key) => onAnswer(key, performance.now() - state.screenStartedAt));
  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => answerOnce(button.dataset.key));
  });
  setKeyHandler(["1", "2"], answerOnce);
  state.screenStartedAt = performance.now();

  if (phase === "first" || phase === "second") {
    saveProgress();
  }
}

function renderRatingScreen() {
  setScreen(`
    <section class="card narrow">
      <h1 class="screen-title">Оцените, как Вам кажется, насколько правильным является данный Вами ответ</h1>
      <div class="rating-scale" aria-label="Шкала оценки правильности">
        ${[1, 2, 3, 4, 5, 6, 7].map((value) => `<button class="rating-button" type="button" data-key="${value}">${value}</button>`).join("")}
      </div>
      <div class="scale-labels">
        <span>1 — ответ совсем не кажется правильным</span>
        <span>7 — ответ кажется полностью правильным</span>
      </div>
      <p class="hint">Нажмите клавишу от 1 до 7</p>
    </section>
  `);

  const answerOnce = once((key) => {
    state.currentTrial.correctness_rating = key;
    state.currentTrial.correctness_rating_rt = formatSeconds(
      performance.now() - state.screenStartedAt,
    );
    saveProgress();
    renderSecondInstruction();
  });
  document.querySelectorAll(".rating-button").forEach((button) => {
    button.addEventListener("click", () => answerOnce(button.dataset.key));
  });
  setKeyHandler(["1", "2", "3", "4", "5", "6", "7"], answerOnce);
  state.screenStartedAt = performance.now();
}

function completeTrial() {
  // One output row is written only after the second response is complete.
  const trial = state.currentTrial;
  const scenario = trial.scenario;
  const row = {
    participant_id: state.participant.participant_id,
    session: state.participant.session,
    gender: state.participant.gender,
    age: state.participant.age,
    education_profile: state.participant.education_profile,
    trial_index: trial.trial_index,
    scenario_id: scenario.scenario_id,
    scenario_text: scenario.scenario_text,
    option_1: scenario.option_1,
    option_2: scenario.option_2,
    option_1_type: scenario.option_1_type,
    option_2_type: scenario.option_2_type,
    first_response_key: trial.first_response_key,
    first_response_text: trial.first_response_text,
    first_response_type: trial.first_response_type,
    first_rt: trial.first_rt,
    correctness_rating: trial.correctness_rating,
    correctness_rating_rt: trial.correctness_rating_rt,
    second_response_key: trial.second_response_key,
    second_response_text: trial.second_response_text,
    second_response_type: trial.second_response_type,
    second_rt: trial.second_rt,
    changed_response: trial.first_response_key !== trial.second_response_key ? 1 : 0,
    timestamp: new Date().toISOString(),
  };

  state.rows.push(row);
  state.trialIndex += 1;
  state.currentTrial = null;
  saveProgress();
  startNextTrial();
}

function renderFinalScreen() {
  setScreen(`
    <section class="card narrow">
      <h1 class="screen-title">Спасибо за участие!</h1>
      <p class="lead">Файл с результатами необходимо отправить исследователю.</p>
      <p id="send-status" class="notice">Подготовка результатов</p>
      <div class="actions">
        <button id="download-button" class="primary-button" type="button">Скачать результаты</button>
      </div>
      <p class="download-note">Если скачивание не началось автоматически, нажмите кнопку еще раз</p>
    </section>
  `);
  document.getElementById("download-button").addEventListener("click", downloadResults);
  saveProgress();
  sendResultsToGoogleSheets();
}

function getChoiceDetails(scenario, key) {
  if (key === "1") {
    return {
      responseText: scenario.option_1,
      responseType: scenario.option_1_type,
    };
  }

  return {
    responseText: scenario.option_2,
    responseType: scenario.option_2_type,
  };
}

function setKeyHandler(validKeys, callback) {
  removeKeyHandler();
  state.activeKeyHandler = (event) => {
    if (validKeys.includes(event.key)) {
      event.preventDefault();
      callback(event.key);
    }
  };
  document.addEventListener("keydown", state.activeKeyHandler);
}

function removeKeyHandler() {
  if (state.activeKeyHandler) {
    document.removeEventListener("keydown", state.activeKeyHandler);
    state.activeKeyHandler = null;
  }
}

function once(callback) {
  let used = false;
  return (...args) => {
    if (used) {
      return;
    }
    used = true;
    removeKeyHandler();
    callback(...args);
  };
}

function saveProgress() {
  const payload = {
    secret: SUBMISSION_SECRET,
    participant: state.participant,
    rows: state.rows,
    trialIndex: state.trialIndex,
    currentTrial: state.currentTrial,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("sce8_two_response_progress", JSON.stringify(payload));
}

async function sendResultsToGoogleSheets() {
  const statusElement = document.getElementById("send-status");

  if (!GOOGLE_APPS_SCRIPT_URL) {
    statusElement.textContent = "Автоматическая отправка в Google Таблицу пока не настроена";
    return;
  }

  statusElement.textContent = "Отправляем результаты в Google Таблицу";

  const payload = {
    participant: state.participant,
    rows: state.rows,
    columns: DATA_COLUMNS,
    submitted_at: new Date().toISOString(),
  };

  try {
    await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    localStorage.setItem("sce8_two_response_last_submit", JSON.stringify(payload));
    statusElement.textContent = "Запрос на отправку выполнен, проверьте Google Таблицу";
  } catch (error) {
    localStorage.setItem("sce8_two_response_submit_error", String(error));
    statusElement.textContent = "Не удалось отправить результаты автоматически, скачайте CSV и отправьте исследователю";
  }
}

function downloadResults() {
  const csv = rowsToCSV(state.rows);
  const timestamp = fileTimestamp(new Date());
  const participantId = sanitizeFilePart(state.participant.participant_id || "unknown");
  const filename = `participant_${participantId}_${timestamp}.csv`;
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function rowsToCSV(rows) {
  const header = DATA_COLUMNS.join(",");
  const body = rows.map((row) => DATA_COLUMNS.map((column) => escapeCSV(row[column])).join(","));
  return [header, ...body].join("\r\n");
}

function escapeCSV(value) {
  const text = value === undefined || value === null ? "" : String(value);
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatSeconds(milliseconds) {
  return (milliseconds / 1000).toFixed(4);
}

function fileTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "_",
    pad(date.getHours()),
    "-",
    pad(date.getMinutes()),
    "-",
    pad(date.getSeconds()),
  ].join("");
}

function sanitizeFilePart(value) {
  return String(value).replace(/[^a-zA-Zа-яА-ЯёЁ0-9_-]/g, "_");
}

function makeParticipantId() {
  return `p_${fileTimestamp(new Date()).replace(/-/g, "")}`;
}

function makeSessionId() {
  return `s_${Date.now()}`;
}
