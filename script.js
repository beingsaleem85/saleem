// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const closeMenu = document.querySelector('.close-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
const header = document.querySelector('.header');

// Typewriter Effect
const typewriterElement = document.getElementById('typewriter-text');
if (typewriterElement) {
    const text1 = "Muhammad ";
    const text2 = "Saleem";
    let index1 = 0;
    let index2 = 0;
    
    function type() {
        if (index1 < text1.length) {
            typewriterElement.innerHTML += text1.charAt(index1);
            index1++;
            setTimeout(type, 100);
        } else if (index1 === text1.length && index2 === 0) {
            typewriterElement.innerHTML += '<span class="highlight"></span>';
            index2++;
            setTimeout(type, 100);
        } else if (index2 > 0 && index2 <= text2.length) {
            const span = typewriterElement.querySelector('.highlight');
            if(span) span.innerHTML += text2.charAt(index2 - 1);
            index2++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                const cursor = document.querySelector('.typewriter-cursor');
                if (cursor) cursor.style.display = 'none';
            }, 1000);
        }
    }
    setTimeout(type, 500); // start typing after 500ms
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
});

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        header.style.padding = '0.5rem 0';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        header.style.padding = '1rem 0';
    }
});

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.skill-progress');
const skillsSection = document.getElementById('skills');

const animateSkills = () => {
    const sectionTop = skillsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.8) {
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0'; // reset
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-in-out';
                bar.style.width = width;
            }, 100);
        });
        // Remove listener after animating once
        window.removeEventListener('scroll', animateSkills);
    }
};

window.addEventListener('scroll', animateSkills);

// Form submission handler to contact.php
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const btn = form.querySelector('button');
        const originalText = btn.textContent;
        const statusDiv = document.getElementById('form-status');
        
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.8';
        btn.disabled = true;

        // Construct data for Netlify Forms (must be URL encoded)
        const formData = new FormData(form);
        const searchParams = new URLSearchParams();
        
        // Ensure form-name is exactly what Netlify expects
        // (already in the form, but let's be safe)
        if (!searchParams.has('form-name')) {
            searchParams.append('form-name', 'contact');
        }

        for (const pair of formData) {
            searchParams.append(pair[0], pair[1]);
        }

        fetch(window.location.href, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: searchParams.toString()
        })
        .then(res => {
            console.log('Netlify Response Status:', res.status);
            if (res.ok) {
                btn.textContent = 'Message Sent!';
                btn.style.backgroundColor = '#10b981';
                btn.style.color = '#fff';
                form.reset();
                if (statusDiv) {
                    statusDiv.style.display = 'block';
                    statusDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    statusDiv.style.color = '#10b981';
                    statusDiv.textContent = "Thank You. Your message has been recorded. I'll get in touch with you shortly.";
                }
            } else {
                throw new Error(`Form submission failed with status: ${res.status}`);
            }

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.opacity = '1';
                btn.disabled = false;
                if (statusDiv) {
                    statusDiv.style.display = 'none';
                    statusDiv.textContent = '';
                }
            }, 5000);
        })
        .catch(err => {
            console.error('Submission Error:', err);
            btn.textContent = 'Network Error';
            btn.style.backgroundColor = '#EF4444';
            btn.style.color = '#fff';
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                statusDiv.style.color = '#EF4444';
                statusDiv.textContent = "Network error or local testing. Please check console if on Netlify.";
            }
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.opacity = '1';
                btn.disabled = false;
                if (statusDiv) {
                    statusDiv.style.display = 'none';
                    statusDiv.textContent = '';
                }
            }, 5000);
        });
    });
}
