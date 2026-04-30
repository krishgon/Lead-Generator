const BACKEND_URL = 'http://localhost:5000'; // Change to live URL

function showView(viewId) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('mainAppView').style.display = 'none';
  document.getElementById('forgotView').style.display = 'none';
  document.getElementById(viewId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['authToken', 'activeUserId'], (res) => {
    if (res.authToken && res.activeUserId) showView('mainAppView');
  });
  
  if (!document.getElementById('showForgotBtn')) {
    const loginForm = document.getElementById('loginView');
    const forgotLink = document.createElement('div');
    forgotLink.innerHTML = `<span id="showForgotBtn" class="logout-text" style="display:block; text-align:center; margin-top:15px;">Forgot Password?</span>`;
    loginForm.appendChild(forgotLink);
    document.getElementById('showForgotBtn').addEventListener('click', () => {
      showView('forgotView'); document.getElementById('resetMessage').innerText = '';
    });
  }
});

document.getElementById('backToLoginBtn').addEventListener('click', () => showView('loginView'));

// LOGIN
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errorDiv = document.getElementById('loginError');

  if (!email || !password) return errorDiv.style.display = 'block';
  document.getElementById('loginBtn').innerText = "Authenticating...";

  try {
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.error) { errorDiv.innerText = data.error; errorDiv.style.display = 'block'; } 
    else {
      chrome.storage.local.set({ authToken: data.token, activeUserId: data.user.id }, () => {
        showView('mainAppView'); errorDiv.style.display = 'none';
      });
    }
  } catch (err) { errorDiv.innerText = "Network error."; errorDiv.style.display = 'block'; }
  document.getElementById('loginBtn').innerText = "Secure Login";
});

// FORGOT PASSWORD
document.getElementById('sendResetBtn').addEventListener('click', async () => {
  const email = document.getElementById('resetEmail').value.trim();
  const msgDiv = document.getElementById('resetMessage');
  if (!email) return msgDiv.innerText = "Please enter your email.";
  
  msgDiv.style.color = "#555"; msgDiv.innerText = "Sending request...";
  document.getElementById('sendResetBtn').disabled = true;
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/forgot-password`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
    });
    const data = await response.json();
    if (data.error) { msgDiv.style.color = "#d73a49"; msgDiv.innerText = data.error; } 
    else { msgDiv.style.color = "#28a745"; msgDiv.innerText = "Reset email sent."; }
  } catch (err) { msgDiv.style.color = "#d73a49"; msgDiv.innerText = "Network error."; }
  document.getElementById('sendResetBtn').disabled = false;
});

// LOGOUT
document.getElementById('logoutBtn').addEventListener('click', () => {
  chrome.storage.local.remove(['authToken', 'activeUserId'], () => {
    showView('loginView'); document.getElementById('loginBtn').innerText = "Secure Login";
  });
});

// EXTENSION PRE-FLIGHT CHECK
async function verifyUsageAccess(buttonId) {
  const errorDiv = document.getElementById('extError');
  const btn = document.getElementById(buttonId);
  const originalText = btn.innerText;
  
  errorDiv.style.display = 'none';
  btn.innerText = "Verifying..."; btn.disabled = true;

  try {
    const res = await chrome.storage.local.get(['activeUserId']);
    if (!res.activeUserId) throw new Error("Authentication missing.");

    const response = await fetch(`${BACKEND_URL}/api/extension/use`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: res.activeUserId })
    });
    const data = await response.json();

    if (data.error) {
      errorDiv.innerText = data.error; errorDiv.style.display = 'block';
      btn.innerText = originalText; btn.disabled = false;
      return false; 
    }
    btn.innerText = originalText; btn.disabled = false;
    return true; 
  } catch (err) {
    errorDiv.innerText = "Error verifying access. Backend might be down."; errorDiv.style.display = 'block';
    btn.innerText = originalText; btn.disabled = false;
    return false;
  }
}

document.getElementById('configBtn').addEventListener('click', async () => {
  const domains = document.getElementById('domainInput').value.split('\n').map(d => d.trim()).filter(d => d !== "");
  if (domains.length === 0) return alert("Please paste at least one domain.");

  const isAllowed = await verifyUsageAccess('configBtn');
  if (!isAllowed) return; 

  const dynamicLeadParam = {
    company_domain: domains, email_status: ["validated"], fetch_count: 100, 
    file_name: "Dynamic Lead Export", seniority_level: ["c_suite", "founder", "owner", "director", "vp", "head"],
    contact_location: ["india"] 
  };
  chrome.storage.local.set({ activeLeadParams: dynamicLeadParam }, () => {
    chrome.tabs.create({ url: "https://console.apify.com/actors/IoSHqwTR9YGhzccez/input" });
  });
});

document.getElementById('extractBtn').addEventListener('click', async () => {
  const isAllowed = await verifyUsageAccess('extractBtn');
  if (!isAllowed) return; 
  chrome.runtime.sendMessage({ type: 'OPEN_RESULTS_TAB' });
});