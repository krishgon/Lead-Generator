document.getElementById('openLink').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://console.apify.com/actors/IoSHqwTR9YGhzccez/input' });
});