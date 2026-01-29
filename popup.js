const resultEl = document.getElementById("result");
const countBtn = document.getElementById("countBtn");
const historyEl = document.getElementById("history");

/* ---------- Load saved data on popup open ---------- */

chrome.storage.local.get(["lastResult", "history"], (data) => {
  if (data.lastResult) {
    const { words, characters } = data.lastResult;
    resultEl.innerText = `Last:\nWords: ${words}\nCharacters: ${characters}`;
  }

  if (data.history) {
    renderHistory(data.history);
  }
});

/* ---------- Handle button click ---------- */

countBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getSelectedTextData
    },
    (results) => {
      if (!results || !results[0] || !results[0].result) {
        resultEl.innerText = "No text selected";
        return;
      }

      const { words, characters } = results[0].result;
      const time = Date.now();

      // Save last result
      chrome.storage.local.set({
        lastResult: { words, characters, time }
      });

      // Save history
      chrome.storage.local.get("history", (data) => {
        const history = data.history || [];

        history.unshift({ words, characters, time });

        const trimmedHistory = history.slice(0, 5);
        chrome.storage.local.set({ history: trimmedHistory });

        renderHistory(trimmedHistory);
      });

      resultEl.innerText = `Words: ${words}\nCharacters: ${characters}`;
    }
  );
});

/* ---------- Runs inside the webpage ---------- */
function getSelectedTextData() {
  const text = window.getSelection().toString().trim();
  if (!text) return null;

  return {
    words: text.split(/\s+/).length,
    characters: text.length
  };
}

/* ---------- Render history ---------- */
function renderHistory(items) {
  historyEl.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    const time = new Date(item.time).toLocaleTimeString();
    li.innerText = `${item.words} words • ${time}`;
    historyEl.appendChild(li);
  });
}
