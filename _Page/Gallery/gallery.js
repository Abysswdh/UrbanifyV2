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

document.addEventListener("scroll", () => {
  const header = document.querySelector(".navigation");
  const underline = document.querySelector(".underline");
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
// end of dropdown
const textOptions = document.querySelectorAll(".text-option");
const dynamicImages = document.querySelectorAll(".dynamic-image");

//slider
document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".sectiontwo-urban-slider");

  sliders.forEach((slider) => {
    const sliderWrapper = slider.querySelector(".slider-wrapper");
    const slides = Array.from(sliderWrapper.querySelectorAll(".slider-slide"));
    const overlay = slider.querySelector(".overlay");
    const placeName = overlay.querySelector(".sectiontwo-urban-contoh-nama");
    const placeDescription = overlay.querySelector(
      ".sectiontwo-urban-contoh-deskripsi"
    );

    let currentSlideIndex = 0;

    const slideInterval = setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlider();
    }, 5000);

    updateSlider();

    function updateSlider() {
      slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlideIndex);
      });
      sliderWrapper.style.transform = `translateX(-${
        currentSlideIndex * 100
      }%)`;

      // Update overlay text based on the current slide index
      if (currentSlideIndex === 0) {
        placeName.textContent = "Gambar 1";
        placeDescription.textContent = "";
      } else if (currentSlideIndex === 1) {
        placeName.textContent = "Gambar 2";
        placeDescription.textContent = "";
      } else if (currentSlideIndex === 2) {
        placeName.textContent = "Gambar 3";
        placeDescription.textContent = "";
      }

      overlay.style.opacity = 1;
    }
  });

  const textOptions = document.querySelectorAll(".text-option"); // Update this selector based on your HTML structure
  const dynamicImages = document.querySelectorAll(".dynamic-image"); // Update this selector based on your HTML structure

  textOptions.forEach((option, index) => {
    option.addEventListener("mouseenter", () => {
      // Hide all images
      dynamicImages.forEach((img) => {
        img.style.opacity = "0";
      });
      // Show the corresponding image
      dynamicImages[index].style.opacity = "1";
    });

    option.addEventListener("mouseleave", () => {
      // Hide the image on mouse leave
      dynamicImages[index].style.opacity = "0";
    });
  });
});
