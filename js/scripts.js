window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
}

function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", function() {
  const animationSection = document.getElementById('animationSection');
  let animationTriggered = false;

  function fadeInSection() {
      const sectionTop = animationSection.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (sectionTop < windowHeight && !animationTriggered) {
          animationSection.classList.add('fade-in');
          animationTriggered = true;
      }
  }

  window.addEventListener('scroll', fadeInSection);
});

document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll('section');
  const windowHeight = window.innerHeight;

  function fadeInSection(section) {
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop < windowHeight) {
          section.classList.add('fade-in');
      }
  }

  sections.forEach(section => {
      window.addEventListener('scroll', function() {
          fadeInSection(section);
      });
  });
});
const headerElement = document.getElementById('mainHeader');
headerElement.classList.add('fade-in');


     function submitForm(event) {
            event.preventDefault(); // Prevent the default form submission

            // Get the submit button and add a loading state
            const submitButton = document.getElementById("submitButton");
            submitButton.disabled = true;
            submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...`;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "https://formspree.io/f/xnnnkkpq");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                submitButton.disabled = false;
                submitButton.innerHTML = `<i class="fas fa-paper-plane me-2"></i>Submit`; // Reset the submit button text
                if (xhr.status === 200) {
                    // Show SweetAlert2 success message
                    Swal.fire({
                        title: 'Success!',
                        text: 'Your message has been successfully submitted. Thank you!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Reset the form after user closes the alert
                        document.getElementById("contactForm").reset();
                    });
                } else {
                    // Show SweetAlert2 error message
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong. Please try again later.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            };

            // Collect form data and send request
            var formData = new FormData(document.getElementById("contactForm"));
            xhr.send(JSON.stringify(Object.fromEntries(formData)));
        }
