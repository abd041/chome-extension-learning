document.getElementById("countBtn").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
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
        document.getElementById("result").innerText = "No text selected";
        return;
      }

      const { words, characters } = results[0].result;
      document.getElementById(
        "result"
      ).innerText = `Words: ${words}\nCharacters: ${characters}`;
    }
  );
});

function getSelectedTextData() {
  const text = window.getSelection().toString().trim();

  if (!text) return null;

  return {
    words: text.split(/\s+/).length,
    characters: text.length
  };
}
