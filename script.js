// ===== Toast Notification System =====
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    if (type === 'success') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    else if (type === 'error' || type === 'danger' || type === 'warning') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
    else if (type === 'download') icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
    
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.classList.add('hide'); setTimeout(() => this.parentElement.remove(), 300)">×</button>
    `;
    container.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }, 4000);
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// ===== Mobile Menu (Hamburger) =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu when nav link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== Main Section Tab Routing Logic =====
const mainTabIds = ['beranda', 'modul', 'materi', 'studikasus', 'tentang'];

function switchMainTab(targetId) {
    if (!mainTabIds.includes(targetId)) return;

    // Update nav links active class
    document.querySelectorAll('.nav-links a, .navbar-brand').forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + targetId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Hide/show sections using CSS class
    mainTabIds.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            if (id === targetId) {
                section.classList.remove('main-tab-hidden');
                // Trigger animation and visibility for child elements
                section.querySelectorAll('.animate-on-scroll').forEach(el => {
                    el.classList.add('visible');
                });
            } else {
                section.classList.add('main-tab-hidden');
            }
        }
    });

    // Special case: stats-bar goes with beranda
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        if (targetId === 'beranda') {
            statsBar.classList.remove('main-tab-hidden');
            statsBar.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('visible');
            });
        } else {
            statsBar.classList.add('main-tab-hidden');
        }
    }

    // Scroll back to top smoothly/instantly so new tab starts at the top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update URL hash without causing a page jump
    if (window.location.hash !== '#' + targetId) {
        history.pushState(null, null, '#' + targetId);
    }
}

// Intercept all anchor link clicks that target main tabs
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        const targetId = link.getAttribute('href').substring(1);
        if (mainTabIds.includes(targetId)) {
            e.preventDefault();
            switchMainTab(targetId);
            
            // Close mobile menu if open
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            }
        }
    }
});

// Handle initial load and browser back/forward buttons
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && mainTabIds.includes(hash)) {
        switchMainTab(hash);
    } else {
        switchMainTab('beranda');
    }
});

// Run once on load
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.substring(1);
    if (hash && mainTabIds.includes(hash)) {
        switchMainTab(hash);
    } else {
        switchMainTab('beranda');
    }
});

// ===== Tab Navigation =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const target = document.getElementById('tab-' + tabName);
    if (target) {
        target.classList.add('active');
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
    });
});

function scrollToTab(tabName) {
    switchMainTab('materi');
    switchTab(tabName);
}

// ===== Interactive Quiz Logic (Multi-Question) =====
function selectQuizOption(option) {
    const questionBlock = option.closest('.quiz-question-block');
    questionBlock.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    option.classList.add('selected');
}

function checkAllQuestions(quizId) {
    const quizCard = document.getElementById(quizId);
    const questionBlocks = quizCard.querySelectorAll('.quiz-question-block');
    let correctCount = 0;
    const totalQuestions = questionBlocks.length;
    let allAnswered = true;

    questionBlocks.forEach(block => {
        const selected = block.querySelector('.quiz-option.selected');
        if (!selected) {
            allAnswered = false;
        }
    });

    if (!allAnswered) {
        showToast('Mohon jawab seluruh pertanyaan kuis terlebih dahulu!', 'warning');
        return;
    }

    questionBlocks.forEach((block) => {
        const correctIndex = parseInt(block.getAttribute('data-correct'));
        const selected = block.querySelector('.quiz-option.selected');
        const selectedIndex = parseInt(selected.getAttribute('data-index'));
        const feedbackDiv = block.querySelector('.quiz-feedback-individual');
        
        // Clear previous classes
        block.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('correct', 'wrong');
        });

        if (selectedIndex === correctIndex) {
            selected.classList.add('correct');
            feedbackDiv.innerHTML = `<span style="color: var(--success); font-weight: 700;">✓ Benar!</span>`;
            correctCount++;
        } else {
            selected.classList.add('wrong');
            block.querySelectorAll('.quiz-option')[correctIndex].classList.add('correct');
            feedbackDiv.innerHTML = `<span style="color: var(--danger); font-weight: 700;">✗ Salah!</span> Jawaban benar diwarnai hijau.`;
        }
    });

    const scoreSummary = document.getElementById('score-' + quizId);
    scoreSummary.style.display = 'block';
    
    let feedbackMessage = '';
    if (correctCount === totalQuestions) {
        feedbackMessage = 'Luar biasa! Pemahaman Anda sangat matang.';
        showToast('Selamat! Semua jawaban Anda benar.', 'success');
    } else {
        feedbackMessage = 'Pelajari kembali materi di atas untuk memantapkan jawaban Anda.';
        showToast(`Kuis selesai. Skor Anda: ${correctCount}/${totalQuestions}`, 'info');
    }
    
    scoreSummary.innerHTML = `Skor Anda: <strong>${correctCount} / ${totalQuestions}</strong> (${Math.round((correctCount/totalQuestions)*100)}%). ${feedbackMessage}`;
}

        // ===== Interactive Glossary Search/Filter =====
        const glossarySearch = document.getElementById('glossarySearch');
        const glossaryList = document.getElementById('glossaryList');

        if (glossarySearch && glossaryList) {
            glossarySearch.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                const items = glossaryList.querySelectorAll('.glosarium-item');
                
                items.forEach(item => {
                    const dt = item.querySelector('dt').textContent.toLowerCase();
                    const dd = item.querySelector('dd').textContent.toLowerCase();
                    
                    if (dt.includes(query) || dd.includes(query)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }

        // ===== Scroll Animations (Intersection Observer) =====
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        })        // ===== Learning Progress Tracker =====
        let completedModules = JSON.parse(localStorage.getItem('completedModules')) || {
            prinsip: false,
            muamalah: false,
            penerapan: false,
            implikasi: false
        };

        function getModuleDisplayName(moduleName) {
            const names = {
                prinsip: 'Prinsip',
                muamalah: 'Muamalah',
                penerapan: 'Penerapan',
                implikasi: 'Implikasi'
            };
            return names[moduleName] || moduleName;
        }

        function toggleModuleCompletion(moduleName) {
            completedModules[moduleName] = !completedModules[moduleName];
            localStorage.setItem('completedModules', JSON.stringify(completedModules));
            updateProgressBar();
            
            const isCompleted = completedModules[moduleName];
            const btn = document.querySelector(`.completion-btn[data-module="${moduleName}"]`);
            if (btn) {
                if (isCompleted) {
                    btn.classList.add('completed');
                    btn.innerHTML = `<span class="icon">✓</span> <span class="text">Modul Selesai Dibaca</span>`;
                    showToast(`Selamat! Anda telah menyelesaikan modul ${getModuleDisplayName(moduleName)}.`, 'success');
                } else {
                    btn.classList.remove('completed');
                    btn.innerHTML = `<span class="icon">○</span> <span class="text">Tandai Modul ${getModuleDisplayName(moduleName)} Selesai</span>`;
                    showToast(`Status penyelesaian modul ${getModuleDisplayName(moduleName)} dibatalkan.`, 'info');
                }
            }
        }

        function updateProgressBar() {
            const keys = Object.keys(completedModules);
            const completedCount = keys.filter(k => completedModules[k]).length;
            const percentage = Math.round((completedCount / keys.length) * 100);
            
            const barFill = document.getElementById('progress-bar-fill');
            const percentText = document.getElementById('progress-percentage');
            const statusText = document.getElementById('progress-status-text');
            
            if (barFill && percentText && statusText) {
                barFill.style.width = percentage + '%';
                percentText.textContent = percentage + '% Selesai';
                
                // Update button states on load
                keys.forEach(moduleName => {
                    const btn = document.querySelector(`.completion-btn[data-module="${moduleName}"]`);
                    if (btn) {
                        if (completedModules[moduleName]) {
                            btn.classList.add('completed');
                            btn.innerHTML = `<span class="icon">✓</span> <span class="text">Modul Selesai Dibaca</span>`;
                        } else {
                            btn.classList.remove('completed');
                            btn.innerHTML = `<span class="icon">○</span> <span class="text">Tandai Modul ${getModuleDisplayName(moduleName)} Selesai</span>`;
                        }
                    }
                });
                
                if (completedCount === 0) {
                    statusText.innerHTML = `Belum ada modul yang diselesaikan. Yuk mulai belajar dari bab <strong>Prinsip</strong>!`;
                } else if (completedCount === keys.length) {
                    statusText.innerHTML = `🎉 <strong>Luar biasa!</strong> Anda telah menyelesaikan seluruh materi modul. Silakan uji diri Anda di menu Studi Kasus!`;
                } else {
                    statusText.innerHTML = `Bagus! Anda telah menyelesaikan <strong>${completedCount} dari ${keys.length}</strong> modul. Teruskan belajar!`;
                }
            }
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }



        // ===== Forum Diskusi Interaktif (Removed) =====

        // Theme Switcher Functions
        window.toggleTheme = function() {
            const body = document.body;
            const themeBtn = document.getElementById('themeToggle');
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                themeBtn.innerHTML = 'Mode Terang';
                localStorage.setItem('theme', 'dark');
            } else {
                body.classList.add('light-theme');
                themeBtn.innerHTML = 'Mode Gelap';
                localStorage.setItem('theme', 'light');
            }
        };

        // Initialize Theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        const themeBtn = document.getElementById('themeToggle');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (themeBtn) themeBtn.innerHTML = 'Mode Gelap';
        } else {
            document.body.classList.remove('light-theme');
            if (themeBtn) themeBtn.innerHTML = 'Mode Terang';
        }

        // Initialize features on script load
        updateProgressBar();
        // Forum rendering removed

        // Initialize active main tab based on URL hash immediately
        const initialHash = window.location.hash.substring(1);
        if (initialHash && mainTabIds.includes(initialHash)) {
            switchMainTab(initialHash);
        } else {
            switchMainTab('beranda');
        }
