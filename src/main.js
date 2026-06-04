import './style.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import Typed from 'typed.js'

gsap.registerPlugin(ScrollTrigger)

// 1. Premium Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// 2. Typed.js (Hero Tagline)
new Typed('#typedTagline', {
  strings: [
    'hardware.',
    'software.',
    'embedded systems.',
    'IoT solutions.'
  ],
  typeSpeed: 50,
  backSpeed: 30,
  backDelay: 2000,
  loop: true,
  showCursor: true,
  cursorChar: '|'
})

// 3. GSAP Reveal Animations
const animateElements = (selector, trigger, yOffset = 40) => {
  gsap.fromTo(selector, 
    { opacity: 0, y: yOffset },
    {
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger,
        start: 'top 85%',
      }
    }
  )
}

animateElements('.section-title', '.section-title', 20)
animateElements('.skill-category', '#skills')
animateElements('.featured-card', '#projects')
animateElements('.exp-card', '#experience')
animateElements('.cert-card', '#certifications')

window.addEventListener('load', () => {
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 200);
});

// 4. FIX: Force Lenis routing for all anchor links (Fixes the double-click bug)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      lenis.scrollTo(targetElement);
      // Close mobile menu if it is open
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
    }
  });
});

// 5. Mobile Menu Toggle
const mobileBtn = document.getElementById('mobileMenuBtn')
const mobileMenu = document.getElementById('mobileMenu')
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden')
  })
}

// 6. Resume Download Logic
const downloadBtn = document.getElementById('downloadResumeBtn')
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Gowtham_Arul_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

// 7. Web3Forms (Contact)
const contactForm = document.getElementById('contactForm')
const formStatus = document.getElementById('formStatus')

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)
    
    formStatus.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...'
    formStatus.className = 'text-base mt-4 font-bold text-[#0052FF] block'
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        formStatus.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Message sent successfully!'
        formStatus.className = 'text-base mt-4 font-bold text-green-600 block'
        contactForm.reset()
      } else {
        formStatus.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Failed to send.'
        formStatus.className = 'text-base mt-4 font-bold text-red-500 block'
      }
    } catch (error) {
      formStatus.innerHTML = '<i class="fas fa-wifi mr-1"></i> Network error.'
      formStatus.className = 'text-base mt-4 font-bold text-red-500 block'
    }
    setTimeout(() => { formStatus.classList.add('hidden') }, 5000)
  })
}