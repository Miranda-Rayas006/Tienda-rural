// Elementos del DOM
const screens = document.querySelectorAll('.screen');
const gradeBtns = document.querySelectorAll('.grade-btn');
const backBtns = document.querySelectorAll('.back-btn');
const celebrationScreen = document.getElementById('celebration-screen');
const nextBtn = document.getElementById('next-btn');

// Variables globales de juego
let currentGrade = null;
let currentAnswer = null;
let currentAmount = 0;

// Lista de objetos rurales
const farmItems = ['🌽', '🍅', '🍎', '🥚', '🥕', '🍊', '🌶️'];
// Valores de monedas
const coinValues = [1, 2, 5, 10];
// Store items (Grade 3) con sus precios relativos aproximados
const storeItems = [
    {emoji: '🥚', price: 3},
    {emoji: '🍅', price: 4},
    {emoji: '🌽', price: 5},
    {emoji: '🥕', price: 6},
    {emoji: '🍎', price: 8},
    {emoji: '🍊', price: 10},
    {emoji: '🥛', price: 15},
    {emoji: '🍞', price: 20}
];

// Synth de voz
const synth = window.speechSynthesis;

function speak(text) {
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    synth.speak(utterance);
}

// Navegación
function showScreen(screenId) {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

gradeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const grade = e.currentTarget.dataset.start;
        startGame(grade);
    });
});

backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen('main-menu');
        if (synth.speaking) synth.cancel();
    });
});

nextBtn.addEventListener('click', () => {
    celebrationScreen.classList.remove('active');
    loadLevel(currentGrade);
});

// Función Principal de Inicio
function startGame(grade) {
    currentGrade = parseInt(grade);
    showScreen(`game-grade-${currentGrade}`);
    loadLevel(currentGrade);
}

function loadLevel(grade) {
    if (grade === 1) generateGrade1();
    if (grade === 2) generateGrade2();
    if (grade === 3) generateGrade3();
}

function showCelebration() {
    celebrationScreen.classList.add('active');
    const celebrations = ["¡Muy bien!", "¡Excelente!", "¡Eres muy inteligente!", "¡Buen trabajo!"];
    const text = celebrations[Math.floor(Math.random() * celebrations.length)];
    speak(text);
}

function playError() {
    speak("Intenta de nuevo, tú puedes.");
}

// Lógica Grado 1 (Contar)
function generateGrade1() {
    const container = document.getElementById('g1-items-container');
    const optionsContainer = document.getElementById('g1-options-container');
    container.innerHTML = '';
    optionsContainer.innerHTML = '';

    const itemCount = Math.floor(Math.random() * 9) + 1; // 1 a 9 items
    currentAnswer = itemCount;
    const emoji = farmItems[Math.floor(Math.random() * farmItems.length)];

    speak(`¿Cuántos hay?`);

    for (let i = 0; i < itemCount; i++) {
        const el = document.createElement('div');
        el.className = 'item-icon';
        el.textContent = emoji;
        el.addEventListener('click', () => {
            speak(`Uno`); // Simula contar, podríamos refinarlo para que cuente 1,2,3
        });
        container.appendChild(el);
    }

    // Generar opciones (1 correcta, 2 incorrectas)
    let options = [itemCount];
    while(options.length < 3) {
        let wrong = Math.floor(Math.random() * 9) + 1;
        if (!options.includes(wrong) && wrong !== itemCount) {
            options.push(wrong);
        }
    }
    // Mezclar opciones
    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn primary number-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
            speak(`${opt}`);
            if(opt === currentAnswer) {
                setTimeout(showCelebration, 1000);
            } else {
                btn.style.animation = 'shake 0.5s';
                setTimeout(() => btn.style.animation = '', 500);
                playError();
            }
        });
        optionsContainer.appendChild(btn);
    });
}

// Lógica Grado 2 (Monedas)
function generateGrade2() {
    const coinDisplay = document.getElementById('g2-coin-display');
    const optionsContainer = document.getElementById('g2-options-container');
    coinDisplay.innerHTML = '';
    optionsContainer.innerHTML = '';

    const coinVal = coinValues[Math.floor(Math.random() * coinValues.length)];
    currentAnswer = coinVal;

    speak("¿De a cómo es esta moneda?");

    const coin = document.createElement('div');
    coin.className = 'coin-icon';
    coin.textContent = `$${coinVal}`;
    coinDisplay.appendChild(coin);

    let options = [coinVal];
    while(options.length < 3) {
        let wrong = coinValues[Math.floor(Math.random() * coinValues.length)];
        if (!options.includes(wrong)) {
            options.push(wrong);
        }
    }
    options.sort(() => Math.random() - 0.5);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn accent number-btn';
        btn.textContent = `$${opt}`;
        btn.addEventListener('click', () => {
            speak(`${opt} pesos`);
            if(opt === currentAnswer) {
                setTimeout(showCelebration, 1000);
            } else {
                btn.style.animation = 'shake 0.5s';
                setTimeout(() => btn.style.animation = '', 500);
                playError();
            }
        });
        optionsContainer.appendChild(btn);
    });
}

// Lógica Grado 3 (La Tiendita)
function generateGrade3() {
    const productEl = document.getElementById('g3-product');
    const priceEl = document.getElementById('g3-price');
    const walletCoins = document.querySelectorAll('.btn-coin');
    const clearBtn = document.getElementById('g3-clear');
    const buyBtn = document.getElementById('g3-buy');
    const amountSpan = document.getElementById('g3-current-amount');

    // Desvincular eventos viejos (clonando)
    clearBtn.replaceWith(clearBtn.cloneNode(true));
    buyBtn.replaceWith(buyBtn.cloneNode(true));

    const item = storeItems[Math.floor(Math.random() * storeItems.length)];
    currentAnswer = item.price;
    currentAmount = 0;

    productEl.textContent = item.emoji;
    priceEl.textContent = `$${item.price}`;
    amountSpan.textContent = currentAmount;

    speak(`Cuesta ${item.price} pesos.`);

    // Agregar eventos a las monedas
    // Removemos viejos eventos primero para no duplicar sumas
    const walletContainer = document.getElementById('g3-wallet');
    walletContainer.innerHTML = '';
    coinValues.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'coin btn-coin';
        btn.dataset.val = val;
        btn.textContent = `$${val}`;
        btn.addEventListener('click', () => {
            speak(`${val}`);
            currentAmount += val;
            document.getElementById('g3-current-amount').textContent = currentAmount;
        });
        walletContainer.appendChild(btn);
    });

    document.getElementById('g3-clear').addEventListener('click', () => {
        currentAmount = 0;
        document.getElementById('g3-current-amount').textContent = currentAmount;
        speak("Limpiando");
    });

    document.getElementById('g3-buy').addEventListener('click', () => {
        if(currentAmount >= currentAnswer) { // Allowing overpay for change logic or exactly
            let overpay = currentAmount - currentAnswer;
            if (overpay === 0) {
                 speak(`¡Exacto! Pagaste ${currentAmount} pesos.`);
            } else {
                 speak(`Pagaste ${currentAmount}. Tu cambio es de ${overpay} pesos.`);
            }
            setTimeout(showCelebration, 2500);
        } else {
            let lack = currentAnswer - currentAmount;
            document.getElementById('game-grade-3').style.animation = 'shake 0.5s';
            setTimeout(() => document.getElementById('game-grade-3').style.animation = '', 500);
            speak(`Faltan ${lack} pesos.`);
        }
    });
}
