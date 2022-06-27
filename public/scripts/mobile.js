// DOM Elements
const mobileMenuElement = document.getElementById('mobile-menu');
const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');

// Functions
const toggleMobileMenu = () => {
  mobileMenuElement.classList.toggle('open');
};

// Event Listeners
mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);
