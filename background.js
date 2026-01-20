function setMonacoValue(text) {
  const maxWaitMs = 15000;
  const intervalMs = 200;
  const startTime = Date.now();

  const timer = setInterval(() => {
    const monaco = window.monaco;
    const model = monaco && monaco.editor ? monaco.editor.getModels()[0] : null;
    if (model) {
      clearInterval(timer);
      model.setValue('');
      model.setValue(text);
      return;
    }
    if (Date.now() - startTime >= maxWaitMs) {
      clearInterval(timer);
      console.warn('Monaco model not available in page.');
    }
  }, intervalMs);
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!message || message.type !== 'SET_MONACO_VALUE') {
    return;
  }
  if (!sender.tab || !sender.tab.id) {
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: sender.tab.id },
    world: 'MAIN',
    func: setMonacoValue,
    args: [message.text],
  });
});
