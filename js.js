const night = document.getElementById("night");
const starCount = 20;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement("div");
  star.classList.add("shooting_star");

  // Random vị trí xuất phát (toàn màn hình)
  star.style.top = Math.random() * 100 + "vh";
  star.style.left = Math.random() * 100 + "vw";

  // Random delay và tốc độ
  const delay = (Math.random() * 10).toFixed(2) + "s";
  const duration = (2 + Math.random() * 3).toFixed(2) + "s";

  star.style.setProperty("--dur", duration);
  star.style.animationDelay = delay + ", " + delay + ", " + delay;

  night.appendChild(star);
}

// Hiệu ứng chuột rơi trái tim
const cursor = document.querySelector(".cursor");
let lastHeartTime = 0; // Tạo biến để lưu thời gian cuối cùng của chuột rơi trái tim
let mouseX = 0;
let mouseY = 0;
let isMouseMoving = false;
document.addEventListener("mousemove", (e) => {
  // Cập nhật vị trí chuột toàn cục
  mouseX = e.clientX; // Sử dụng clientX thay vì pageX
  mouseY = e.clientY; // Sử dụng clientY thay vì pageY
  isMouseMoving = true;

  // Cập nhật vị trí cursor
  updateCursorPosition();

  const currentTime = Date.now();
  if (currentTime - lastHeartTime > 150) {
    // Chỉ tạo trái tim nếu đã qua 150ms kể từ lần cuối
    const heart = document.createElement("div"); // Tạo phần tử div mới
    heart.className = "heart";
    heart.style.left = `${e.pageX}px`; //gán vị trí trái tim theo tọa độ chuột
    heart.style.top = `${e.pageY}px`;
    document.body.appendChild(heart); //thêm trái tim vào body
    setTimeout(() => heart.remove(), 2000); // Xóa trái tim sau 2 giây
    lastHeartTime = currentTime; // Cập nhật thời gian cuối cùng của chuột rơi trái tim
    heart.innerHTML = "❤️"; /* ← THÊM MỚI */
    heart.style.fontSize = "16px"; /* ← THÊM MỚI */
    heart.style.color = "#ff69b4";
  }
});
function updateCursorPosition() {
  if (cursor) {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  }
}
// Xử lý khi cuộn trang
document.addEventListener("scroll", () => {
  if (isMouseMoving) {
    updateCursorPosition();
  }
});

// Xử lý khi chuột ra khỏi viewport
document.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
  isMouseMoving = false;
});

// Xử lý khi chuột vào lại viewport
document.addEventListener("mouseenter", () => {
  cursor.style.opacity = "1";
  isMouseMoving = true;
});

// Hiệu ứng nhấn/nhả chuột
document.addEventListener("mousedown", () => {
  cursor.style.width = "50px";
  cursor.style.height = "50px";
  cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
});

document.addEventListener("mouseup", () => {
  cursor.style.width = "40px";
  cursor.style.height = "40px";
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

new TypeIt("#type-it", {
  speed: 120,
  loop: true,
  cursorSeed: 800,
})
  .type("Hiii embe >,<")
  .pause(2000)
  .delete()
  .type("Cái này là cho em đó :3")
  .pause(3000)
  .go();

// Đếm thời gian yêu
function LoveTimer() {
  const startDate = new Date("2025-09-15T00:00:00"); // Ngày bắt đầu
  const now = new Date();
  const diff = now - startDate; // Hiệu số thời gian
  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;

  const diffYears = Math.floor(diff / years);
  const diffDays = Math.floor(diff / days - diffYears * 365);
  const diffHours = Math.floor((diff % days) / hours);
  const diffMinutes = Math.floor((diff % hours) / minutes);
  const diffSeconds = Math.floor((diff % minutes) / seconds);

  const timer = document.getElementById("timer");
  timer.textContent = `Anh đã bắt được em ${diffYears} năm, ${diffDays} ngày, ${diffHours} giờ, ${diffMinutes} phút, ${diffSeconds} giây rồi cơ đấy =))`;
  setTimeout(LoveTimer, 1000);
}
LoveTimer();

const pig = document.querySelector(".pig-fly");
let clickCount = 0;

pig.addEventListener("click", () => {
  // Hiệu ứng rung lắc cho heo (class tạm thời)
  //   console.log("Clicked");
  pig.classList.add("shake");
  setTimeout(() => pig.classList.remove("shake"), 500);
});

const loveSwiper = new Swiper(".swiper-love", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  effect: "slide",
  speed: 600,
});

// Hiệu ứng lật thẻ
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });
});

//Hàm đổi màu nền cho background
const cardsB = document.querySelectorAll(".card-toal .card");
const loveCardSection = document.querySelector("body");

// Lưu background mặc định ban đầu
const defaultBg = window.getComputedStyle(loveCardSection).backgroundImage;

// Dùng biến để nhớ card đang active
let activeCard = null;

cardsB.forEach((cardB) => {
  cardB.addEventListener("click", () => {
    if (activeCard === cardB) {
      // Nếu click lại đúng card đang active → reset
      loveCardSection.style.backgroundImage = defaultBg;
      activeCard = null; // bỏ active
    } else {
      // Lấy màu từ mặt trước của card
      const front = cardB.querySelector(".card-front");
      const bg = window.getComputedStyle(front).backgroundImage;

      loveCardSection.style.backgroundImage = bg;
      loveCardSection.style.transition = "background 0.8s ease";

      // Đánh dấu card đang active
      activeCard = cardB;
    }
  });
});

// Xử lý gửi tin nhắn
const form = document.getElementById("khung-nhap");
const sendBtn = document.getElementById("send-btn");
sendBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  document.getElementById("msg").textContent = "Đang gửi...";
  const payload = {
    message: document.getElementById("input-msg").value,
  };

  try {
    const res = await fetch("http://localhost:3000/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    if (res.ok && j.ok) {
      document.getElementById("msg").textContent = "Gửi xong!";
      document.getElementById("input-msg").value = ""; // clear textarea
    } else {
      document.getElementById("msg").textContent = "Lỗi" + JSON.stringify(j);
    }
  } catch (err) {
    document.getElementById("msg").textContent = "Lỗi kết nối";
  }
});

//Phần thư tay
new TypeIt("#type-letter", {
  seed: 120,
  loop: false,
  cursorSeed: 800,
})
  .type("<b>Gửi em bé của anh <3</b><br>")
  .pause(1000)
  .type(
    "Sau khi anh làm xong cái này,anh nhận ra được tình yêu này,anh đã làm với nhiều sự tìm tòi những cái hay,cái khó mà trước kia anh rất lười đụng đến,có thể là em sẽ chỉ tốn đâu đó 5 10 phút để xem hết món quà này nhưng với anh đó là sự cố gắng,tìm hiểu,lên ý tưởng,fix bug hẹ hẹ,anh mong em sẽ thấy happy với món quà nàyy,chỉ cần em nói yêu anhh rất nhìu cảm ơn anh đã tặng em là anh thấy mọi sự cố gắng đã được đền đáp quá đầy đủ nè :33.<br>"
  )
  .pause(1000)
  .type(
    "Một điều sau cùng anh muốn nữa là,muốn được trộm vía yêu em cả đời !<br>"
  )
  .pause(1000)
  .type("<b>Anh yêu em ❤️</b>")
  .pause(1000)
  .go();

//Hiệu ứng GSAP
gsap.registerPlugin(ScrollTrigger);
// gsap.fromTo(
//       ".name",
//       {
//         opacity: 0,
//         y: 30,
//       },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.8,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".DongMoTa",
//           start: "top 75%",
//           toggleActions: "play none none reverse",
//         },
//       }
//     );
gsap.fromTo(
  ["#type-it", "#timer"],
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
  }
);
gsap.fromTo(
  "#section3 h1",
  { opacity: 0, y: 50, scale: 0.8 },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#section3",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
  }
);
gsap.fromTo(
  "#section3 .card ",
  { opacity: 0, x: 50, scale: 0.8 },
  {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 1,
    ease: "back.out(1,7)",
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#section3",
      start: "top 40%",
      toggleActions: "play none none reverse",
    },
  },
  "-=0.4"
);
gsap.fromTo(
  "#section5",
  {
    opacity: 0,
    scale: 0.7,
  },
  {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#section5",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  }
);

//Phẩn logic cho thẻ đàn hồi
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("ngiu-card");
  const lanyardLine = document.querySelector("#soiday line");
  const container = document.getElementById("card-container");

  // các biến thể vật lí
  let isGiuThe = false;

  //Vị trí neo của sợi dây(phần đầu cố định ở trên cùng)
  const VitriX = container.offsetWidth / 2;
  const VitriY = 0;

  // VỊ TRÍ NGHỈ: Đây là vị trí cân bằng mà thẻ sẽ luôn tìm cách quay về.
  // Thay đổi giá trị Y ở đây để thẻ treo cao hay thấp.
  const VitriNghiX = container.offsetWidth / 2;
  const VitriNghiY = 150;

  //Vị trí ban đầu của thẻ được đặt bằng vị trí nghỉ
  let VitriBanDauX = VitriNghiX;
  let VitriBanDauY = VitriNghiY;

  //Vận tốc
  let vX = 0;
  let vY = 0;

  //Các hằng số vật lí
  const hangsoK = 0.03;
  const hesomasat = 0.92;
  const khoiluong = 5;

  //Sự kiện khi nhấn chuột xuống thẻ
  card.addEventListener("mousedown", (e) => {
    isGiuThe = true;
    card.style.transition = "none";
  });

  //Sự kiện khi thả chuột ra
  window.addEventListener("mouseup", () => {
    isGiuThe = false;
    animate();
  });

  //Sự kiện khi di chuyển chuột
  window.addEventListener("mousemove", (e) => {
    if (!isGiuThe) return;
    const rect = container.getBoundingClientRect();
    // getBoundingClientRect(); //lấy tọa độ container so với viewport.
    VitriBanDauX = e.clientX - rect.left;
    VitriBanDauY = e.clientY - rect.top;

    updateCursorPosition();
  });
  function updateCursorPosition() {
    // Cập nhật vị trí CSS của thẻ
    card.style.left = `${VitriBanDauX - card.offsetWidth / 2}px`;
    card.style.top = `${VitriBanDauY - 20}px`;

    //Cập nhật sợi dây: dây vẫn nối từ ĐIỂM NEO CỐ ĐỊNH ở trên cùng
    lanyardLine.setAttribute("x1", VitriX);
    lanyardLine.setAttribute("y1", VitriY);
    lanyardLine.setAttribute("x2", VitriBanDauX);
    lanyardLine.setAttribute("y2", VitriBanDauY);
  }
  function animate() {
    if (isGiuThe) return;
    // Tính toán dựa trên khoảng cách tới vị trí nghỉ

    const dx = VitriBanDauX - VitriNghiX;
    const dy = VitriBanDauY - VitriNghiY;

    const LucX = -hangsoK * dx;
    const LucY = -hangsoK * dy;

    const giatocX = LucX / khoiluong;
    const giatocY = LucY / khoiluong;

    vX += giatocX;
    vY += giatocY;

    vX *= hesomasat;
    vY *= hesomasat;

    VitriBanDauX += vX;
    VitriBanDauY += vY;

    updateCursorPosition();

    if (
      Math.abs(vX) < 0.1 &&
      Math.abs(vY) < 0.1 &&
      Math.abs(dx) < 0.1 &&
      Math.abs(dy) < 0.1
    ) {
      return;
    }
    requestAnimationFrame(animate);
  }
  //Khởi tạo vị trí ban đầu
  updateCursorPosition();
});

//Gsap cho thẻ
gsap.fromTo(
  "#card-container",
  {
    y: -300, // bắt đầu ở trên cao
    rotation: -30, // nghiêng sang trái một chút
    transformOrigin: "50% 0%", // tâm xoay trên đầu (giống treo dây)
    opacity: 0,
  },
  {
    y: 0, // rơi xuống đúng chỗ
    rotation: 0, // trở về cân bằng
    opacity: 1,
    duration: 1.5,
    ease: "bounce.out", // hiệu ứng bật nảy
    onComplete: () => {
      // sau khi rơi xong thì cho nó đung đưa
      gsap.to("#card-container", {
        rotation: 5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
  }
);
