
//   const menuBtn = document.getElementById("menuBtn");
// const sidebar = document.getElementById("mobileSidebar");

// menuBtn.addEventListener("click", () => {
//   console.log("clicked");
//   console.log(sidebar);
//   sidebar.classList.toggle("show");
//   menuBtn.classList.toggle("active");
// });

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("mobileSidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("show");
      menuBtn.classList.toggle("active");
    });
  }
});

//Jobs Section
document.addEventListener("DOMContentLoaded", () => {

  const filterBtns = document.querySelectorAll(".job-filter-btn");
  const cards = document.querySelectorAll(".job-card");

  // Animation
  setTimeout(() => {
    cards.forEach(card => card.classList.add("show"));
  }, 100);

  // Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        card.classList.remove("show");

        if (filter === "all") {
          card.style.display = "block";
        }
        else if (filter === "fulltime") {
          card.style.display = card.classList.contains("job-fulltime") ? "block" : "none";
        }
        else if (filter === "parttime") {
          card.style.display = card.classList.contains("job-parttime") ? "block" : "none";
        }

        setTimeout(() => card.classList.add("show"), 100);
      });

    });
  });

});


// All Job Posts Section
const filterBtns = document.querySelectorAll(".filter-btn");
const jobCards = document.querySelectorAll(".job-card");
const totalCountEl = document.getElementById("totalCount");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    let visible = 0;

    jobCards.forEach(card => {
      const isFullTime = card.classList.contains("job-fulltime");
      const isPartTime = card.classList.contains("job-parttime");

      if (filter === "all") {
        card.style.display = "block";
        visible++;
      } 
      else if (filter === "fulltime" && isFullTime) {
        card.style.display = "block";
        visible++;
      } 
      else if (filter === "parttime" && isPartTime) {
        card.style.display = "block";
        visible++;
      } 
      else {
        card.style.display = "none";
      }
    });

    totalCountEl.textContent = visible;
  });
});
