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
  const educationLink = document.getElementById("nav-link-active");
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

//Quiz
const SoalSoal = document.getElementById("question");
const buttonPilihan = document.getElementById("options");
const buttonNext = document.getElementById("nextBtn");
const scoreSementara = document.getElementById("score");
const balikButton = document.getElementById("homePage");
const scoreHasilt = document.getElementById("result");
const questions = [
  {
    question: "Apa yang dimaksud dengan Smart City?",
    options: [
      "Mengurangi daya baterai perangkat",
      "Kota yang memiliki transportasi umum",
      "Kota yang memanfaatkan teknologi untuk meningkatkan kualitas hidup warga",
      "Kota yang berpenduduk padat",
    ],
    answer:
      "Kota yang memanfaatkan teknologi untuk meningkatkan kualitas hidup warga",
  },
  {
    question: "Salah satu tujuan utama dari Smart City adalah untuk…",
    options: [
      "Meningkatkan angka migrasi ke kota",
      "Menyediakan fasilitas untuk wisatawan",
      "Memaksimalkan penggunaan teknologi dalam mengelola sumber daya kota",
      "Membuat kota lebih mahal dan eksklusif",
    ],
    answer:
      "Memaksimalkan penggunaan teknologi dalam mengelola sumber daya kota",
  },
  {
    question:
      "Di dalam konsep Smart City, aplikasi apa yang umum digunakan untuk meningkatkan partisipasi warga dalam pengambilan keputusan kota?",
    options: [
      "Media sosial",
      "Aplikasi layanan perbankan",
      "Aplikasi perbelanjaan online",
      "Aplikasi pelaporan masalah dan saran warga",
    ],
    answer: "Aplikasi pelaporan masalah dan saran warga",
  },
  {
    question:
      "Untuk mengurangi polusi udara di Smart City, teknologi apa yang sering diterapkan?",
    options: [
      "Sistem sensor udara yang memantau kualitas udara secara real-time",
      "Memindahkan pabrik-pabrik ke pusat kota",
      "Menyediakan transportasi berbasis bahan bakar fosil",
      "Mengurangi jumlah lahan hijau di kota",
    ],
    answer: "Sistem sensor udara yang memantau kualitas udara secara real-time",
  },
  {
    question:
      "Bagaimana Smart City dapat meningkatkan keamanan publik di kota?",
    options: [
      "Dengan menambah jumlah gedung tinggi di daerah perkotaan",
      "Dengan memasang kamera pemantau dan menggunakan teknologi analisis data",
      "Dengan membatasi akses warga ke area tertentu",
      "Dengan menyediakan lebih banyak taman kota",
    ],
    answer:
      "Dengan memasang kamera pemantau dan menggunakan teknologi analisis data",
  },
];

let score = 0;
let jumlahSoal = 0;

function showQuestion() {
  const currentQuestion = questions[jumlahSoal];
  SoalSoal.textContent = currentQuestion.question;
  buttonPilihan.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () => Cek(option, currentQuestion.answer));
    buttonPilihan.appendChild(button);
  });

  scoreSementara.textContent = `Poin: ${score}`;
}

function Cek(selectedOption, correctAnswer) {
  if (selectedOption === correctAnswer) {
    Swal.fire({
      icon: "success",
      title: "Benar!",
      text: "Jawaban Anda benar!",
      timer: 2000,
      showConfirmButton: false,
    });
    score += 5;
  } else {
    Swal.fire({
      icon: "error",
      title: "Salah!",
      text: "Jawaban Anda salah. Coba lagi.",
      timer: 2000,
      showConfirmButton: false,
    });
    if (score >= 5) {
      score -= 5;
    }
  }

  jumlahSoal++;
  if (jumlahSoal < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

buttonNext.addEventListener("click", () => {
  Swal.fire({
    title: "Lanjutkan Soal?",
    text: "Akan dikenakan -5 poin jika melanjutkan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, lanjutkan!",
    cancelButtonText: "Batal",
    customClass: {
      title: "quizTitleText",
      text: "quizDescText",
      confirmButton: "quizConfirmButton",
      cancelButton: "quizCancelButton",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (score >= 5) score -= 5;
      jumlahSoal++;
      if (jumlahSoal < questions.length) {
        showQuestion();
      } else {
        showResult();
      }
    }
  });
});

showQuestion();

function showResult() {
  SoalSoal.textContent = "";
  buttonPilihan.innerHTML = "";
  scoreHasilt.innerHTML = `
    <div class="resultContainer">
      <h2>Quiz Selesai!</h2>
      <p>Poin Akhir Anda:</p>
      <div class="scoreDisplay">${score}</div>
    </div>
  `;

  balikButton.style.display = "block";
  buttonNext.style.display = "none";
  scoreSementara.style.display = "none";

  startConfetti();
}

function startConfetti() {
  const confettiCanvas = document.createElement("canvas");
  confettiCanvas.id = "confettiCanvas";
  document.body.appendChild(confettiCanvas);

  const confetti = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  let particles = [];
  const colors = ["#f54242", "#42aaf5", "#f5e942", "#42f554", "#af9a71"];

  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      size: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityY: Math.random() * 3 + 2,
    });
  }

  function animateConfetti() {
    confetti.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach((p) => {
      p.y += p.velocityY;
      if (p.y > confettiCanvas.height) p.y = 0 - p.size;

      confetti.fillStyle = p.color;
      confetti.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(animateConfetti);
  }

  animateConfetti();

  setTimeout(() => {
    confettiCanvas.remove();
  }, 3500);
}

balikButton.addEventListener("click", () => {
  window.location.href = "../../index.html";
});

repeat();
//end of Quiz
