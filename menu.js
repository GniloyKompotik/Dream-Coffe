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

function filterItems(category) {
  const items = document.querySelectorAll('.menu-item');
  playSound('filter');

  items.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
      item.classList.remove('hidden');
      item.classList.add('show');
    } else {
      item.classList.add('hidden');
      item.classList.remove('show');
    }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${category}"]`).classList.add('active');
}

function searchItems(query) {
  const items = document.querySelectorAll('.menu-item');
  const searchTerm = query.toLowerCase().trim();

  items.forEach(item => {
    const itemName = item.dataset.name.toLowerCase();
    const itemTitle = item.querySelector('.card-title').textContent.toLowerCase();

    if (itemName.includes(searchTerm) || itemTitle.includes(searchTerm) || searchTerm === '') {
      item.classList.remove('hidden');
      item.classList.add('show');
    } else {
      item.classList.add('hidden');
      item.classList.remove('show');
    }
  });
}

function showNotification(message, itemName) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">✓</span>
      <div class="notification-text">
        <strong>${itemName}</strong>
        <p>${message}</p>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  updateDateTime();
  setInterval(updateDateTime, 60000);

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const openPopup = document.getElementById('openPopup');
  const closePopup = document.getElementById('closePopup');
  const popupForm = document.getElementById('popupForm');

  if (openPopup) {
    openPopup.addEventListener('click', function() {
      popupForm.classList.add('active');
      playSound('click');
    });
  }

  if (closePopup) {
    closePopup.addEventListener('click', function() {
      popupForm.classList.remove('active');
    });
  }

  if (popupForm) {
    popupForm.addEventListener('click', function(e) {
      if (e.target === popupForm) {
        popupForm.classList.remove('active');
      }
    });
  }

  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = document.getElementById('popupEmail');
      if (!emailInput.checkValidity()) {
        emailInput.classList.add('is-invalid');
        subscribeForm.classList.add('shake');
        setTimeout(() => subscribeForm.classList.remove('shake'), 300);
        return;
      }

      playSound('success');
      const successMsg = document.getElementById('subscribeSuccess');
      if (successMsg) {
        successMsg.classList.remove('d-none');
        emailInput.value = '';
        emailInput.classList.remove('is-invalid');

        setTimeout(function() {
          popupForm.classList.remove('active');
          successMsg.classList.add('d-none');
        }, 2000);
      }
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.dataset.filter;
      filterItems(category);
    });
  });

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchItems(this.value);
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      searchItems(searchInput.value);
      playSound('click');
    });
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      playSound('cart');

      const card = this.closest('.card');
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 300);

      const itemName = this.closest('.card-body').querySelector('.card-title').textContent;
      showNotification('Added to cart successfully!', itemName);
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'c' && !e.target.matches('input, textarea')) {
      filterItems('coffee');
    } else if (e.key.toLowerCase() === 's' && !e.target.matches('input, textarea')) {
      filterItems('specialty');
    } else if (e.key.toLowerCase() === 'p' && !e.target.matches('input, textarea')) {
      filterItems('pastry');
    } else if (e.key.toLowerCase() === 'a' && !e.target.matches('input, textarea')) {
      filterItems('all');
    } else if (e.key === 'Escape') {
      if (popupForm.classList.contains('active')) {
        popupForm.classList.remove('active');
      }
      searchInput.value = '';
      searchItems('');
      filterItems('all');
    } else if (e.key === '/' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});