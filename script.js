// ============================
// Theme Toggle Functionality
// ============================

// Get theme from localStorage or default to light
const getTheme = () => {
    return localStorage.getItem('theme') || 'light';
};

// Set theme and save to localStorage
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};

// Initialize theme on page load
const initTheme = () => {
    const currentTheme = getTheme();
    setTheme(currentTheme);
};

// Toggle between light and dark theme
const toggleTheme = () => {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
};

// ============================
// Mobile Menu Toggle
// ============================

const toggleMobileMenu = () => {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
};

// Close mobile menu when clicking on a nav link
const closeMobileMenu = () => {
    const navMenu = document.getElementById('nav-menu');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
};

// ============================
// Smooth Scrolling
// ============================

const smoothScroll = (target) => {
    const element = document.querySelector(target);
    if (element) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
};

// ============================
// Scroll Animations
// ============================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
};

const initScrollAnimations = () => {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        observer.observe(section);
    });
};

// ============================
// Navbar Scroll Effect
// ============================

const handleNavbarScroll = () => {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

// ============================
// Contact Form Handler
// ============================

const handleContactForm = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link with pre-filled information
    const mailtoLink = `mailto:payettekael@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Optional: Show success message
    alert('Opening your email client... Please send the message from there.');
    
    // Reset form
    form.reset();
};

// ============================
// Event Listeners
// ============================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links - smooth scroll and close mobile menu
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                smoothScroll(href);
                closeMobileMenu();
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('nav-menu');
        const menuToggle = document.getElementById('mobile-menu-toggle');
        
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });
});

// ============================
// Active Navigation Link Highlighting
// ============================

const updateActiveNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbarHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
};

// ============================
// Utility Functions
// ============================

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Apply debounce to scroll handler for better performance
window.addEventListener('scroll', debounce(() => {
    handleNavbarScroll();
    updateActiveNavLink();
}, 100));
