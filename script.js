// Elementos del DOM
const screens = document.querySelectorAll('.screen');
const gradeBtns = document.querySelectorAll('.grade-btn');
const backBtns = document.querySelectorAll('.back-btn');
const celebrationScreen = document.getElementById('celebration-screen');
const celebrationText = document.getElementById('celebration-text');
const nextBtn = document.getElementById('next-btn');
const ttsToggleBtn = document.getElementById('tts-toggle');
const mascot = document.querySelector('.mascot-img');
const mascotSpeech = document.getElementById('mascot-speech');

// Variables globales de juego
let currentGrade = null;
let currentAnswer = null;
let currentAmount = 0;
let ttsEnabled = true;

// Lista de objetos del Mundial (Reemplaza a los objetos rurales)
const farmItems = ['⚽', '🥅', '🎫', '🏟️', '👟', '🏆', '🟨'];
const itemNames = {
    '⚽': 'Balones', '🥅': 'Porterías', '🎫': 'Boletos', 
    '🏟️': 'Estadios', '👟': 'Tenis', '🏆': 'Copas', '🟨': 'Tarjetas'
};

// Valores de monedas
const coinValues = [1, 2, 5, 10];

// Store items (Grade 3) Comida de estadio
const storeItems = [
    {emoji: '🥤', price: 10, name: 'Refresco'},
    {emoji: '🍿', price: 15, name: 'Palomitas'},
    {emoji: '🌭', price: 20, name: 'Hot Dog'},
    {emoji: '🍕', price: 25, name: 'Pizza'},
    {emoji: '🧢', price: 30, name: 'Gorra'},
    {emoji: '👕', price: 50, name: 'Camiseta'},
    {emoji: '🧣', price: 40, name: 'Bufanda'}
];

// Synth de voz
const synth = window.speechSynthesis;

function speak(text) {
    if (!ttsEnabled) return;
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    synth.speak(utterance);
}

// Toggle TTS
ttsToggleBtn.addEventListener('click', () => {
    ttsEnabled = !ttsEnabled;
    ttsToggleBtn.setAttribute('aria-pressed', ttsEnabled);
    ttsToggleBtn.textContent = `🔊 Lector de Voz: ${ttsEnabled ? 'ON' : 'OFF'}`;
    if (ttsEnabled) {
        speak('Lector de voz activado');
    } else {
        if (synth.speaking) synth.cancel();
    }
});

// Navegación
function showScreen(screenId) {
    screens.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-hidden', 'true');
    });
    const target = document.getElementById(screenId);
    target.classList.add('active');
    target.setAttribute('aria-hidden', 'false');
    
    // Anunciar el cambio de pantalla si TTS está activo
    if (screenId === 'main-menu') {
        speak('Menú principal del Mundial');
        mascotSay('¡A Jugar!');
    } else if (screenId === 'game-grade-1') {
        speak('A contar balones. Toca los objetos para contarlos.');
        mascotSay('¡Cuenta bien!');
    } else if (screenId === 'game-grade-2') {
        speak('Dinero para el boleto. ¿Qué valor tiene esta moneda?');
        mascotSay('¡Conoce el dinero!');
    } else if (screenId === 'game-grade-3') {
        speak('Comida del Estadio. Selecciona monedas para pagar el producto.');
        mascotSay('¡A comprar!');
    }
}

function mascotSay(text, duration = 3000) {
    mascotSpeech.textContent = text;
    mascotSpeech.classList.add('show');
    setTimeout(() => {
        mascotSpeech.classList.remove('show');
    }, duration);
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
    celebrationScreen.setAttribute('aria-hidden', 'true');
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
    celebrationScreen.setAttribute('aria-hidden', 'false');
    const celebrations = ["¡Golazo!", "¡Eres un Campeón!", "¡Tiro Libre Perfecto!", "¡Medalla de Oro!"];
    const text = celebrations[Math.floor(Math.random() * celebrations.length)];
    celebrationText.textContent = text;
    speak(text + " ¡Lo hiciste excelente!");
    
    // Animar mascota
    mascot.classList.remove('sad');
    mascot.classList.add('cheer');
    mascotSay('¡Siiiii!');
    setTimeout(() => mascot.classList.remove('cheer'), 600);
}

function playErrorSound() {
    speak('Intenta otra vez.');
    // Animar mascota triste
    mascot.classList.remove('cheer');
    mascot.classList.add('sad');
    mascotSay('¡Casi!');
    setTimeout(() => mascot.classList.remove('sad'), 500);
}

// GRADO 1: A Contar Balones
function generateGrade1() {
    const container = document.getElementById('g1-items-container');
    const optionsContainer = document.getElementById('g1-options-container');
    container.innerHTML = '';
    optionsContainer.innerHTML = '';
    
    const count = Math.floor(Math.random() * 10) + 1; // 1 a 10
    currentAnswer = count;
    const item = farmItems[Math.floor(Math.random() * farmItems.length)];
    const itemName = itemNames[item];
    
    // Accesibilidad visual/auditiva: decir qué contar
    container.setAttribute('aria-label', `Hay ${count} ${itemName} en pantalla.`);
    
    for (let i = 0; i < count; i++) {
        const div = document.createElement('div');
        div.className = 'item-emoji';
        div.textContent = item;
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Objeto número ${i+1}`);
        div.addEventListener('click', () => speak(`Contaste uno, llevas ${i+1}`));
        div.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                speak(`Contaste uno, llevas ${i+1}`);
            }
        });
        container.appendChild(div);
    }
    
    // Generar opciones
    let options = new Set([count]);
    while(options.size < 3) {
        options.add(Math.floor(Math.random() * 10) + 1);
    }
    options = Array.from(options).sort(() => Math.random() - 0.5);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.setAttribute('aria-label', `Opción ${opt}`);
        btn.addEventListener('click', () => checkAnswer(opt, count));
        optionsContainer.appendChild(btn);
    });
}

// GRADO 2: Las Monedas
function generateGrade2() {
    const display = document.getElementById('g2-coin-display');
    const optionsContainer = document.getElementById('g2-options-container');
    optionsContainer.innerHTML = '';
    
    const coin = coinValues[Math.floor(Math.random() * coinValues.length)];
    currentAnswer = coin;
    
    display.textContent = `$${coin}`;
    display.setAttribute('aria-label', `Moneda de ${coin} pesos`);
    
    let options = new Set([coin]);
    while(options.size < 3) {
        options.add(coinValues[Math.floor(Math.random() * coinValues.length)]);
    }
    options = Array.from(options).sort(() => Math.random() - 0.5);
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `$${opt}`;
        btn.setAttribute('aria-label', `Valor ${opt} pesos`);
        btn.addEventListener('click', () => checkAnswer(opt, coin));
        optionsContainer.appendChild(btn);
    });
}

// GRADO 3: La Tienda (Estadio)
function generateGrade3() {
    const productDisplay = document.getElementById('g3-product');
    const priceDisplay = document.getElementById('g3-price');
    const currentAmountDisplay = document.getElementById('g3-current-amount');
    
    const product = storeItems[Math.floor(Math.random() * storeItems.length)];
    currentAnswer = product.price;
    currentAmount = 0;
    
    productDisplay.textContent = product.emoji;
    productDisplay.setAttribute('aria-label', `Producto: ${product.name}`);
    priceDisplay.textContent = `$${product.price}`;
    currentAmountDisplay.textContent = '0';
    
    if(ttsEnabled) speak(`Comprar ${product.name}. Cuesta ${product.price} pesos.`);
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        showCelebration();
    } else {
        playErrorSound();
        const el = event.target;
        el.style.animation = 'shake 0.5s';
        setTimeout(() => el.style.animation = '', 500);
    }
}

// Eventos Grado 3
document.querySelectorAll('.btn-coin').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.dataset.val);
        currentAmount += val;
        document.getElementById('g3-current-amount').textContent = currentAmount;
        speak(`Agregaste ${val} pesos. Llevas ${currentAmount}`);
    });
});

document.getElementById('g3-clear').addEventListener('click', () => {
    currentAmount = 0;
    document.getElementById('g3-current-amount').textContent = currentAmount;
    speak('Limpiaste las monedas.');
});

document.getElementById('g3-buy').addEventListener('click', () => {
    if (currentAmount === currentAnswer) {
        showCelebration();
    } else {
        playErrorSound();
        speak(`Tienes ${currentAmount} pesos, pero cuesta ${currentAnswer} pesos.`);
    }
});
