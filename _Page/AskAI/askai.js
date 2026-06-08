const SITE_PAGES = [
  { title: "Home", url: "../../index.html" },
  { title: "About", url: "../About/about.html" },
  { title: "Smart City", url: "../SmartCity/smart.html" },
  { title: "Smart Environment", url: "../SmartEnvironment/environment.html" },
  { title: "Urban Greenspace", url: "../UrbanGreenspace/UrbanGreenSpace.html" },
  { title: "IoT", url: "../IoT/iot.html" },
  { title: "Citizen Engagement", url: "../CitizenEngagement/citizenengagement.html" },
  { title: "Gallery", url: "../Gallery/gallery.html" },
  { title: "Contact", url: "../Contact/contact.html" }
];

const API_KEY_STORAGE = "urbanify_gemini_api_key";
const CONVERSATION_HISTORY_STORAGE = "urbanify_conversation_history";
const MAX_PAGE_TEXT = 3200;
const MAX_CONTEXT_CHARS = 8200;
const MAX_HISTORY_MESSAGES = 4;
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

let siteIndex = [];
let conversationHistory = [];

function normalizeText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function loadConversationHistory() {
  const stored = localStorage.getItem(CONVERSATION_HISTORY_STORAGE);
  conversationHistory = stored ? JSON.parse(stored) : [];
  return conversationHistory;
}

function saveConversationHistory() {
  localStorage.setItem(CONVERSATION_HISTORY_STORAGE, JSON.stringify(conversationHistory));
}

function addToHistory(question, answer, sources = []) {
  conversationHistory.push({
    id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    question: question.trim(),
    answer: answer.trim(),
    sources: sources,
    timestamp: new Date().toISOString(),
    starred: false
  });
  
  // Keep only last MAX_HISTORY_MESSAGES for context
  if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY_MESSAGES);
  }
  
  saveConversationHistory();
}

function getConversationContext() {
  if (conversationHistory.length === 0) {
    return "";
  }
  
  let context = "Previous conversation context:\n";
  conversationHistory.forEach((msg, index) => {
    context += `Q${index + 1}: ${msg.question}\nA${index + 1}: ${msg.answer}\n\n`;
  });
  
  return context;
}

function clearConversationHistory() {
  conversationHistory = [];
  localStorage.removeItem(CONVERSATION_HISTORY_STORAGE);
}

function renderHistoryList(itemsToShow = conversationHistory) {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  if (itemsToShow.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        <i class="fa-regular fa-comment-dots"></i>
        <p>Belum ada riwayat percakapan</p>
      </div>`;
    return;
  }

  historyList.innerHTML = "";
  itemsToShow.forEach((item) => {
    const div = document.createElement("div");
    div.className = `history-item ${item.starred ? "starred" : ""}`;

    const starBtn = document.createElement("button");
    starBtn.type = "button";
    starBtn.className = `history-item-star ${item.starred ? "active" : ""}`;
    starBtn.textContent = item.starred ? "⭐" : "☆";
    starBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      item.starred = !item.starred;
      saveConversationHistory();
      renderHistoryList(itemsToShow);
    });

    const textSpan = document.createElement("span");
    textSpan.className = "history-item-text";
    textSpan.textContent = item.question;
    textSpan.title = item.question;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "history-item-delete";
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      conversationHistory = conversationHistory.filter((h) => h.id !== item.id);
      saveConversationHistory();
      renderHistoryList(itemsToShow);
    });

    div.appendChild(starBtn);
    div.appendChild(textSpan);
    div.appendChild(deleteBtn);

    div.addEventListener("click", () => {
      // Restore this Q&A to chat
      hideWelcomeScreen();
      addMessage("user", item.question);
      addMessage("assistant", item.answer, item.sources || []);
      document.getElementById("userQuestion").value = "";
      
      // Close sidebar on laptop/mobile (overlay mode)
      if (isOverlayMode()) {
        closeSidebar();
      }
    });

    historyList.appendChild(div);
  });
}

// ===== SIDEBAR LOGIC =====
// Use overlay mode for screens <= 768px (mobile/tablet)
// Use push mode for screens > 768px (laptops and desktops)
function isOverlayMode() {
  return window.innerWidth <= 768;
}

function openSidebar() {
  const sidebar = document.getElementById("chatSidebar");
  const main = document.querySelector(".chat-main");
  
  if (isOverlayMode()) {
    sidebar.classList.add("open");
    sidebar.classList.remove("collapsed");
    getOrCreateOverlay().classList.add("active");
  } else {
    sidebar.classList.remove("collapsed");
    main.classList.remove("expanded");
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("chatSidebar");
  const main = document.querySelector(".chat-main");
  
  if (isOverlayMode()) {
    sidebar.classList.remove("open");
    const overlay = document.querySelector(".sidebar-overlay");
    if (overlay) overlay.classList.remove("active");
  } else {
    sidebar.classList.add("collapsed");
    main.classList.add("expanded");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("chatSidebar");
  
  if (isOverlayMode()) {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  } else {
    if (sidebar.classList.contains("collapsed")) {
      openSidebar();
    } else {
      closeSidebar();
    }
  }
}

function getOrCreateOverlay() {
  let overlay = document.querySelector(".sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    overlay.addEventListener("click", closeSidebar);
    document.getElementById("content").appendChild(overlay);
  }
  return overlay;
}

// ===== WELCOME SCREEN =====
function hideWelcomeScreen() {
  const welcome = document.getElementById("welcomeScreen");
  if (welcome) {
    welcome.classList.add("hidden");
  }
}

function showWelcomeScreen() {
  const welcome = document.getElementById("welcomeScreen");
  if (welcome) {
    welcome.classList.remove("hidden");
  }
}

// ===== SETUP FUNCTIONS =====
function setupHistoryUI() {
  const historySearchInput = document.getElementById("historySearchInput");
  const exportHistoryBtn = document.getElementById("exportHistoryBtn");
  const clearHistoryBtn = document.getElementById("clearHistoryBtn");

  if (historySearchInput) {
    historySearchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = conversationHistory.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query)
      );
      renderHistoryList(filtered);
    });
  }

  if (exportHistoryBtn) {
    exportHistoryBtn.addEventListener("click", () => {
      const dataStr = JSON.stringify(conversationHistory, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `urbanify-history-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Hapus Riwayat?",
        text: "Semua riwayat percakapan akan dihapus. Aksi ini tidak dapat dibatalkan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
        confirmButtonColor: "#4c6444",
        cancelButtonColor: "#af9a71",
      }).then((result) => {
        if (result.isConfirmed) {
          clearConversationHistory();
          renderHistoryList();
          const chatMessages = document.getElementById("chatMessages");
          if (chatMessages) chatMessages.innerHTML = "";
          showWelcomeScreen();
          Swal.fire({
            icon: "success",
            title: "Terhapus!",
            text: "Riwayat percakapan telah dihapus.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    });
  }
}

function setStatus(text, mode = "ok") {
  const statusBox = document.getElementById("indexStatus");
  if (!statusBox) {
    return;
  }

  statusBox.classList.remove("loading", "error");
  if (mode === "loading") {
    statusBox.classList.add("loading");
  }
  if (mode === "error") {
    statusBox.classList.add("error");
  }

  statusBox.textContent = text;
}

function renderIndexedPages() {
  const list = document.getElementById("indexedPagesList");
  if (!list) {
    return;
  }

  list.innerHTML = "";
  if (!siteIndex.length) {
    const item = document.createElement("li");
    item.textContent = "Belum ada halaman yang berhasil diindeks.";
    list.appendChild(item);
    return;
  }

  siteIndex.forEach((doc) => {
    const item = document.createElement("li");
    item.textContent = `${doc.title} (${doc.url})`;
    list.appendChild(item);
  });
}

function addMessage(role, text, sources = []) {
  const messages = document.getElementById("chatMessages");
  if (!messages) {
    return null;
  }

  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  if (role === "assistant") {
    // AI avatar
    const avatar = document.createElement("div");
    avatar.className = "ai-avatar";
    avatar.innerHTML = '<i class="fa-solid fa-leaf"></i>';
    wrapper.appendChild(avatar);

    // Content wrapper
    const content = document.createElement("div");
    content.className = "message-content";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    
    // Format markdown (**bold**, *italic*, `code`)
    let formattedText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
      
    bubble.innerHTML = formattedText;
    content.appendChild(bubble);

    if (sources.length) {
      const sourceList = document.createElement("ul");
      sourceList.className = "source-list";
      sources.forEach((source) => {
        const sourceItem = document.createElement("li");
        
        if (typeof source === "object" && source.number) {
          sourceItem.innerHTML = `<strong>[${source.number}]</strong> <a href="${source.url}" target="_blank" title="${source.title}">${source.title}</a>`;
        } else {
          sourceItem.textContent = source;
        }
        
        sourceList.appendChild(sourceItem);
      });
      content.appendChild(sourceList);
    }

    wrapper.appendChild(content);
    messages.appendChild(wrapper);
  } else {
    // User message
    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
  }

  // Scroll to bottom
  const chatBody = document.querySelector(".chat-body");
  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  return wrapper.querySelector(".message-bubble");
}

function addTypingIndicator() {
  const messages = document.getElementById("chatMessages");
  if (!messages) {
    return null;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "message assistant";

  const avatar = document.createElement("div");
  avatar.className = "ai-avatar";
  avatar.innerHTML = '<i class="fa-solid fa-leaf"></i>';
  wrapper.appendChild(avatar);

  const content = document.createElement("div");
  content.className = "message-content";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  content.appendChild(bubble);
  wrapper.appendChild(content);

  messages.appendChild(wrapper);

  const chatBody = document.querySelector(".chat-body");
  if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  return bubble;
}

function countOccurrences(text, term) {
  if (!text || !term) {
    return 0;
  }

  let count = 0;
  let index = text.indexOf(term);

  while (index !== -1) {
    count += 1;
    index = text.indexOf(term, index + term.length);
  }

  return count;
}

function pickRelevantPages(question) {
  if (!siteIndex.length) {
    return [];
  }

  const tokens = (normalizeText(question).toLowerCase().match(/[a-z0-9]{3,}/g) || [])
    .filter((token) => !["yang", "dari", "untuk", "dengan", "pada", "dan", "the", "for", "and", "adalah", "ini", "itu", "tersebut"].includes(token));

  const scored = siteIndex.map((doc) => {
    let score = 0;
    
    if (doc.textLower.includes(question.toLowerCase())) {
      score += 50;
    }
    
    tokens.forEach((token) => {
      const count = countOccurrences(doc.textLower, token);
      score += count * 2;
    });

    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const relevant = scored.filter((item) => item.score > 0).slice(0, 4);
  if (relevant.length) {
    return relevant.map((item) => item.doc);
  }

  return scored.slice(0, 3).map((item) => item.doc);
}

function buildWebsiteContext(question) {
  const docs = pickRelevantPages(question);
  const sections = [];
  const sources = [];
  let totalChars = 0;

  docs.forEach((doc, index) => {
    const snippet = doc.text.slice(0, 2000);
    if (totalChars + snippet.length > MAX_CONTEXT_CHARS) {
      return;
    }

    sections.push(`[SOURCE ${index + 1}: ${doc.title}]\n${snippet}`);
    sources.push({
      number: index + 1,
      title: doc.title,
      url: doc.url
    });
    totalChars += snippet.length;
  });

  return {
    context: sections.join("\n\n"),
    sources
  };
}

function formatAnswerWithCitations(answer, sources) {
  return answer;
}

function getInitialPrompt() {
  const params = new URLSearchParams(window.location.search);
  return params.get("prompt") || "";
}

function extractPageStructure(doc, sourceRoot) {
  const sections = [];
  const weightMap = { h1: 5, h2: 3, h3: 2, p: 1, li: 1 };

  const mainTitle = doc.querySelector("main h1, body h1");
  if (mainTitle) {
    sections.push({
      text: normalizeText(mainTitle.textContent),
      weight: 5,
      type: "title"
    });
  }

  const headingElements = sourceRoot.querySelectorAll("h1, h2, h3");
  headingElements.forEach((heading) => {
    const level = heading.tagName.toLowerCase();
    const weight = weightMap[level] || 1;
    
    sections.push({
      text: normalizeText(heading.textContent),
      weight: weight,
      type: "heading"
    });

    let currentElement = heading.nextElementSibling;
    let contentText = "";
    
    while (currentElement && !currentElement.matches("h1, h2, h3")) {
      if (currentElement.tagName === "P" || currentElement.tagName === "LI") {
        contentText += normalizeText(currentElement.textContent) + " ";
      } else if (currentElement.tagName === "UL" || currentElement.tagName === "OL") {
        const items = currentElement.querySelectorAll("li");
        items.forEach((item) => {
          contentText += normalizeText(item.textContent) + " ";
        });
      }
      currentElement = currentElement.nextElementSibling;
    }

    if (contentText.trim()) {
      sections.push({
        text: contentText.trim().slice(0, 500),
        weight: weight * 0.8,
        type: "content",
        heading: heading.textContent
      });
    }
  });

  return sections;
}

function buildStructuredText(sections) {
  let structuredText = "";
  
  sections.forEach((section) => {
    if (section.type === "title") {
      structuredText += `[TITLE] ${section.text}\n`;
    } else if (section.type === "heading") {
      structuredText += `\n[${section.heading ? "SUBSECTION" : "SECTION"}] ${section.text}\n`;
    } else if (section.type === "content") {
      structuredText += `${section.text}\n`;
    }
  });

  return structuredText.slice(0, MAX_PAGE_TEXT);
}

async function indexWebsitePages() {
  setStatus("Sedang membaca halaman website Urbanify...", "loading");

  const results = await Promise.all(
    SITE_PAGES.map(async (page) => {
      try {
        const response = await fetch(page.url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        doc.querySelectorAll("script, style, noscript").forEach((el) => el.remove());

        const sourceRoot = doc.querySelector("main") || doc.body;
        
        const sections = extractPageStructure(doc, sourceRoot);
        const structuredText = buildStructuredText(sections);

        if (!structuredText.trim()) {
          return null;
        }

        const flatText = normalizeText(
          Array.from(doc.querySelectorAll("h1, h2, h3, p, li"))
            .map((el) => el.textContent)
            .join(" ")
        ).slice(0, MAX_PAGE_TEXT);

        return {
          title: page.title,
          url: page.url,
          text: structuredText,
          textFlat: flatText,
          textLower: (structuredText + " " + flatText).toLowerCase(),
          sections: sections
        };
      } catch (_error) {
        return null;
      }
    })
  );

  siteIndex = results.filter(Boolean);
  renderIndexedPages();

  if (!siteIndex.length) {
    setStatus(
      "Gagal mengindeks halaman website. Jalankan website melalui server lokal (misal Live Server) agar fetch halaman HTML diizinkan browser.",
      "error"
    );
    return false;
  }

  setStatus(`Data website siap. ${siteIndex.length} halaman berhasil diindeks dengan struktur improved.`);
  return true;
}

function isNotFoundModelError(error) {
  const message = error && typeof error.message === "string" ? error.message : "";
  return (
    message.includes("NOT_FOUND") ||
    message.includes("is not found")
  );
}

async function askBackend(question, websiteContext) {
  const BACKEND_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '3000'
    ? 'http://localhost:3000/api/ask' 
    : 'https://urbanifyv2.vercel.app/api/ask');

  const conversationContext = getConversationContext();

  const payload = {
    question: question.trim(),
    context: websiteContext,
    model: "gemini-2.5-flash",
    conversationHistory: conversationContext
  };

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      timeout: 30000
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.answer) {
      throw new Error("Backend tidak mengembalikan jawaban");
    }

    return {
      answer: data.answer,
      usedModel: data.usedModel || "gemini-2.5-flash"
    };
  } catch (error) {
    console.error("Backend request error:", error);
    throw error;
  }
}

function setupLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.getElementById("content");

  document.body.style.overflowY = "hidden";
  window.addEventListener("load", () => {
    document.body.style.overflowY = "hidden"; // Keep hidden for chat layout
    if (!loadingScreen || !content) {
      return;
    }

    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      content.style.display = "flex";
    }, 120);
  });
}

function setupTextareaAutoResize() {
  const textarea = document.getElementById("userQuestion");
  if (!textarea) return;

  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    const maxHeight = 160;
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
  });
}

function setupSuggestionCards() {
  const cards = document.querySelectorAll(".suggestion-card");
  const userQuestion = document.getElementById("userQuestion");
  const chatForm = document.getElementById("chatForm");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const prompt = card.getAttribute("data-prompt");
      if (prompt && userQuestion && chatForm) {
        userQuestion.value = prompt;
        chatForm.requestSubmit();
      }
    });
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const dropdown = document.getElementById("mobileDropdown");

  if (menuBtn && dropdown) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }
}

function setupAiChat() {
  const chatForm = document.getElementById("chatForm");
  const userQuestion = document.getElementById("userQuestion");
  const sendBtn = document.getElementById("sendBtn");
  const newChatBtn = document.getElementById("newChatBtn");
  const sidebarToggle = document.getElementById("sidebarToggle");

  if (!chatForm || !userQuestion || !sendBtn) {
    return;
  }

  // Load conversation history
  loadConversationHistory();

  // Sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }

  // New Chat button
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      const chatMessages = document.getElementById("chatMessages");
      if (chatMessages) chatMessages.innerHTML = "";
      showWelcomeScreen();
      userQuestion.value = "";
      userQuestion.style.height = "auto";
      
      if (isOverlayMode()) {
        closeSidebar();
      }
    });
  }

  // Enter to send, Shift+Enter for new line
  userQuestion.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  // Show greeting or restore context
  if (conversationHistory.length === 0) {
    // Welcome screen handles the greeting
  } else {
    // Show welcome screen but update it
    // Users can browse history in sidebar
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = userQuestion.value.trim();
    if (!question) {
      return;
    }

    // Hide welcome screen on first message
    hideWelcomeScreen();

    if (!siteIndex.length) {
      setStatus("Mempersiapkan data website...", "loading");
      const indexed = await indexWebsitePages();
      if (!indexed) {
        addMessage("assistant", "❌ Gagal memuat data website. Coba segarkan halaman atau hubungi support.");
        return;
      }
    }

    addMessage("user", question);
    userQuestion.value = "";
    userQuestion.style.height = "auto";

    sendBtn.disabled = true;

    const thinkingBubble = addTypingIndicator();

    try {
      const { context, sources } = buildWebsiteContext(question);
      const { answer, usedModel } = await askBackend(question, context);

      // Save to conversation history
      addToHistory(question, answer, sources);
      
      // Update history sidebar
      renderHistoryList();

      if (thinkingBubble && thinkingBubble.parentElement) {
        // Remove the whole message wrapper (avatar + content)
        const msgWrapper = thinkingBubble.closest(".message");
        if (msgWrapper) msgWrapper.remove();
        else thinkingBubble.parentElement.remove();
      }

      addMessage("assistant", answer, sources);

      // Update model badge
      const modelBadge = document.getElementById("modelBadge");
      if (modelBadge) {
        const badgeSpan = modelBadge.querySelector("span");
        if (badgeSpan) {
          badgeSpan.textContent = usedModel;
        }
      }

      setStatus(`✓ Jawaban berhasil dibuat dengan model ${usedModel}.`);
    } catch (error) {
      if (thinkingBubble && thinkingBubble.parentElement) {
        const msgWrapper = thinkingBubble.closest(".message");
        if (msgWrapper) msgWrapper.remove();
        else thinkingBubble.parentElement.remove();
      }
      
      let errorMsg = error.message;
      if (errorMsg.includes("NOT_FOUND")) {
        errorMsg = "Model Gemini tidak ditemukan. Coba ganti model di konfigurasi.";
      } else if (errorMsg.includes("UNAUTHENTICATED")) {
        errorMsg = "API key tidak valid. Periksa kembali dan coba lagi.";
      } else if (errorMsg.includes("quota")) {
        errorMsg = "Kuota API Gemini habis. Coba nanti atau upgrade account.";
      }
      
      addMessage("assistant", `❌ Terjadi error: ${errorMsg}`);
      setStatus("Gagal memproses pertanyaan. Periksa error di atas.", "error");
    } finally {
      sendBtn.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupLoadingScreen();
  setupTextareaAutoResize();
  setupSuggestionCards();
  setupMobileMenu();
  setupAiChat();
  setupHistoryUI();
  renderHistoryList();
  await indexWebsitePages();

  const initialPrompt = getInitialPrompt();
  const chatForm = document.getElementById("chatForm");
  const userQuestion = document.getElementById("userQuestion");

  if (initialPrompt && chatForm && userQuestion) {
    userQuestion.value = initialPrompt;
    setTimeout(() => {
      chatForm.requestSubmit();
    }, 300);
  }
});
