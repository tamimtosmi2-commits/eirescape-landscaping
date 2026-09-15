/**
 * ÉireScape Landscaping & Garden Design Ireland
 * Interactive Logic & UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileNav();
    initBeforeAfterSlider();
    initCostEstimator();
    initConsultationForm();
});

/* ==========================================================================
   1. Header Scroll Shadow
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!toggleBtn || !mobileMenu) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        toggleBtn.classList.toggle('active');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any link
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-link, a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            mobileMenu.classList.remove('open');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ==========================================================================
   3. Interactive Before/After Split Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('sliderHandle');
    if (!slider || !handle) return;

    let isDragging = false;

    // Set initial position (50%)
    setSliderPosition(50);

    function setSliderPosition(percentage) {
        const clamped = Math.max(3, Math.min(97, percentage));
        slider.style.setProperty('--split-pos', `${clamped}%`);
    }

    function handleMove(clientX) {
        const rect = slider.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        setSliderPosition(percentage);
    }

    // Pointer / Mouse Down
    function onStart(e) {
        isDragging = true;
        slider.style.cursor = 'ew-resize';
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        handleMove(clientX);
    }

    // Pointer / Mouse Move
    function onMove(e) {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        handleMove(clientX);
    }

    // Pointer / Mouse Up
    function onEnd() {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }
    }

    // Desktop Mouse Events
    slider.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Mobile / Tablet Touch Events
    slider.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Keyboard accessibility on handle
    handle.setAttribute('tabindex', '0');
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Before and After Image Comparison Slider');
    handle.setAttribute('aria-valuenow', '50');

    handle.addEventListener('keydown', (e) => {
        const currentVal = parseFloat(getComputedStyle(slider).getPropertyValue('--split-pos')) || 50;
        if (e.key === 'ArrowLeft') {
            setSliderPosition(currentVal - 5);
        } else if (e.key === 'ArrowRight') {
            setSliderPosition(currentVal + 5);
        }
    });
}

/* ==========================================================================
   4. Instant Project Cost Estimator (Irish Market Calculations)
   ========================================================================== */
function initCostEstimator() {
    const areaInput = document.getElementById('gardenArea');
    const areaDisplay = document.getElementById('areaDisplay');
    const scopeRadios = document.querySelectorAll('input[name="serviceScope"]');
    const countySelect = document.getElementById('countySelect');
    const priceOutput = document.getElementById('priceOutput');
    const durationOutput = document.getElementById('durationOutput');
    const lockInBtn = document.getElementById('lockInQuoteBtn');
    const interestSelect = document.getElementById('interestServices');

    if (!areaInput || !priceOutput) return;

    // Rates per m² for Irish landscaping market
    const serviceTiers = {
        paving: {
            basePerM2: 105,       // High quality porcelain + sub-base + drainage
            baseDays: 5,
            daysPerM2: 0.05,
            formOption: 'paving'
        },
        turf: {
            basePerM2: 55,        // French drain sub-base + roll-out turf
            baseDays: 4,
            daysPerM2: 0.04,
            formOption: 'lawn'
        },
        full: {
            basePerM2: 165,       // Combined hardscaping, turf, raised planters
            baseDays: 9,
            daysPerM2: 0.07,
            formOption: 'full'
        },
        luxury: {
            basePerM2: 240,       // Full makeover + Cedar pergola + 3D design + 12V LED
            baseDays: 14,
            daysPerM2: 0.08,
            formOption: 'pergola'
        }
    };

    function calculateEstimate() {
        const area = parseInt(areaInput.value, 10);
        areaDisplay.textContent = `${area} m²`;

        // Find selected scope
        let selectedScope = 'paving';
        scopeRadios.forEach(radio => {
            if (radio.checked) {
                selectedScope = radio.value;
                // Add active visual state to parent card
                radio.closest('.package-radio-label').classList.add('active');
            } else {
                radio.closest('.package-radio-label').classList.remove('active');
            }
        });

        const tier = serviceTiers[selectedScope];
        let totalCost = area * tier.basePerM2;

        // Base minimum cost
        totalCost = Math.max(3200, totalCost);

        // County logistics factor
        const county = countySelect ? countySelect.value : 'dublin';
        if (county === 'other') {
            totalCost += 350; // travel surcharge for outer counties
        }

        // Round to nearest 50 for realistic quote look
        totalCost = Math.round(totalCost / 50) * 50;

        // Estimated working days
        const totalDays = Math.ceil(tier.baseDays + (area * tier.daysPerM2));
        const durationText = `${totalDays} - ${totalDays + 3} Working Days`;

        // Update displays
        animateValue(priceOutput, parseInt(priceOutput.textContent.replace(/,/g, ''), 10) || 0, totalCost, 400);
        if (durationOutput) {
            durationOutput.textContent = durationText;
        }

        return { selectedScope, totalCost };
    }

    // Number animation helper
    function animateValue(element, start, end, duration) {
        if (start === end) return;
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / 20));
        const timer = setInterval(() => {
            current += Math.ceil(range / 15);
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.textContent = current.toLocaleString('en-IE');
        }, stepTime);
    }

    // Event listeners
    areaInput.addEventListener('input', calculateEstimate);
    scopeRadios.forEach(r => r.addEventListener('change', calculateEstimate));
    if (countySelect) countySelect.addEventListener('change', calculateEstimate);

    // Initial calculation
    calculateEstimate();

    // "Lock In This Estimate" button action
    if (lockInBtn && interestSelect) {
        lockInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { selectedScope } = calculateEstimate();
            const matchingOption = serviceTiers[selectedScope].formOption;
            if (matchingOption) {
                interestSelect.value = matchingOption;
            }

            const notesField = document.getElementById('clientNotes');
            if (notesField) {
                notesField.value = `Estimated Garden Area: ${areaInput.value}m². Ballpark price calculated: €${priceOutput.textContent}.`;
            }

            // Smooth scroll to contact
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }

            showToast(`Estimate of €${priceOutput.textContent} pre-filled in your booking form!`);
        });
    }
}

/* ==========================================================================
   5. Consultation Form Submission & Toast Notifications
   ========================================================================== */
function initConsultationForm() {
    const form = document.getElementById('consultationForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('clientName').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        const county = document.getElementById('clientCounty').value;

        if (!name || !phone || !county) {
            showToast('Please complete all required fields.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing Booking...</span>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            if (feedback) {
                feedback.className = 'form-feedback success';
                feedback.innerHTML = `☘️ Thank you, <strong>${name}</strong>! Your consultation request for <strong>${county}</strong> has been received. One of our ALCI master designers will call you at <strong>${phone}</strong> within 24 hours to schedule your free on-site survey and 3D concept.`;
            }

            showToast('Consultation request sent successfully!');
            form.reset();
        }, 800);
    });
}

/* ==========================================================================
   6. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
