document.addEventListener('DOMContentLoaded', function () {
    // Page loader
    const loader = document.getElementById('pageLoader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('loaded'), 300);
        });
        // Fallback if load already fired
        if (document.readyState === 'complete') {
            setTimeout(() => loader.classList.add('loaded'), 300);
        }
    }

    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeForm();
    initializeScrollToTop();
    initializeRippleEffect();
    initializeImageFallbacks();
});

function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const navOverlay = document.getElementById('navOverlay');

    const closeMenu = () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', function () {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        if (navOverlay) navOverlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on overlay click
    if (navOverlay) {
        navOverlay.addEventListener('click', closeMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Shrink header on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.scrollY;
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

function initializeScrollEffects() {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Discipline cards: alternate slide-left / slide-right
    const disciplineCards = document.querySelectorAll('.discipline-card');
    disciplineCards.forEach((el, index) => {
        el.classList.add(index % 2 === 0 ? 'slide-left' : 'slide-right');
        el.style.transitionDelay = `${index * 0.08}s`;
        observer.observe(el);
    });

    // Actualite cards: scale-up with stagger
    const actualiteCards = document.querySelectorAll('.actualite-card');
    actualiteCards.forEach((el, index) => {
        el.classList.add('scale-up');
        el.style.transitionDelay = `${index * 0.12}s`;
        observer.observe(el);
    });

    // Result cards: fade-in with stagger
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // About section elements
    const aboutText = document.querySelector('.about-text');
    const aboutImage = document.querySelector('.about-image');
    if (aboutText) { aboutText.classList.add('slide-left'); observer.observe(aboutText); }
    if (aboutImage) { aboutImage.classList.add('slide-right'); observer.observe(aboutImage); }

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header, .section-header-contact');
    sectionHeaders.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Features
    const features = document.querySelectorAll('.feature');
    features.forEach((el, index) => {
        el.classList.add('slide-left');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // CTA banner
    const cta = document.querySelector('.cta-content');
    if (cta) { cta.classList.add('scale-up'); observer.observe(cta); }

    // Contact card
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) { contactCard.classList.add('fade-in'); observer.observe(contactCard); }

    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const duration = 2000;

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (counter.textContent.includes('+')) {
                    counter.textContent = Math.ceil(current) + '+';
                } else {
                    counter.textContent = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = counter.textContent.includes('+') ? target + '+' : target;
            }
        };

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(updateCounter, 500);
                    heroObserver.unobserve(entry.target);
                }
            });
        });

        heroObserver.observe(document.querySelector('.hero'));
    });
}

function initializeForm() {
    const form = document.querySelector('.contact-form form');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const subject = form.querySelectorAll('input[type="text"]')[1].value;
            const message = form.querySelector('textarea').value;

            if (!name || !email || !subject || !message) {
                showNotification('Veuillez remplir tous les champs', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Veuillez entrer une adresse email valide', 'error');
                return;
            }

            const submitBtn = form.querySelector('.btn-primary');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Message envoyé avec succès !', 'success');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: type === 'success' ? '#27AE60' : '#E74C3C',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function initializeScrollToTop() {

    const scrollTopBtn = document.createElement('div');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* Ripple effect on buttons */
function initializeRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .btn-voir-toutes, .btn-voir-toutes2, .btn-accent');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/* Image fallback for about section */
function initializeImageFallbacks() {
    const aboutImg = document.querySelector('.about-image img');
    if (aboutImg) {
        aboutImg.addEventListener('error', function() {
            this.parentElement.innerHTML = '<div style="width:100%;height:400px;background:linear-gradient(135deg,#04088a,#1e34c8);border-radius:16px;display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;"><i class="fas fa-running"></i></div>';
        });
    }
}

function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            const title = this.querySelector('h3').textContent;

            createLightbox(img.src, title);
        });
    });
}

function createLightbox(imageSrc, title) {

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    });

    const imageContainer = document.createElement('div');
    imageContainer.style.position = 'relative';
    imageContainer.style.maxWidth = '90%';
    imageContainer.style.maxHeight = '90%';

    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = title;
    Object.assign(image.style, {
        maxWidth: '100%',
        maxHeight: '100%',
        borderRadius: '10px'
    });

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#0119c3',
        color: 'white',
        fontSize: '24px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });

    imageContainer.appendChild(image);
    imageContainer.appendChild(closeBtn);
    overlay.appendChild(imageContainer);
    document.body.appendChild(overlay);

    const closeLightbox = () => {
        document.body.removeChild(overlay);
    };

    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);

    imageContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initializeGallery();
});

function initializeTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.minHeight = '1.5em'; // Prevent layout shift

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        }
    };

    // Wait for the hero reveal animation to finish for subtitle
    setTimeout(typeWriter, 900);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeTypingEffect();
});

function optimizeImages() {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    optimizeImages();
});

function initializeCookieConsent() {
    const cookieConsent = document.createElement('div');
    cookieConsent.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10, 25, 41, 0.97); backdrop-filter: blur(10px); color: white; padding: 20px 30px; z-index: 10000; display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <p style="margin: 0; font-size: 0.95rem;">Ce site utilise des cookies pour améliorer votre expérience.</p>
            <div style="display: flex; gap: 10px;">
                <button id="acceptCookies" style="background: linear-gradient(135deg, #04088a, #1e34c8); color: white; border: none; padding: 10px 24px; border-radius: 50px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: transform 0.2s;">Accepter</button>
                <button id="declineCookies" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.3); padding: 10px 24px; border-radius: 50px; cursor: pointer; font-weight: 500; font-size: 0.9rem;">Refuser</button>
            </div>
        </div>
    `;

    if (!localStorage.getItem('cookieConsent')) {
        document.body.appendChild(cookieConsent);

        document.getElementById('acceptCookies').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'accepted');
            document.body.removeChild(cookieConsent);
        });

        document.getElementById('declineCookies').addEventListener('click', function () {
            localStorage.setItem('cookieConsent', 'declined');
            document.body.removeChild(cookieConsent);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
});

function initializeSearch() {
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('searchResults');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();

            if (query.length > 2) {
                const results = searchContent(query);
                displaySearchResults(results);
            } else {
                searchResults.innerHTML = '';
            }
        });
    }
}

function searchContent(query) {
    const sections = document.querySelectorAll('section');
    const results = [];

    sections.forEach(section => {
        const content = section.textContent.toLowerCase();
        if (content.includes(query)) {
            const title = section.querySelector('h2, h3')?.textContent || 'Section';
            results.push({
                title: title,
                section: section.id,
                snippet: extractSnippet(content, query)
            });
        }
    });

    return results;
}

function extractSnippet(content, query) {
    const index = content.indexOf(query);
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + 100);
    return content.substring(start, end) + '...';
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');

    if (results.length === 0) {
        searchResults.innerHTML = '<p>Aucun résultat trouvé</p>';
        return;
    }

    const html = results.map(result => `
        <div class="search-result">
            <h4><a href="#${result.section}">${result.title}</a></h4>
            <p>${result.snippet}</p>
        </div>
    `).join('');

    searchResults.innerHTML = html;
}

const resultsData = {
    regional: {
        title: "Championnat Régional d'Athlétisme",
        date: "15 Mai 2025 - Stade Municipal de Marseille",
        results: {
            "Seniors Hommes": [
                { rang: 1, nom: "Thomas MARTIN", epreuve: "400m", temps: "48.32", club: "VSA", badges: ["podium-1", "qualification"] },
                { rang: 3, nom: "Pierre BERNARD", epreuve: "1500m", temps: "3:42.18", club: "VSA", badges: ["podium-3"] },
                { rang: 5, nom: "Lucas DURAND", epreuve: "110m haies", temps: "14.87", club: "VSA", badges: [] },
                { rang: 2, nom: "Antoine ROUSSEAU", epreuve: "Saut en longueur", temps: "7.23m", club: "VSA", badges: ["podium-2", "qualification"] },
            ],
            "Seniors Femmes": [
                { rang: 1, nom: "Marie DUBOIS", epreuve: "800m", temps: "2:15.32", club: "VSA", badges: ["podium-1", "record"] },
                { rang: 4, nom: "Sophie LEMAIRE", epreuve: "3000m", temps: "10:23.45", club: "VSA", badges: [] },
                { rang: 6, nom: "Camille ROBERT", epreuve: "Saut en hauteur", temps: "1.68m", club: "VSA", badges: [] },
            ],
            "Juniors": [
                { rang: 2, nom: "Alexandre PETIT", epreuve: "200m", temps: "22.15", club: "VSA", badges: ["podium-2"] },
                { rang: 7, nom: "Emma SIMON", epreuve: "400m haies", temps: "1:02.34", club: "VSA", badges: [] },
            ]
        },
        highlights: [
            "🏆 Marie Dubois établit un nouveau record du club sur 800m en 2'15\"32",
            "🎯 2 qualifications nationales obtenues (Thomas Martin - 400m, Antoine Rousseau - longueur)",
            "🥇 3 médailles d'or pour le VSA",
            "📈 Excellente progression de Pierre Bernard sur 1500m (-8 secondes par rapport à la saison précédente)"
        ],
        conditions: {
            meteo: "Ensoleillé, 22°C",
            vent: "Vent favorable 1.2 m/s",
            piste: "Piste synthétique en excellent état",
            participants: "245 athlètes de 18 clubs"
        }
    },
    printemps: {
        title: "Meeting de Printemps",
        date: "28 Avril 2025 - Complexe Sportif Jean Bouin",
        results: {
            "800m Dames": [
                { rang: 1, nom: "Marie DUBOIS", epreuve: "800m", temps: "2:15.32", club: "VSA", badges: ["podium-1", "record"] },
                { rang: 4, nom: "Clara VINCENT", epreuve: "800m", temps: "2:22.18", club: "VSA", badges: [] },
            ],
            "1500m Hommes": [
                { rang: 2, nom: "Pierre BERNARD", epreuve: "1500m", temps: "3:45.67", club: "VSA", badges: ["podium-2"] },
                { rang: 6, nom: "Julien MOREAU", epreuve: "1500m", temps: "3:52.34", club: "VSA", badges: [] },
            ],
            "Sprint": [
                { rang: 3, nom: "Thomas MARTIN", epreuve: "100m", temps: "10.89", club: "VSA", badges: ["podium-3"] },
                { rang: 5, nom: "Alexandre PETIT", epreuve: "200m", temps: "22.45", club: "VSA", badges: [] },
            ]
        },
        highlights: [
            "🔥 Record du club battu par Marie Dubois sur 800m (ancien record: 2'18\"45)",
            "⚡ Temps de qualification pour les championnats de France",
            "🌟 Première victoire de Marie en compétition senior",
            "💪 Pierre Bernard confirme sa forme ascendante"
        ],
        conditions: {
            meteo: "Nuageux, 18°C",
            vent: "Vent défavorable 2.1 m/s",
            piste: "Piste cendrée traditionnelle",
            participants: "156 athlètes de 12 clubs"
        }
    },
    cross: {
        title: "Cross Départemental des Bouches-du-Rhône",
        date: "12 Avril 2025 - Parc de la Poudrerie",
        results: {
            "Seniors Hommes (8km)": [
                { rang: 1, nom: "Pierre BERNARD", epreuve: "8km", temps: "26:34", club: "VSA", badges: ["podium-1"] },
                { rang: 3, nom: "Julien MOREAU", epreuve: "8km", temps: "27:12", club: "VSA", badges: ["podium-3"] },
                { rang: 7, nom: "Lucas DURAND", epreuve: "8km", temps: "28:45", club: "VSA", badges: [] },
                { rang: 12, nom: "Antoine ROUSSEAU", epreuve: "8km", temps: "29:23", club: "VSA", badges: [] },
            ],
            "Seniors Femmes (6km)": [
                { rang: 2, nom: "Sophie LEMAIRE", epreuve: "6km", temps: "22:18", club: "VSA", badges: ["podium-2"] },
                { rang: 4, nom: "Camille ROBERT", epreuve: "6km", temps: "23:45", club: "VSA", badges: [] },
                { rang: 9, nom: "Emma SIMON", epreuve: "6km", temps: "25:12", club: "VSA", badges: [] },
            ],
            "Juniors Hommes (6km)": [
                { rang: 5, nom: "Alexandre PETIT", epreuve: "6km", temps: "20:34", club: "VSA", badges: [] },
            ]
        },
        highlights: [
            "🏆 Victoire de l'équipe seniors masculins (1er, 3e, 7e, 12e)",
            "🥈 2ème place de l'équipe seniors féminines",
            "🌟 Pierre Bernard s'impose en solitaire dès le 3e kilomètre",
            "💯 100% de nos engagés à l'arrivée"
        ],
        conditions: {
            meteo: "Pluvieux, 15°C",
            terrain: "Parcours boueux et technique",
            parcours: "Circuit de 2km x 3 ou 4 tours selon catégories",
            participants: "189 coureurs de 15 clubs"
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM chargé");

    const modal = document.querySelector('.results-modal');
    const closeBtn = document.querySelector('.modal-close');
    const resultLinks = document.querySelectorAll('.result-link');
    const tabButtons = document.querySelectorAll('.modal-tab');

    console.log("Modal trouvé:", modal);
    console.log("Liens trouvés:", resultLinks.length);

    resultLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            console.log("Clic sur lien:", this.getAttribute('data-result'));
            const resultType = this.getAttribute('data-result');
            if (resultType && resultsData[resultType]) {
                openModal(resultType);
            } else {
                console.error("Type de résultat non trouvé:", resultType);
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            console.log("Fermeture modal");
            closeModal();
        });
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                console.log("Clic extérieur modal");
                closeModal();
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabName = this.getAttribute('data-tab');
            console.log("Changement onglet:", tabName);
            switchTab(tabName);
        });
    });

    const voirTousBtn = document.getElementById('voir-tous-btn');
    const btnText = document.getElementById('btn-text');
    let allResultsVisible = false;

    if (voirTousBtn) {
        voirTousBtn.addEventListener('click', function (e) {
            e.preventDefault();
            toggleAllResults();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            console.log("Fermeture par Escape");
            closeModal();
        }
    });
});

function openModal(resultType) {
    console.log("Ouverture modal pour:", resultType);
    const data = resultsData[resultType];
    const modal = document.querySelector('.results-modal');

    if (!data) {
        console.error("Données non trouvées pour:", resultType);
        return;
    }

    if (!modal) {
        console.error("Modal non trouvé");
        return;
    }

    const titleEl = document.querySelector('.modal-title');
    const dateEl = document.querySelector('.modal-date');

    if (titleEl) titleEl.textContent = data.title;
    if (dateEl) dateEl.textContent = data.date;

    populateResultsTab(data.results);
    populateHighlightsTab(data.highlights);
    populateConditionsTab(data.conditions);

    switchTab('results');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log("Modal ouvert");
}

function closeModal() {
    console.log("Fermeture modal");
    const modal = document.querySelector('.results-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function switchTab(tabName) {

    document.querySelectorAll('.modal-tab').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function populateResultsTab(results) {
    const container = document.getElementById('results-tab');
    let html = '';

    for (const [category, athletes] of Object.entries(results)) {
        html += `
                    <h3 style="color: #05076d; margin-bottom: 1rem; border-bottom: 2px solid #05076d; padding-bottom: 0.5rem;">${category}</h3>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Athlète</th>
                                <th>Épreuve</th>
                                <th>Performance</th>
                                <th>Distinctions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

        athletes.forEach(athlete => {
            const badges = athlete.badges.map(badge => {
                if (badge.startsWith('podium')) {
                    const pos = badge.split('-')[1];
                    return `<span class="podium-badge ${badge}">${pos}</span>`;
                } else if (badge === 'record') {
                    return `<span class="record-badge">RECORD</span>`;
                } else if (badge === 'qualification') {
                    return `<span class="qualification-badge">QUALIF</span>`;
                }
                return '';
            }).join(' ');

            html += `
                        <tr>
                            <td><strong>${athlete.rang}</strong></td>
                            <td>${athlete.nom}</td>
                            <td>${athlete.epreuve}</td>
                            <td><strong>${athlete.temps}</strong></td>
                            <td>${badges}</td>
                        </tr>
                    `;
        });

        html += `
                        </tbody>
                    </table>
                `;
    }

    container.innerHTML = html;
}

function populateHighlightsTab(highlights) {
    const container = document.getElementById('highlights-tab');
    const html = `
                <div class="highlight-section">
                    <div class="highlight-title">
                        <i class="fas fa-star" style="color: #ffd700;"></i>
                        Temps forts de la compétition
                    </div>
                    <ul style="list-style: none; padding: 0;">
                        ${highlights.map(highlight => `<li style="margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 10px; border-left: 4px solid #05076d;">${highlight}</li>`).join('')}
                    </ul>
                </div>
            `;
    container.innerHTML = html;
}

function populateConditionsTab(conditions) {
    const container = document.getElementById('conditions-tab');
    const html = `
                <div class="highlight-section">
                    <div class="highlight-title">
                        <i class="fas fa-info-circle"></i>
                        Conditions de compétition
                    </div>
                    <div class="conditions-info">
                        <div class="condition-item">
                            <i class="fas fa-sun" style="color: #ffa502;"></i>
                            <span><strong>Météo:</strong> ${conditions.meteo}</span>
                        </div>
                        <div class="condition-item">
                            <i class="fas fa-wind" style="color: #70a1ff;"></i>
                            <span><strong>Vent:</strong> ${conditions.vent || conditions.terrain || 'N/A'}</span>
                        </div>
                        <div class="condition-item">
                            <i class="fas fa-road" style="color: #7bed9f;"></i>
                            <span><strong>Surface:</strong> ${conditions.piste || conditions.parcours}</span>
                        </div>
                        <div class="condition-item">
                            <i class="fas fa-users" style="color: #5f27cd;"></i>
                            <span><strong>Participation:</strong> ${conditions.participants}</span>
                        </div>
                    </div>
                </div>
            `;
    container.innerHTML = html;
}

window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const credentials = {
            username: 'adminvsa',
            password: 'admin'
        };

const loginForm = document.getElementById('loginForm');
if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');
            
            if (username === credentials.username && password === credentials.password) {
                // Connexion réussie - redirection vers moncompte.html
                window.location.href = 'moncompte.html';
            } else {
                errorMsg.textContent = '❌ Identifiant ou mot de passe incorrect';
                errorMsg.style.display = 'block';
                
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 3000);
            }
        });
}