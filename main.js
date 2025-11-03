const sounds = {
  click: 'click.mp3',
  success: 'success.mp3',
  toggle: 'toggle.mp3'
};

function playSound(type) {
  const audio = new Audio(sounds[type]);
  audio.volume = 0.3;
  audio.play().catch(err => console.log('Audio play failed'));
}

function updateDateTime() {
  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  const dateTimeElement = document.getElementById('dateTime');
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
  playSound('toggle');
}

function observeElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.bounce-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  updateDateTime();
  setInterval(updateDateTime, 60000);
  observeElements();

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        e.stopPropagation();
        contactForm.classList.add('was-validated');
        contactForm.classList.add('shake');
        setTimeout(() => contactForm.classList.remove('shake'), 300);
        return;
      }

      playSound('success');
      const formSuccess = document.getElementById('formSuccess');
      if (formSuccess) {
        formSuccess.classList.remove('d-none');
        contactForm.reset();
        contactForm.classList.remove('was-validated');

        setTimeout(function() {
          formSuccess.classList.add('d-none');
        }, 5000);
      }
    });
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
      playSound('click');
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      });
    }
  });
});