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
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.add('hidden');
            steps[i].classList.remove('active');
        }
        const currentStepElement = document.getElementById(`quiz-step-${stepIndex + 1}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('hidden');
            currentStepElement.classList.add('active');
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

    // Quiz Initialization
    showStep(currentStep);

    // Global Event Listener for data-action
    document.addEventListener('click', (event) => {
        const target = event.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        switch (action) {
            case 'scroll-to':
                scrollToSection(target.dataset.target);
                break;
            case 'select-plan':
                selectPlan(target.dataset.plan);
                break;
            case 'scroll-to-quiz':
                scrollToSection('quiz-section');
                break;
            case 'scroll-to-strategy':
                scrollToSection('strategy-form-section');
                break;
            case 'scroll-to-methodology':
                scrollToSection('metodologia-section');
                break;
        }
    });

    // Quiz Navigation
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
