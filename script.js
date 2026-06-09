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
const mainTabIds = ['beranda', 'modul', 'prinsip', 'studikasus', 'referensi', 'forum', 'tentang'];

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
    switchMainTab('prinsip');
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
        });

        // ===== Learning Progress Tracker =====
        let completedModules = JSON.parse(localStorage.getItem('completedModules')) || {
            pengantar: false,
            muamalah: false,
            akhlaq: false,
            zakat: false
        };

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
                    showToast(`Selamat! Anda telah menyelesaikan modul ${capitalizeFirstLetter(moduleName)}.`, 'success');
                } else {
                    btn.classList.remove('completed');
                    btn.innerHTML = `<span class="icon">○</span> <span class="text">Tandai Modul ${capitalizeFirstLetter(moduleName)} Selesai</span>`;
                    showToast(`Status penyelesaian modul ${capitalizeFirstLetter(moduleName)} dibatalkan.`, 'info');
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
                            btn.innerHTML = `<span class="icon">○</span> <span class="text">Tandai Modul ${capitalizeFirstLetter(moduleName)} Selesai</span>`;
                        }
                    }
                });
                
                if (completedCount === 0) {
                    statusText.innerHTML = `Belum ada modul yang diselesaikan. Yuk mulai belajar dari bab <strong>Pengantar</strong>!`;
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

        // ===== Interactive Zakat Calculator =====
        function calculateZakat() {
            const goldPrice = parseFloat(document.getElementById('goldPrice').value) || 0;
            const cashAsset = parseFloat(document.getElementById('cashAsset').value) || 0;
            const inventoryAsset = parseFloat(document.getElementById('inventoryAsset').value) || 0;
            const receivableAsset = parseFloat(document.getElementById('receivableAsset').value) || 0;
            const debtLiability = parseFloat(document.getElementById('debtLiability').value) || 0;
            
            if (goldPrice <= 0) {
                showToast('Harga emas per gram harus valid!', 'error');
                return;
            }
            
            const nisabThreshold = 85 * goldPrice; // 85 gram gold
            const totalAssets = cashAsset + inventoryAsset + receivableAsset;
            const netAssets = totalAssets - debtLiability;
            
            const resultDiv = document.getElementById('zakatResult');
            resultDiv.style.display = 'block';
            
            const formatter = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            });
            
            let resultHTML = `
                <div class="result-summary">
                    <h5>Rincian Perhitungan Zakat:</h5>
                    <table class="calc-result-table">
                        <tr>
                            <td>Total Aset Lancar (Kas + Persediaan + Piutang)</td>
                            <td>: ${formatter.format(totalAssets)}</td>
                        </tr>
                        <tr>
                            <td>Kewajiban Lancar (Utang Jatuh Tempo)</td>
                            <td>: <span style="color: var(--danger);">- ${formatter.format(debtLiability)}</span></td>
                        </tr>
                        <tr class="highlight-row">
                            <td><strong>Harta Kena Zakat (Bersih)</strong></td>
                            <td>: <strong>${formatter.format(netAssets)}</strong></td>
                        </tr>
                        <tr>
                            <td>Nisab Zakat Niaga (85 Gram Emas @ ${formatter.format(goldPrice)})</td>
                            <td>: ${formatter.format(nisabThreshold)}</td>
                        </tr>
                    </table>
                </div>
            `;
            
            if (netAssets >= nisabThreshold) {
                const zakatToPay = netAssets * 0.025; // 2.5%
                resultHTML += `
                    <div class="result-status success">
                        <span class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-award"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg></span>
                        <div class="status-text">
                            <h6>Wajib Menunaikan Zakat!</h6>
                            <p>Harta bersih Anda (${formatter.format(netAssets)}) telah mencapai atau melebihi batas nisab (${formatter.format(nisabThreshold)}). Zakat yang wajib dikeluarkan (2.5%) adalah:</p>
                            <h5 class="zakat-value">${formatter.format(zakatToPay)}</h5>
                            <span class="dalil-note">Dalil: "Ambillah zakat dari sebagian harta mereka..." (QS. At-Taubah: 103)</span>
                        </div>
                    </div>
                `;
                showToast('Perhitungan selesai: Anda wajib membayar zakat.', 'success');
            } else {
                resultHTML += `
                    <div class="result-status info">
                        <span class="status-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>
                        <div class="status-text">
                            <h6>Belum Wajib Zakat Niaga</h6>
                            <p>Harta bersih Anda (${formatter.format(netAssets)}) belum mencapai batas minimal nisab (${formatter.format(nisabThreshold)}). Anda tidak wajib membayar zakat perdagangan untuk tahun ini, namun dianjurkan bersedekah sukarela (Infaq/Shadaqah).</p>
                        </div>
                    </div>
                `;
                showToast('Perhitungan selesai: Belum mencapai batas nisab.', 'info');
            }
            
            resultDiv.innerHTML = resultHTML;
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // ===== Forum Diskusi Interaktif =====
        let forumQuestions = JSON.parse(localStorage.getItem('forumQuestions')) || [];

        function submitForumQuestion() {
            const nameInput = document.getElementById('forumName');
            const topicInput = document.getElementById('forumTopic');
            const questionInput = document.getElementById('forumQuestion');
            
            const name = nameInput.value.trim();
            const topic = topicInput.value;
            const question = questionInput.value.trim();
            
            if (!name || !question) {
                showToast('Nama dan pertanyaan tidak boleh kosong!', 'warning');
                return;
            }
            
            const newQuestion = {
                id: Date.now(),
                name: name,
                topic: topic,
                question: question,
                time: 'Baru saja',
                reply: null
            };
            
            forumQuestions.unshift(newQuestion);
            localStorage.setItem('forumQuestions', JSON.stringify(forumQuestions));
            
            renderForumQuestions();
            
            // Clear input
            questionInput.value = '';
            showToast('Pertanyaan Anda berhasil dikirim ke forum!', 'success');
            
            // Simulate auto academic assistant response
            setTimeout(() => {
                simulateAcademicReply(newQuestion.id, question);
            }, 2000);
        }

        function simulateAcademicReply(questionId, questionText) {
            const qIndex = forumQuestions.findIndex(q => q.id === questionId);
            if (qIndex === -1) return;
            
            const text = questionText.toLowerCase();
            let replyText = "Terima kasih atas pertanyaannya. Pertanyaan Anda sangat menarik dan akan didiskusikan oleh tim dosen pembimbing mata kuliah Pendidikan Agama Islam. Tetap pelajari modul untuk info lebih lanjut.";
            
            if (text.includes('riba') || text.includes('bunga') || text.includes('bank')) {
                replyText = "Assalamu'alaikum. Terkait riba/bunga bank, mayoritas ulama kontemporer (termasuk MUI) menyepakati bahwa bunga bank konvensional termasuk kategori riba nasi'ah yang dilarang. Sebagai solusinya, kita diarahkan menggunakan jasa perbankan syariah yang menggunakan akad kemitraan seperti Mudharabah (bagi hasil) atau Murabahah (jual beli marjin) agar terhindar dari ketidakadilan bunga tetap.";
            } else if (text.includes('dropship') || text.includes('reseller') || text.includes('online')) {
                replyText = "Assalamu'alaikum. Bisnis online dropship diperbolehkan dalam fiqih muamalah selama rukun dan syaratnya terpenuhi. Anda disarankan bertindak sebagai agen resmi (Wakil) dari supplier dengan akad wakalah bil ujrah (perwakilan dengan komisi), atau menggunakan skema akad Salam di mana pembeli membayar tunai di muka, lalu Anda memesankan barang tersebut dengan spesifikasi yang jelas untuk dikirim ke pembeli.";
            } else if (text.includes('zakat') || text.includes('niaga') || text.includes('perdagangan')) {
                replyText = "Assalamu'alaikum. Zakat perdagangan wajib dikeluarkan setahun sekali jika aset lancar dikurangi kewajiban jangka pendek telah mencapai nisab setara 85 gram emas. Tarif zakatnya adalah 2,5% dan disalurkan kepada 8 asnaf berhak (terutama fakir dan miskin untuk pengentasan kemiskinan).";
            } else if (text.includes('kerugian') || text.includes('rugi') || text.includes('mudharabah') || text.includes('musyarakah')) {
                replyText = "Assalamu'alaikum. Dalam akad Mudharabah (kemitraan modal 100% sepihak), jika terjadi kerugian bisnis alami (bukan karena kelalaian pengelola), maka kerugian materiil ditanggung sepenuhnya oleh pemilik modal. Sementara pengelola menanggung kerugian hilangnya waktu, tenaga, dan ide. Ini adalah bentuk keadilan distribusi risiko dalam ekonomi Islam.";
            }
            
            forumQuestions[qIndex].reply = {
                replier: "Asisten Akademik (UNS)",
                role: "Asisten Dosen",
                text: replyText
            };
            
            localStorage.setItem('forumQuestions', JSON.stringify(forumQuestions));
            renderForumQuestions();
            showToast('Tanggapan baru telah ditambahkan pada pertanyaan Anda.', 'info');
        }

        function renderForumQuestions() {
            const forumList = document.getElementById('forumList');
            if (!forumList) return;
            
            let html = '';
            
            forumQuestions.forEach(q => {
                let replyHTML = '';
                if (q.reply) {
                    replyHTML = `
                        <div class="forum-reply">
                            <div class="forum-reply-header">
                                <span class="forum-replier">${q.reply.replier}</span>
                                <span class="forum-reply-label">${q.reply.role}</span>
                            </div>
                            <p class="forum-reply-text">${q.reply.text}</p>
                        </div>
                    `;
                } else {
                    replyHTML = `
                        <div class="forum-reply-pending">
                            <span class="pulse-dot"></span>
                            <span class="pending-text">Menunggu tanggapan dari tim penyusun...</span>
                        </div>
                    `;
                }
                
                html += `
                    <div class="forum-item animate-on-scroll visible">
                        <div class="forum-item-header">
                            <span class="forum-user">${q.name}</span>
                            <span class="forum-time">${q.time}</span>
                            <span class="forum-badge-topic topic-${q.topic}">${capitalizeFirstLetter(q.topic)}</span>
                        </div>
                        <p class="forum-question-text">${q.question}</p>
                        ${replyHTML}
                    </div>
                `;
            });
            
            // Append default static question
            html += `
                <div class="forum-item">
                    <div class="forum-item-header">
                        <span class="forum-user">Ahmad Fauzi</span>
                        <span class="forum-time">2 jam yang lalu</span>
                        <span class="forum-badge-topic topic-muamalah">Muamalah</span>
                    </div>
                    <p class="forum-question-text">Apakah sah jual beli sistem dropship menurut fiqih muamalah jika penjual belum memegang barangnya secara fisik?</p>
                    <div class="forum-reply">
                        <div class="forum-reply-header">
                            <span class="forum-replier">Fatimah Az-Zahra (Penyusun Modul)</span>
                            <span class="forum-reply-label">Penulis</span>
                        </div>
                        <p class="forum-reply-text">Assalamu'alaikum Ahmad. Jual beli dropship diperbolehkan dalam Islam asal menggunakan skema <strong>Akad Salam</strong> (pesanan berbayar di muka) atau bertindak sebagai agen/makelar (<strong>Samsarah/Wakalah</strong>) resmi dari pemilik barang (supplier). Yang dilarang adalah menjual barang milik orang lain tanpa izin dan tanpa kejelasan akad.</p>
                    </div>
                </div>
            `;
            
            forumList.innerHTML = html;
        }

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
        renderForumQuestions();

        // Initialize active main tab based on URL hash immediately
        const initialHash = window.location.hash.substring(1);
        if (initialHash && mainTabIds.includes(initialHash)) {
            switchMainTab(initialHash);
        } else {
            switchMainTab('beranda');
        }
