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
});
// end of LOADING

document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("scroll", () => {
  const header = document.querySelector(".navigation");
  const logoImage = document.querySelector(".logo-nav");
  const navlinks = document.querySelectorAll(".nav-middle a");

  if (window.scrollY > 0) {
    header.classList.add("scrolled");
    underline.classList.add("scrolled");
    logoImage.src = "../../Assets/1.png";

    navlinks.forEach((link) => {
      link.style.color = "#503d42";
    });
  } else {
    header.classList.remove("scrolled");
    underline.classList.remove("scrolled");
    logoImage.src = "../../Assets/3.png";

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
// end of dropdown

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
  document
    .querySelector(".link-environment")
    .addEventListener("click", function () {
      window.location.href = "../SmartEnvironment/environment.html";
    });
  document.querySelector(".link-urban").addEventListener("click", function () {
    window.location.href = "../UrbanGreenspace/UrbanGreenSpace.html";
  });
  document.querySelector(".link-iot").addEventListener("click", function () {
    window.location.href = "../IoT/iot.html";
  });
  document
    .querySelector(".link-citizen")
    .addEventListener("click", function () {
      window.location.href = "../CitizenEngagement/citizenengagement.html";
    });
  document
    .querySelector(".link-smartcity")
    .addEventListener("click", function () {
      window.location.href = "../SmartCity/smart.html";
    });
  document
    .querySelector(".image-smartcity")
    .addEventListener("click", function () {
      window.location.href = "../SmartCity/smart.html";
    });
});

const navToggle = document.getElementById("nav-toggle");
const navFullscreen = document.getElementById("nav-fullscreen");

navToggle.addEventListener("click", () => {
  navFullscreen.classList.toggle("active");
});
