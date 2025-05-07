document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");

  chrome.storage.local.get(["running"], (data) => {
    toggleButton.textContent = data.running ? "⏸ Parar" : "▶ Iniciar";
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get(["running"], (data) => {
      let isRunning = !data.running;
      chrome.runtime.sendMessage({ action: isRunning ? "start" : "stop" });
      chrome.storage.local.set({ running: isRunning });
      toggleButton.textContent = isRunning ? "⏸ Parar" : "▶ Iniciar";
    });
  });
});