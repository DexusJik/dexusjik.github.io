        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function selectPlan(planName) {
            const messageTextarea = document.getElementById('message');
            messageTextarea.value = `Hola Javier, me interesa el ${planName}. Me gustaría agendar mi primera sesión de estudio.`;
            scrollToSection('strategy-form-section');
            messageTextarea.focus();
        }

        window.onload = async function() {
            if (!window.gsap) {
                console.error('GSAP failed to load');
                return;
            }

            // --- 2. Magnetic Buttons ---
            const magneticBtns = document.querySelectorAll('.magnetic-btn');
            magneticBtns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    gsap.to(btn, {
                        x: x * 0.3,
                        y: y * 0.3,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
                
                btn.addEventListener('mouseleave', () => {
                    gsap.to(btn, {
                        x: 0,
                        y: 0,
                        duration: 0.5,
                        ease: 'elastic.out(1, 0.3)'
                    });
                });
            });

            // --- 3. Text Reveal Animation ---
            const revealContainers = document.querySelectorAll('.text-reveal-container');
            revealContainers.forEach(container => {
                const text = container.innerText;
                container.innerHTML = '';
                
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.innerText = char === ' ' ? '\u00A0' : char;
                    span.className = 'char-wrap';
                    container.appendChild(span);
                });
            });

            gsap.to('.char-wrap', {
                y: 0,
                opacity: 1,
                stagger: 0.02,
                duration: 0.8,
                ease: 'power4.out',
                delay: 0.2
            });

            // --- 4. ScrollSpy Navigation ---
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            // --- Custom Cursor Logic ---
            const cursor = document.getElementById('custom-cursor');
            
            window.addEventListener('mousemove', (e) => {
                gsap.to(cursor, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.1,
                    ease: 'power2.out'
                });
                cursor.style.opacity = '1';
            });

            const interactiveElements = document.querySelectorAll('a, button, .quiz-option-button');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('cursor-hover');
                    const hoverText = el.getAttribute('data-cursor-text');
                    if (hoverText) {
                        cursor.innerText = hoverText;
                        cursor.classList.add('cursor-text');
                    }
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('cursor-hover');
                    cursor.classList.remove('cursor-text');
                    cursor.innerText = '';
                });
            });

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.pageYOffset >= (sectionTop - 150)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
            });

            // --- Existing Parallax Logic ---
            window.addEventListener('mousemove', (e) => {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.15;
                const moveY = (e.clientY - window.innerHeight / 2) * 0.15;
                const distance = Math.sqrt(moveX*moveX + moveY*moveY) * 0.01;
                const scale = 1 + (distance * 0.1);

                gsap.to('#blur-1', { 
                    x: moveX, 
                    y: moveY, 
                    scale: scale,
                    backgroundColor: distance > 2 ? 'rgba(79, 70, 229, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                    duration: 2, 
                    ease: 'power3.out' 
                });

                gsap.to('#blur-2', { 
                    x: -moveX * 1.8, 
                    y: -moveY * 1.8, 
                    scale: 1 / scale,
                    duration: 2, 
                    ease: 'power3.out' 
                });
            });

            // --- Global Variables & Quiz Config ---
            const quizQuestionsData = [
                {
                    id: 'goal',
                    text: 'Paso 1: ¿Cuál es tu objetivo principal?',
                    options: [
                        { value: 'career', text: 'Profesional' },
                        { value: 'academic', text: 'Académico' },
                        { value: 'social', text: 'Social/Viajes' }
                    ]
                },
                {
                    id: 'grammar',
                    text: 'Paso 2: ¿Cuál es la forma más profesional de adjuntar un archivo?',
                    options: [
                        { value: 'find-attached', text: 'Please find attached...' },
                        { value: 'here-is', text: 'Here is the file...' },
                        { value: 'what-is', text: 'What is attached...' }
                    ]
                },
                {
                    id: 'tense',
                    text: 'Paso 3: Completa: "By the time we arrived, the meeting..."',
                    options: [
                        { value: 'started', text: '...started.' },
                        { value: 'had-started', text: '...had already started.' },
                        { value: 'starts', text: '...starts.' }
                    ]
                },
                {
                    id: 'vocab',
                    text: 'Paso 4: ¿Qué significa "circle back"?',
                    options: [
                        { value: 'discuss-later', text: 'Discutir más tarde' },
                        { value: 'ignore', text: 'Ignorar el tema' },
                        { value: 'return', text: 'Regresar físicamente' }
                    ]
                }
            ];

            let currentStep = 0;
            let quizAnswers = {};

            // --- DOM Elements ---
            const profilePic = document.getElementById('profile-pic');
            const quizQuestionsContainer = document.getElementById('quiz-questions-container');
            const progressBar = document.getElementById('quiz-progress-bar');
            const nextStepBtn = document.getElementById('next-step-btn');
            const quizResultDiv = document.getElementById('quiz-result');
            const cefrLevelSpan = document.getElementById('cefr-level');
            const cefrDescriptionP = document.getElementById('cefr-description');
            const whatsappRedirectBtn = document.getElementById('whatsapp-redirect-btn');

            const strategySessionForm = document.getElementById('strategy-session-form');

            // --- Utility Functions ---
            function updateProgressBar() {
                const progress = ((currentStep + 1) / quizQuestionsData.length) * 100;
                progressBar.style.width = `${progress}%`;
            }

            function showStep(stepIndex) {
                const steps = quizQuestionsContainer.children;
                const currentStepElement = document.getElementById(`quiz-step-${stepIndex + 1}`);
                const previousStepElement = document.getElementById(`quiz-step-${stepIndex}`);

                if (currentStepElement) {
                    currentStepElement.classList.add('active');
                    currentStepElement.classList.remove('hidden');
                }

                if (previousStepElement) {
                    gsap.to(previousStepElement, { 
                        opacity: 0, 
                        x: -20, 
                        duration: 0.4, 
                        onComplete: () => {
                            previousStepElement.classList.remove('active');
                            previousStepElement.classList.add('hidden');
                        } 
                    });
                }

                if (currentStepElement) {
                    gsap.fromTo(currentStepElement, 
                        { opacity: 0, x: 20 }, 
                        { opacity: 1, x: 0, duration: 0.5, delay: 0.1 }
                    );
                }
                updateProgressBar();
                if (stepIndex === quizQuestionsData.length - 1) {
                    nextStepBtn.innerText = 'Ver mi Nivel';
                } else {
                    nextStepBtn.innerText = 'Siguiente';
                }
            }

            function selectQuizOption(event) {
                const clickedButton = event.target.closest('.quiz-option-button');
                if (!clickedButton) return;

                const questionId = clickedButton.dataset.questionId;
                const value = clickedButton.dataset.value;

                document.querySelectorAll(`.quiz-option-button[data-question-id="${questionId}"]`).forEach(btn => {
                    btn.classList.remove('selected');
                });
                clickedButton.classList.add('selected');
                quizAnswers[questionId] = value;
            }

            function getCefrProfile(answers) {
                let score = 0;
                if (answers.grammar === 'find-attached') score += 3; else score += 1;
                if (answers.tense === 'had-started') score += 3; else score += 1;
                if (answers.vocab === 'discuss-later') score += 3; else score += 1;

                let level = '';
                let description = '';
                if (score <= 4) {
                    level = 'A1/A2';
                    description = 'Tus habilidades son fundamentales. Enfócate en la base gramatical y vocabulario esencial.';
                } else if (score <= 7) {
                    level = 'B1/B2';
                    description = 'Manejas conceptos intermedios. Podemos trabajar en fluidez y precisión en contextos profesionales.';
                } else {
                    level = 'C1/C2';
                    description = 'Posees un nivel avanzado. Nos enfocaremos en perfeccionar matices y vocabulario técnico especializado.';
                }
                return { level, description };
            }

            showStep(currentStep);

            nextStepBtn.addEventListener('click', () => {
                const currentQuestionDiv = quizQuestionsContainer.querySelector('.quiz-step.active');
                if (!currentQuestionDiv) return;

                const selectedOption = currentQuestionDiv.querySelector('.quiz-option-button.selected');
                if (currentStep < quizQuestionsData.length && !selectedOption) {
                    alert('Por favor, selecciona una opción.');
                    return;
                }

                if (selectedOption) {
                    quizAnswers[selectedOption.dataset.questionId] = selectedOption.dataset.value;
                }

                if (currentStep < quizQuestionsData.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                } else {
                    submitQuiz();
                }
            });

            quizQuestionsContainer.addEventListener('click', selectQuizOption);

            function submitQuiz() {
                const allAnswered = quizQuestionsData.every(q => quizAnswers.hasOwnProperty(q.id));
                if (!allAnswered) {
                    alert('Por favor, responde todas las preguntas.');
                    return;
                }

                const profile = getCefrProfile(quizAnswers);
                cefrLevelSpan.textContent = profile.level;
                cefrDescriptionP.textContent = profile.description;
                quizQuestionsContainer.classList.add('hidden');
                nextStepBtn.classList.add('hidden');
                quizResultDiv.classList.remove('hidden');
                quizResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            whatsappRedirectBtn.addEventListener('click', () => {
                const messageTextarea = document.getElementById('message');
                const level = cefrLevelSpan.innerText;
                const goalValue = quizAnswers.goal;
                const goal = goalValue ? goalValue : 'consultoría';

                messageTextarea.value = `Hola Javier Perez, hice el quiz y mi nivel estimado es ${level}. Me interesa la consultoría para ${goal}.`;
                scrollToSection('strategy-form-section');
                messageTextarea.focus();
            });

            if (strategySessionForm) {
                strategySessionForm.addEventListener('submit', async (event) => {
                    event.preventDefault();
                    const honeypot = document.getElementById('_gotcha').value;
                    if (honeypot) return;

                    const formData = new FormData(strategySessionForm);
                    formData.append('level', cefrLevelSpan.innerText || 'No realizado');
                    formData.append('goal', quizAnswers.goal || 'No especificado');

                    try {
                        const response = await fetch('https://formspree.io/f/xzdklrdv', {
                            method: 'POST',
                            body: formData,
                            headers: { 'Accept': 'application/json' }
                        });

                        if (response.ok) {
                            alert('¡Gracias! Tu solicitud ha sido enviada con éxito.');
                            strategySessionForm.reset();
                        } else {
                            throw new Error('Error al enviar el formulario.');
                        }
                    } catch (error) {
                        alert('Hubo un error al enviar el formulario. Por favor, intenta de nuevo más tarde.');
                    }
                });
            }

            const revealElements = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const children = entry.target.querySelectorAll('.fade-up, .delay-1, .delay-2, .delay-3, .card, .asymmetric-text');
                        entry.target.classList.add('active');
                        if (children.length > 0) {
                            children.forEach((child, index) => {
                                setTimeout(() => {
                                    child.classList.add('active');
                                    if (child.classList.contains('fade-up')) {
                                        child.style.opacity = '1';
                                        child.style.transform = 'translateY(0)';
                                    }
                                }, index * 150);
                            });
                        }
                    }
                });
            }, { threshold: 0.1 });
            revealElements.forEach(element => {
                revealObserver.observe(element);
            });

            const lenis = new Lenis();
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        };