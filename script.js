// LOADING
document.addEventListener("DOMContentLoaded", function () {
  const loadingScreen = document.getElementById("loading-screen");
  const content = document.getElementById("content");
  document.body.style.overflowY = "hidden";
  window.addEventListener("load", function () {
    document.body.style.overflowY = "auto";
    loadingScreen.style.opacity = "0";
    setTimeout(() => {
      loadingScreen.style.display = "none";
      content.style.display = "block";
    }, 100);
  });
  document.body.style.overflowY = "hidden";
  // end of LOADING

  const links = document.querySelectorAll(".nav-link");
  const underline = document.getElementById("underline");
  let activeLink = document.querySelector(".nav-link.active");
  const header = document.querySelector(".navigation");
  const logoImage = document.querySelector(".logo-nav");
  const navlinks = document.querySelectorAll(".nav-middle a");

  function moveUnderline(link) {
    const { offsetLeft: left, offsetWidth: width } = link;
    underline.style.left = `${left}px`;
    underline.style.width = `${width}px`;
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => moveUnderline(link));
    link.addEventListener("mouseleave", () => moveUnderline(activeLink));
  });

  if (activeLink) moveUnderline(activeLink);

  window.addEventListener("resize", () => {
    if (activeLink) moveUnderline(activeLink);
  });
});

// Helper to determine base path for assets and links
function getBasePath() {
  const path = window.location.pathname;
  // Check if we are in a subdirectory (assuming _Page structure)
  if (path.includes("/_Page/") || path.includes("\\_Page\\")) {
    return "../../";
  }
  return "";
}

document.addEventListener("scroll", () => {
  const header = document.querySelector(".navigation");
  const underline = document.querySelector(".underline");
  const logoImage = document.querySelector(".logo-nav");
  const navlinks = document.querySelectorAll(".nav-middle a");
  const basePath = getBasePath();

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
    underline.classList.add("scrolled");
    logoImage.src = basePath + "Assets/1.png";

    navlinks.forEach((link) => {
      link.style.color = "#503d42";
    });
  } else {
    header.classList.remove("scrolled");
    underline.classList.remove("scrolled");
    logoImage.src = basePath + "Assets/3.png";

    navlinks.forEach((link) => {
      link.style.color = "";
    });
  }
});

// dropdown
document.addEventListener("DOMContentLoaded", function () {
  const educationLink = document.getElementById("education-link");
  const dropdown = document.getElementById("education-dropdown");

  let timeoutId;

  educationLink.addEventListener("mouseenter", function () {
    timeoutId = setTimeout(() => {
      dropdown.classList.add("active");
    }, 400);
  });

  educationLink.addEventListener("mouseleave", function () {
    timeoutId = setTimeout(() => {
      dropdown.classList.remove("active");
    }, 0);
  });

  dropdown.addEventListener("mouseenter", function () {
    clearTimeout(timeoutId);
  });

  dropdown.addEventListener("mouseleave", function () {
    timeoutId = setTimeout(() => {
      dropdown.classList.remove("active");
    }, 300);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const dropbtn = document.querySelector(".dropbtn-phone");
  const dropdownContent = document.querySelector(".dropdown-phone-content");

  function toggleDropdown(event) {
    event.stopPropagation();
    dropdownContent.classList.toggle("show");
  }

  dropbtn.addEventListener("pointerdown", toggleDropdown);

  window.addEventListener("pointerdown", function (event) {
    if (
      !event.target.closest(".dropbtn-phone") &&
      dropdownContent.classList.contains("show") &&
      !event.target.closest(".dropdown-phone-content")
    ) {
      dropdownContent.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const basePath = getBasePath();
  document
    .querySelector(".link-environment")
    .addEventListener("click", function () {
      window.location.href = basePath + "_Page/SmartEnvironment/environment.html";
    });
  document.querySelector(".link-urban").addEventListener("click", function () {
    window.location.href = basePath + "_Page/UrbanGreenspace/UrbanGreenSpace.html";
  });
  document.querySelector(".link-iot").addEventListener("click", function () {
    window.location.href = basePath + "_Page/IoT/iot.html";
  });
  document
    .querySelector(".link-citizen")
    .addEventListener("click", function () {
      window.location.href =
        basePath + "_Page/CitizenEngagement/citizenengagement.html";
    });
  document
    .querySelector(".link-smartcity")
    .addEventListener("click", function () {
      window.location.href = basePath + "_Page/SmartCity/smart.html";
    });
  document
    .querySelector(".image-smartcity")
    .addEventListener("click", function () {
      window.location.href = basePath + "_Page/SmartCity/smart.html";
    });
});
// end of dropdown

//slides
document.addEventListener("DOMContentLoaded", function () {
  const slidesContainers = document.querySelectorAll(".slides-container");

  slidesContainers.forEach((container) => {
    let currentSlide = 0;
    const slides = container.querySelector(".slides");
    const totalSlides = slides.children.length;

    function changeSlide(direction) {
      currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
      updateSlidePosition();
    }

    function updateSlidePosition() {
      const slideWidth = slides.children[0].getBoundingClientRect().width;
      slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }

    updateSlidePosition();

    setInterval(() => changeSlide(1), 3000);
  });
});
// end of slides

document.addEventListener("DOMContentLoaded", function () {
  const aiChatForm = document.getElementById("aiChatForm");
  const aiMessages = document.getElementById("aiMessages");
  const aiQuestion = document.getElementById("aiQuestion");
  const askAiLink = document.querySelector('a.nav-link[href="#ask-ai"]');

  if (askAiLink) {
    askAiLink.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("#ask-ai")?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  if (!aiChatForm || !aiMessages || !aiQuestion) {
    return;
  }

  function appendMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.textContent = text;
    aiMessages.appendChild(message);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  function getAiReply(question) {
    const cleaned = question.toLowerCase();
    if (cleaned.includes("smart city") || cleaned.includes("kota pintar") || cleaned.includes("urbanify")) {
      return "Smart City menggabungkan teknologi, data, dan partisipasi warga untuk membuat kota lebih efisien dan nyaman.";
    }
    if (cleaned.includes("smart environment") || cleaned.includes("lingkungan") || cleaned.includes("polusi")) {
      return "Smart Environment fokus pada penggunaan sensor dan data untuk menjaga kualitas udara, air, dan sumber daya alam.";
    }
    if (cleaned.includes("iot") || cleaned.includes("internet of things") || cleaned.includes("sensor")) {
      return "IoT memungkinkan perangkat terhubung dan saling berkomunikasi untuk meningkatkan pelayanan kota.";
    }
    if (cleaned.includes("citizen") || cleaned.includes("warga") || cleaned.includes("partisipasi")) {
      return "Citizen Engagement memudahkan warga berinteraksi dengan pemerintah melalui layanan digital dan aplikasi.";
    }
    if (cleaned.includes("green") || cleaned.includes("ruang hijau") || cleaned.includes("taman")) {
      return "Urban Greenspace berarti memperbanyak taman dan area hijau untuk udara bersih dan kualitas hidup yang lebih baik.";
    }
    return "Saya AI Urbanify. Silakan tanyakan tentang Smart City, Smart Environment, Urban Greenspace, IoT, atau Citizen Engagement untuk jawaban lebih spesifik.";
  }

  function sendUserQuestion(question) {
    appendMessage(question, "user");
    setTimeout(() => {
      appendMessage(getAiReply(question), "bot");
      
      // Add a helpful prompt to redirect to Ask AI for more detailed answers
      setTimeout(() => {
        const followUpMsg = document.createElement("div");
        followUpMsg.className = "message bot";
        followUpMsg.innerHTML = '💡 <a href="_Page/AskAI/askai.html?prompt=' + encodeURIComponent(question) + '" style="color: #74b328; text-decoration: underline; cursor: pointer;">Tanya lebih detail di Ask AI →</a>';
        aiMessages.appendChild(followUpMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }, 800);
    }, 500);
  }

  aiChatForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const question = aiQuestion.value.trim();
    if (!question) {
      return;
    }
    aiQuestion.value = "";
    sendUserQuestion(question);
  });

  appendMessage(
    "Halo! Saya AI Urbanify. Tanyakan apa saja tentang Smart City, Smart Environment, Urban Greenspace, IoT, atau Citizen Engagement.",
    "bot"
  );
});

const askAiRedirectForm = document.getElementById("askAiRedirectForm");
const askAiPrompt = document.getElementById("askAiPrompt");

if (askAiRedirectForm && askAiPrompt) {
  askAiRedirectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const prompt = askAiPrompt.value.trim();
    if (!prompt) {
      return;
    }

    const encodedPrompt = encodeURIComponent(prompt);
    window.location.href = `_Page/AskAI/askai.html?prompt=${encodedPrompt}`;
  });
}

const copy = document
  .querySelector(".sectiontwo-gallery-img-img")
  .cloneNode(true);
document.querySelector(".sectiontwo-gallery-img-slide").appendChild(copy);
