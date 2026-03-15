// document.getElementById('openLink').addEventListener('click', () => {
//   chrome.tabs.create({ url: 'https://console.apify.com/actors/IoSHqwTR9YGhzccez/input' });
// });

// document.getElementById('extractBtn').addEventListener('click', () => {
//   // Triggers the background script to scrape Monaco and open the results tab
//   chrome.runtime.sendMessage({ type: 'OPEN_RESULTS_TAB' });
// });

document.getElementById('configBtn').addEventListener('click', () => {
  const rawInput = document.getElementById('domainInput').value;
  // Convert newline-separated text into a clean array
  const domains = rawInput.split('\n').map(d => d.trim()).filter(d => d !== "");

  if (domains.length === 0) {
    alert("Please paste at least one domain.");
    return;
  }

  const dynamicLeadParam = {
    company_domain: domains,
    email_status: ["validated"],
    fetch_count: 100, // Updated to 100 as requested
    file_name: "Dynamic Lead Export",
    seniority_level: ["c_suite", "founder", "owner", "director", "vp", "head"],
    contact_location: ["india"] 
  };

  // Save the parameters to storage for content.js to pick up
  chrome.storage.local.set({ activeLeadParams: dynamicLeadParam }, () => {
    const apifyUrl = "https://console.apify.com/actors/IoSHqwTR9YGhzccez/input";
    chrome.tabs.create({ url: apifyUrl });
  });
});

document.getElementById('extractBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'OPEN_RESULTS_TAB' });
});