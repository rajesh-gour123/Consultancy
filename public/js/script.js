// // (() => {
// //   'use strict';
// //   const forms = document.querySelectorAll('.needs-validation');
// //   Array.from(forms).forEach(form => {
// //     form.addEventListener('submit', event => {
// //       if (!form.checkValidity()) {
// //         event.preventDefault();
// //         event.stopPropagation();
// //       }
// //       form.classList.add('was-validated');
// //     });
// //   });
// // })();

// // const salaryInput = document.querySelector('input[name="post[salary]"]');

// // salaryInput.addEventListener("input", (e) => {
// //   let value = e.target.value;

// //   // Remove everything except digits and dash
// //   value = value.replace(/[^\d-]/g, "");

// //   // Split range if user writes like: 20000-30000
// //   let parts = value.split("-");

// //   parts = parts.map(part => {
// //     // Format each part with commas
// //     return part.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// //   });

// //   // Join back with dash if exists
// //   e.target.value = parts.join(" - ");
// // });




// // //search functionlity
// // const searchInput = document.getElementById("searchInput");

// // if(searchInput){
// //   searchInput.addEventListener("keyup", function() {
// //     let filter = this.value.toLowerCase();

// //     // Table filtering
// //     document.querySelectorAll("table tbody tr").forEach(row => {
// //       let text = row.innerText.toLowerCase();
// //       row.style.display = text.includes(filter) ? "" : "none";
// //     });

// //     // Card filtering (mobile)
// //     document.querySelectorAll(".card").forEach(card => {
// //       let text = card.innerText.toLowerCase();
// //       card.style.display = text.includes(filter) ? "" : "none";
// //     });
// //   });
// // }


//   const menuBtn = document.getElementById("menuBtn");
//   const mobileSidebar = document.getElementById("mobileSidebar");

//   menuBtn.addEventListener("click", () => {
//     console.log("Menu button clicked");
//     // toggle right/left sidebar
//     mobileSidebar.classList.toggle("show");

//     // animate hamburger
//     menuBtn.classList.toggle("active");

//     // disable scroll when sidebar is open
//     if (mobileSidebar.classList.contains("show")) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   });

//   // close sidebar if user clicks outside
//   document.addEventListener("click", (e) => {
//     if (
//       mobileSidebar.classList.contains("show") &&
//       !mobileSidebar.contains(e.target) &&
//       !menuBtn.contains(e.target)
//     ) {
//       mobileSidebar.classList.remove("show");
//       menuBtn.classList.remove("active");
//       document.body.style.overflow = "auto";
//     }
//   });


