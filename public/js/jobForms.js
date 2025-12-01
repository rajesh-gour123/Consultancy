
  // -------------------------------
  // Bootstrap Required Validation
  // -------------------------------
  (() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {

        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        // stop submit if custom errors exist
        if (
          document.querySelector("#imgError")?.textContent !== "" ||
          document.querySelector("#salaryError")?.textContent !== "" ||
          document.querySelector("#contactError")?.textContent !== ""
        ) {
          event.preventDefault();
        }

        form.classList.add('was-validated');
      });
    });
  })();



  // -------------------------------
  // IMAGE VALIDATION (< 1MB)
  // -------------------------------
  const photoInput = document.getElementById("photoInput");
  const imgError = document.getElementById("imgError");

  if (photoInput) {
    photoInput.addEventListener("change", () => {
      imgError.textContent = "";

      const file = photoInput.files[0];
      if (!file) return;

      if (file.size > 1 * 1024 * 1024) {
        imgError.textContent = "Image must be less than 1MB";
        photoInput.value = "";
        photoInput.classList.add("is-invalid");
      } else {
        photoInput.classList.remove("is-invalid");
      }
    });
  }



  // -------------------------------
  // SALARY VALIDATION
  // Only numbers + one hyphen
  // -------------------------------
  const salaryInput = document.getElementById("salaryInput");
  const salaryError = document.getElementById("salaryError");

  if (salaryInput) {
    salaryInput.addEventListener("input", () => {
      const value = salaryInput.value;

      // Rule 1: allow ONLY numbers and "-"
      if (!/^[0-9-]*$/.test(value)) {
        salaryError.textContent = "Only numbers and '-' allowed";
        salaryInput.classList.add("is-invalid");
        return;
      }

      // Rule 2: Only 1 hyphen allowed
      if ((value.match(/-/g) || []).length > 1) {
        salaryError.textContent = "Only one '-' allowed";
        salaryInput.classList.add("is-invalid");
        return;
      }

      salaryError.textContent = "";
      salaryInput.classList.remove("is-invalid");
    });
  }



  // -------------------------------
  // CONTACT NUMBER VALIDATION
  // Format: +91 6000180569
  // -------------------------------
  const contactInput = document.getElementById("contactInput");
  const contactError = document.getElementById("contactError");

  if (contactInput) {
    contactInput.addEventListener("input", () => {

      const pattern = /^\+91\s[6-9]\d{9}$/;

      if (!pattern.test(contactInput.value)) {
        contactError.textContent = "Use format: +91 6000180569";
        contactInput.classList.add("is-invalid");
      } else {
        contactError.textContent = "";
        contactInput.classList.remove("is-invalid");
      }
    });
  }
