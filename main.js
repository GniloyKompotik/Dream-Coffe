const greeting = document.getElementById('greeting');
const themeToggle = document.getElementById('themeToggle');
const updateGreetingBtn = document.getElementById('updateGreeting');
const showTimeBtn = document.getElementById('showTime');
const timeDisplay = document.getElementById('timeDisplay');
const playSoundBtn = document.getElementById('playSound');
const soundEffect = document.getElementById('soundEffect');
const stars = document.querySelectorAll('.stars span');
const ratingText = document.getElementById('ratingText');
const readMoreBtn = document.querySelector('.read-more');
const moreContent = document.querySelector('.more-content');
const contactForm = document.getElementById('contactForm');
const navItems = document.querySelectorAll('.nav-item');

const coffeeData = {
    items: [
        { name: 'Espresso', price: 1200 },
        { name: 'Latte', price: 2500 }
    ],
    displayItems: function() {
        this.items.forEach(item => {
            console.log(item.name + ': ' + item.price + '₸');
        });
    }
};

const prices = coffeeData.items.map(item => item.price);
const expensiveItems = coffeeData.items.filter(item => item.price > 1500);

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('night-theme');
    this.textContent = document.body.classList.contains('night-theme') 
        ? 'Switch to Day' 
        : 'Switch to Night';
});

showTimeBtn.addEventListener('click', function() {
    const now = new Date();
    timeDisplay.textContent = `Current time: ${now.toLocaleTimeString()}`;
    timeDisplay.classList.remove('d-none');
});
updateGreetingBtn.addEventListener('click', function() {
    const name = nameInput.value.trim();
    if (name) {
        greeting.textContent = `Welcome to DreamCoffee, ${name}!`;
    }
});
playSoundBtn.addEventListener('click', function() {
    soundEffect.play();
});

stars.forEach((star, index) => {
    star.addEventListener('click', function() {
        stars.forEach(s => s.classList.remove('active'));
        
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('active');
        }
        
        ratingText.textContent = 'You rated: ' + (index + 1) + ' stars';
    });
});

readMoreBtn.addEventListener('click', function() {
    moreContent.classList.toggle('show');
    this.textContent = moreContent.classList.contains('show') ? 'Read Less' : 'Read More';
});

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            message: this.querySelector('textarea').value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        alert('Message sent successfully!');
        this.reset();
    });
});

document.addEventListener('keydown', function(e) {
    let currentIndex = Array.from(navItems).indexOf(document.activeElement);
    
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % navItems.length;
        navItems[currentIndex].focus();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + navItems.length) % navItems.length;
        navItems[currentIndex].focus();
    }
});

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    switch(true) {
        case hour < 12:
            return "Good Morning!";
        case hour < 18:
            return "Good Afternoon!";
        default:
            return "Good Evening!";
    }
}

greeting.textContent = getTimeBasedGreeting() + " Welcome to DreamCoffee!";
coffeeData.displayItems();