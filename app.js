/**
 * ÉireScape Landscaping & Garden Design Ireland
 * Multi-Tab Portal, Global Search, and Interactive Project Manager (Add & Delete)
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initTabNavigation();
    initGlobalSearch();
    initServicesFilter();
    initBeforeAfterSlider();
    initCostEstimator();
    initProjectManager();
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
   2. Accessible Multi-Tab Navigation System
   ========================================================================== */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-trigger-btn');
    const tabPanels = document.querySelectorAll('.tab-panel-view');
    const tabJumps = document.querySelectorAll('[data-tab-jump]');

    if (!tabButtons.length || !tabPanels.length) return;

    // Switch tab function
    window.switchTab = function(tabKey, scrollToTop = true) {
        let found = false;

        tabButtons.forEach(btn => {
            const isMatch = btn.getAttribute('data-tab') === tabKey;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
            if (isMatch) found = true;
        });

        tabPanels.forEach(panel => {
            const isMatch = panel.id === `panel-${tabKey}`;
            panel.classList.toggle('active', isMatch);
        });

        // Update URL hash without jumping page abruptly
        if (history.pushState) {
            history.pushState(null, null, `#${tabKey}`);
        } else {
            location.hash = `#${tabKey}`;
        }

        if (scrollToTop) {
            const tabNav = document.getElementById('mainTabNav');
            if (tabNav) {
                const navPos = tabNav.getBoundingClientRect().top + window.scrollY - 70;
                window.scrollTo({ top: Math.max(0, navPos), behavior: 'smooth' });
            }
        }

        // If switching to gallery or calculator, recalculate dimensions
        if (tabKey === 'gallery') {
            setTimeout(() => {
                const slider = document.getElementById('comparisonSlider');
                if (slider) slider.style.setProperty('--split-pos', '50%');
            }, 50);
        }
    };

    // Tab Button Clicks
    tabButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const tabKey = btn.getAttribute('data-tab');
            window.switchTab(tabKey, true);
        });

        // Keyboard Arrow Navigation between tabs (WAI-ARIA pattern)
        btn.addEventListener('keydown', (e) => {
            let targetIndex = index;
            if (e.key === 'ArrowRight') {
                targetIndex = (index + 1) % tabButtons.length;
            } else if (e.key === 'ArrowLeft') {
                targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            } else if (e.key === 'Home') {
                targetIndex = 0;
            } else if (e.key === 'End') {
                targetIndex = tabButtons.length - 1;
            } else {
                return;
            }

            e.preventDefault();
            tabButtons[targetIndex].focus();
            tabButtons[targetIndex].click();
        });
    });

    // Quick Portal & CTA Tab Jump buttons
    tabJumps.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = el.getAttribute('data-tab-jump');
            if (targetTab) {
                window.switchTab(targetTab, true);
            }
        });

        // Support Enter and Space on focusable jump cards
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });

    // Handle initial hash on page load
    const currentHash = window.location.hash.replace('#', '');
    const validTabs = ['overview', 'services', 'gallery', 'calculator', 'manager', 'reviews', 'contact'];
    if (validTabs.includes(currentHash)) {
        window.switchTab(currentHash, false);
    }

    // Listen to browser Back / Forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '');
        if (validTabs.includes(hash)) {
            window.switchTab(hash, false);
        }
    });
}

/* ==========================================================================
   3. Global Quick Search & Finder Component
   ========================================================================== */
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    const clearBtn = document.getElementById('searchClearBtn');

    if (!searchInput || !searchDropdown) return;

    // Searchable Knowledge Index
    const searchDatabase = [
        { title: "Porcelain & Granite Hardscaping", desc: "Anti-slip R11 rated slabs, freeze-thaw protection, zero moss.", tab: "services", badge: "Services" },
        { title: "Lawn Drainage & French Drains", desc: "Perforated pipe herringbone systems for squelchy Irish clay soils.", tab: "services", badge: "Services" },
        { title: "Cedar Pergolas & Outdoor Living", desc: "Western Red Cedar with motorized louvers and acoustic screening.", tab: "services", badge: "Services" },
        { title: "3D Architectural Landscape Design", desc: "Photorealistic 4K renders, scale blueprints, and planting schedules.", tab: "services", badge: "Services" },
        { title: "Native & Pollinator Planting", desc: "Sensory all-season shrubs aligned with the All-Ireland Pollinator Plan.", tab: "services", badge: "Services" },
        { title: "The Irish Climate Difference", desc: "Why standard landscaping fails under 1,200mm rain & SuDS drainage.", tab: "services", badge: "Climate Tech" },
        { title: "Interactive Transformation Slider", desc: "Drag to compare Before and After photos of Dublin garden makeovers.", tab: "gallery", badge: "Gallery" },
        { title: "Project Cost Estimator", desc: "Calculate exact ballpark quotation in € based on garden footprint (m²).", tab: "calculator", badge: "Estimator" },
        { title: "Custom Project Manager (Add / Delete)", desc: "Add custom landscaping specifications or delete saved project packages.", tab: "manager", badge: "Manager" },
        { title: "Planning Permission in Ireland", desc: "Ground-level patios and pergolas under 4m are residential exempt.", tab: "reviews", badge: "FAQ" },
        { title: "5-Year Structural Guarantee", desc: "ALCI certified warranty on foundations, drainage channels, and stonework.", tab: "reviews", badge: "FAQ" },
        { title: "Book Free 3D On-Site Survey", desc: "Schedule complimentary consultation across Dublin, Cork, and nationwide.", tab: "contact", badge: "Booking" }
    ];

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (clearBtn) {
            clearBtn.style.display = query ? 'block' : 'none';
        }

        if (query.length < 2) {
            searchDropdown.classList.remove('active');
            searchDropdown.innerHTML = '';
            return;
        }

        const matches = searchDatabase.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.desc.toLowerCase().includes(query) ||
            item.badge.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            searchDropdown.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: var(--color-text-muted); font-size: 0.85rem;">
                    No direct matches found for "<strong>${escapeHtml(query)}</strong>". Try searching "paving", "drainage", or "calculator".
                </div>
            `;
            searchDropdown.classList.add('active');
            return;
        }

        searchDropdown.innerHTML = matches.map(item => `
            <button type="button" class="search-result-item" data-tab-dest="${item.tab}">
                <div class="search-item-info">
                    <div class="search-item-title">${item.title}</div>
                    <div class="search-item-desc">${item.desc}</div>
                </div>
                <span class="search-item-badge">${item.badge}</span>
            </button>
        `).join('');

        searchDropdown.classList.add('active');

        // Attach click handlers to search results
        searchDropdown.querySelectorAll('.search-result-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab-dest');
                if (targetTab && window.switchTab) {
                    window.switchTab(targetTab, true);
                    searchDropdown.classList.remove('active');
                    searchInput.value = '';
                    if (clearBtn) clearBtn.style.display = 'none';
                }
            });
        });
    }

    searchInput.addEventListener('input', handleSearch);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            searchDropdown.classList.remove('active');
            searchInput.focus();
        });
    }

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
            searchDropdown.classList.remove('active');
        }
    });
}

/* ==========================================================================
   4. Services Category Filter
   ========================================================================== */
function initServicesFilter() {
    const filterChips = document.querySelectorAll('#servicesFilterBar .filter-chip');
    const serviceCards = document.querySelectorAll('#servicesGrid .service-card');

    if (!filterChips.length || !serviceCards.length) return;

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filterVal = chip.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category') || '';
                if (filterVal === 'all' || cardCategory.includes(filterVal)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   5. Interactive Before/After Split Comparison Slider
   ========================================================================== */
function initBeforeAfterSlider() {
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('sliderHandle');
    if (!slider || !handle) return;

    let isDragging = false;
    setSliderPosition(50);

    function setSliderPosition(percentage) {
        const clamped = Math.max(3, Math.min(97, percentage));
        slider.style.setProperty('--split-pos', `${clamped}%`);
    }

    function handleMove(clientX) {
        const rect = slider.getBoundingClientRect();
        if (rect.width === 0) return;
        const offsetX = clientX - rect.left;
        const percentage = (offsetX / rect.width) * 100;
        setSliderPosition(percentage);
    }

    function onStart(e) {
        isDragging = true;
        slider.style.cursor = 'ew-resize';
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        handleMove(clientX);
    }

    function onMove(e) {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        handleMove(clientX);
    }

    function onEnd() {
        if (isDragging) {
            isDragging = false;
            slider.style.cursor = 'ew-resize';
        }
    }

    slider.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    slider.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

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
   6. Instant Project Cost Estimator (Irish Market Calculations)
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

    const serviceTiers = {
        paving: { basePerM2: 105, baseDays: 5, daysPerM2: 0.05, formOption: 'paving' },
        turf: { basePerM2: 55, baseDays: 4, daysPerM2: 0.04, formOption: 'lawn' },
        full: { basePerM2: 165, baseDays: 9, daysPerM2: 0.07, formOption: 'full' },
        luxury: { basePerM2: 240, baseDays: 14, daysPerM2: 0.08, formOption: 'pergola' }
    };

    function calculateEstimate() {
        const area = parseInt(areaInput.value, 10);
        areaDisplay.textContent = `${area} m²`;

        let selectedScope = 'paving';
        scopeRadios.forEach(radio => {
            if (radio.checked) {
                selectedScope = radio.value;
                radio.closest('.package-radio-label').classList.add('active');
            } else {
                radio.closest('.package-radio-label').classList.remove('active');
            }
        });

        const tier = serviceTiers[selectedScope];
        let totalCost = area * tier.basePerM2;
        totalCost = Math.max(3200, totalCost);

        const county = countySelect ? countySelect.value : 'dublin';
        if (county === 'other') {
            totalCost += 350;
        }

        totalCost = Math.round(totalCost / 50) * 50;

        const totalDays = Math.ceil(tier.baseDays + (area * tier.daysPerM2));
        const durationText = `${totalDays} - ${totalDays + 3} Working Days`;

        priceOutput.textContent = totalCost.toLocaleString('en-IE');
        if (durationOutput) {
            durationOutput.textContent = durationText;
        }

        return { selectedScope, totalCost, durationText };
    }

    areaInput.addEventListener('input', calculateEstimate);
    scopeRadios.forEach(r => r.addEventListener('change', calculateEstimate));
    if (countySelect) countySelect.addEventListener('change', calculateEstimate);

    calculateEstimate();

    // Lock In Quote button
    if (lockInBtn) {
        lockInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { selectedScope, totalCost } = calculateEstimate();

            if (interestSelect) {
                const matching = serviceTiers[selectedScope].formOption;
                if (matching) interestSelect.value = matching;
            }

            const notesField = document.getElementById('clientNotes');
            if (notesField) {
                notesField.value = `Estimated Garden Area: ${areaInput.value}m². Ballpark price: €${totalCost.toLocaleString('en-IE')}. Scope: ${selectedScope.toUpperCase()}.`;
            }

            if (window.switchTab) {
                window.switchTab('contact', true);
            }

            showToast(`Estimate of €${totalCost.toLocaleString('en-IE')} pre-filled in your booking form!`);
        });
    }
}

/* ==========================================================================
   7. Interactive Project & Quote Manager (ADD & DELETE FEATURES)
   ========================================================================== */
function initProjectManager() {
    const managerGrid = document.getElementById('managerGrid');
    const badgeCounter = document.getElementById('managerCountBadge');
    const openAddModalBtn = document.getElementById('openAddProjectModalBtn');
    const addModal = document.getElementById('addProjectModal');
    const closeAddModalBtn = document.getElementById('closeAddModalBtn');
    const cancelAddModalBtn = document.getElementById('cancelAddModalBtn');
    const addForm = document.getElementById('addProjectForm');

    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteConfirmText = document.getElementById('deleteConfirmText');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    const searchInput = document.getElementById('managerSearchInput');
    const filterChips = document.querySelectorAll('[data-manager-filter]');
    const resetCatalogBtn = document.getElementById('resetProjectsBtn');

    if (!managerGrid) return;

    // Default Seed Projects (Irish Landscaping Portfolio)
    const defaultProjects = [
        {
            id: 'proj-1',
            title: 'Blackrock Porcelain Living Terrace',
            category: 'Porcelain Paving',
            location: 'South Dublin',
            price: 11500,
            duration: '10 Working Days',
            desc: '60m² R11 vitrified outdoor porcelain with laser-leveled MOT Type 1 aggregate base, French drainage channel, and flush threshold transitions.',
            img: 'assets/after_garden.jpg'
        },
        {
            id: 'proj-2',
            title: 'Malahide All-Weather Family Lawn & Drainage',
            category: 'Lawn & Drainage',
            location: 'North Dublin',
            price: 5800,
            duration: '6 Working Days',
            desc: 'Perforated French drain herringbone system with silica sand soil aeration, weed barrier membrane, and roll-out grade-A lawn.',
            img: 'assets/hero_garden.jpg'
        },
        {
            id: 'proj-3',
            title: 'Killiney Luxury Louvered Cedar Pergola',
            category: 'Cedar Pergola',
            location: 'South Dublin',
            price: 14200,
            duration: '12 Working Days',
            desc: 'Bespoke Western Red Cedar pergola with motorized waterproof louvers, integrated warm LED spotlights, and horizontal acoustic slatted privacy screening.',
            img: 'assets/after_garden.jpg'
        },
        {
            id: 'proj-4',
            title: 'Cork Coastal Terraced Sanctuary',
            category: 'Complete Makeover',
            location: 'Douglas, Cork',
            price: 18500,
            duration: '16 Working Days',
            desc: 'Multi-tiered sloping backyard reinforced with natural Irish limestone retaining walls, French soakaways, and salt-tolerant coastal perennials.',
            img: 'assets/hero_garden.jpg'
        }
    ];

    const STORAGE_KEY = 'eirescape_projects_catalog';

    // Retrieve from LocalStorage or seed defaults
    function getProjects() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) return parsed;
            }
        } catch (e) {
            console.error('Error loading projects from localStorage', e);
        }
        return [...defaultProjects];
    }

    function saveProjects(projects) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        } catch (e) {
            console.error('Error saving projects to localStorage', e);
        }
        updateBadge(projects.length);
    }

    function updateBadge(count) {
        if (badgeCounter) {
            badgeCounter.textContent = count;
        }
    }

    let activeFilter = 'all';
    let activeQuery = '';
    let projectToDeleteId = null;

    // Render projects grid
    function renderProjects() {
        const allProjects = getProjects();
        updateBadge(allProjects.length);

        const filtered = allProjects.filter(item => {
            const matchesCategory = (activeFilter === 'all') || 
                item.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
                item.location.toLowerCase().includes(activeFilter.toLowerCase());

            const q = activeQuery.toLowerCase().trim();
            const matchesQuery = !q || 
                item.title.toLowerCase().includes(q) || 
                item.location.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);

            return matchesCategory && matchesQuery;
        });

        if (filtered.length === 0) {
            managerGrid.innerHTML = `
                <div class="empty-manager-state">
                    <div class="empty-icon">🌿</div>
                    <h3>No Projects Found</h3>
                    <p style="color: var(--color-text-muted); margin-bottom: 1.25rem;">
                        ${allProjects.length === 0 ? "You have deleted all projects. Click 'Reset Defaults' to restore samples, or click '+ Add New Project'." : "No projects match your current search or filter."}
                    </p>
                    <button type="button" class="btn btn-primary" id="emptyAddBtn">
                        <span>➕ Add New Project</span>
                    </button>
                </div>
            `;

            const emptyAddBtn = document.getElementById('emptyAddBtn');
            if (emptyAddBtn) {
                emptyAddBtn.addEventListener('click', () => openModal(addModal));
            }
            return;
        }

        managerGrid.innerHTML = filtered.map(item => `
            <div class="manager-card" id="card-${item.id}">
                <div class="manager-card-thumb">
                    <img src="${item.img || 'assets/after_garden.jpg'}" alt="${escapeHtml(item.title)}">
                    <span class="manager-thumb-badge">${escapeHtml(item.category)}</span>
                    <span class="manager-thumb-location">📍 ${escapeHtml(item.location)}</span>
                </div>
                <div class="manager-card-body">
                    <h3 class="manager-card-title">${escapeHtml(item.title)}</h3>
                    <p class="manager-card-desc">${escapeHtml(item.desc)}</p>
                    <div class="manager-card-meta">
                        <span class="meta-price">€${Number(item.price).toLocaleString('en-IE')}</span>
                        <span class="meta-duration">⏱️ ${escapeHtml(item.duration)}</span>
                    </div>
                    <div class="manager-card-footer">
                        <button type="button" class="btn-card-inquire" data-inquire-id="${item.id}">
                            💬 Inquire About This
                        </button>
                        <button type="button" class="btn-card-delete" data-delete-id="${item.id}" aria-label="Delete project ${escapeHtml(item.title)}">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Attach Delete Handlers
        managerGrid.querySelectorAll('[data-delete-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-delete-id');
                const project = allProjects.find(p => p.id === id);
                if (project) {
                    projectToDeleteId = id;
                    if (deleteConfirmText) {
                        deleteConfirmText.innerHTML = `Are you sure you want to permanently delete <strong>"${escapeHtml(project.title)}"</strong> from your saved portfolio?`;
                    }
                    openModal(deleteModal);
                }
            });
        });

        // Attach Inquire Handlers (Pre-fills contact form)
        managerGrid.querySelectorAll('[data-inquire-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-inquire-id');
                const project = allProjects.find(p => p.id === id);
                if (project) {
                    const notesField = document.getElementById('clientNotes');
                    if (notesField) {
                        notesField.value = `Interested in Project Package: "${project.title}" (Est: €${Number(project.price).toLocaleString('en-IE')}, Location: ${project.location}). Please arrange consultation.`;
                    }
                    if (window.switchTab) {
                        window.switchTab('contact', true);
                    }
                    showToast(`Details for "${project.title}" pre-filled in booking form!`);
                }
            });
        });
    }

    // Modal Helper
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add Modal Handlers
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => openModal(addModal));
    }

    if (closeAddModalBtn) {
        closeAddModalBtn.addEventListener('click', () => closeModal(addModal));
    }

    if (cancelAddModalBtn) {
        cancelAddModalBtn.addEventListener('click', () => closeModal(addModal));
    }

    // Add Project Form Submit
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('newProjectTitle').value.trim();
            const category = document.getElementById('newProjectCategory').value;
            const location = document.getElementById('newProjectLocation').value.trim();
            const price = parseFloat(document.getElementById('newProjectPrice').value) || 0;
            const duration = document.getElementById('newProjectDuration').value.trim();
            const desc = document.getElementById('newProjectDesc').value.trim();
            const img = document.getElementById('newProjectImg').value;

            if (!title || !location || !price || !duration || !desc) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            const newProject = {
                id: 'proj-' + Date.now(),
                title,
                category,
                location,
                price,
                duration,
                desc,
                img
            };

            const currentProjects = getProjects();
            currentProjects.unshift(newProject);
            saveProjects(currentProjects);

            renderProjects();
            closeModal(addModal);
            addForm.reset();

            showToast(`✅ "${title}" added to project catalog!`);
        });
    }

    // Delete Confirmation Handlers
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            projectToDeleteId = null;
            closeModal(deleteModal);
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (!projectToDeleteId) return;

            let currentProjects = getProjects();
            const project = currentProjects.find(p => p.id === projectToDeleteId);
            const title = project ? project.title : 'Project';

            currentProjects = currentProjects.filter(p => p.id !== projectToDeleteId);
            saveProjects(currentProjects);

            projectToDeleteId = null;
            closeModal(deleteModal);
            renderProjects();

            showToast(`🗑️ "${title}" was deleted.`);
        });
    }

    // Reset Defaults Handler
    if (resetCatalogBtn) {
        resetCatalogBtn.addEventListener('click', () => {
            saveProjects([...defaultProjects]);
            activeFilter = 'all';
            activeQuery = '';
            if (searchInput) searchInput.value = '';
            filterChips.forEach(c => c.classList.toggle('active', c.getAttribute('data-manager-filter') === 'all'));
            renderProjects();
            showToast('🔄 Project catalog reset to default samples.');
        });
    }

    // Filter and Search inside Manager
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeFilter = chip.getAttribute('data-manager-filter') || 'all';
            renderProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            activeQuery = searchInput.value;
            renderProjects();
        });
    }

    // Close modals on escape key or backdrop click
    [addModal, deleteModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(addModal);
            closeModal(deleteModal);
        }
    });

    // Initial render
    renderProjects();
}

/* ==========================================================================
   8. Consultation Form Submission & Toast Notifications
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
                feedback.innerHTML = `☘️ Thank you, <strong>${escapeHtml(name)}</strong>! Your consultation request for <strong>${escapeHtml(county)}</strong> has been received. One of our ALCI master designers will call you at <strong>${escapeHtml(phone)}</strong> within 24 hours to schedule your free on-site survey and 3D concept.`;
            }

            showToast('Consultation request sent successfully!');
            form.reset();
        }, 700);
    });
}

/* ==========================================================================
   9. Toast Notification Helper
   ========================================================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;
    toast.innerHTML = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Security helper
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
