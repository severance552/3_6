// --- ДАНІ ПОКЕМОНІВ (З новими локальними зображеннями в assets) ---
const pokemons = [
    { 
        name: 'Pikachu', 
        type: 'electric', 
        hp: 274, 
        img: './assets/pikachu.png', 
        attacks: [
            { name: "thunder jolt", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "electro ball", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "volt tackle", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "thunder crack", maxDamage: 160, minDamage: 130, maxCount: 2 }
        ] 
    },
    { 
        name: 'Charmander', 
        type: 'fire', 
        hp: 282, 
        img: './assets/charmander.png', 
        attacks: [
            { name: "ember", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "flamethrower", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "burning tail", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "fire spin", maxDamage: 130, minDamage: 110, maxCount: 2 }
        ] 
    },
    { 
        name: 'Bulbasaur', 
        type: 'grass', 
        hp: 294, 
        img: './assets/bulbasaur.png', 
        attacks: [
            { name: "tackle", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "vine whip", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "razor leaf", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "solar beam", maxDamage: 130, minDamage: 110, maxCount: 2 }
        ] 
    },
    { 
        name: 'Squirtle', 
        type: 'water', 
        hp: 292, 
        img: './assets/squirtle.png', 
        attacks: [
            { name: "bubble", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "water gun", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "shell attack", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "hydro pump", maxDamage: 130, minDamage: 110, maxCount: 2 }
        ] 
    },
    { 
        name: 'Pidgey', 
        type: 'air', 
        hp: 284, 
        img: './assets/pidgey.png', 
        attacks: [
            { name: "Air Slash", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "Razor Wind", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "Heat Wave", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "Sky Attack", maxDamage: 130, minDamage: 110, maxCount: 2 }
        ] 
    },
    { 
        name: 'Mew', 
        type: 'psychic', 
        hp: 404, 
        img: './assets/mew.png', 
        attacks: [
            { name: "Pound", maxDamage: 40, minDamage: 20, maxCount: 100 }, 
            { name: "Ancient Power", maxDamage: 60, minDamage: 45, maxCount: 6 }, 
            { name: "Aura Sphere", maxDamage: 75, minDamage: 60, maxCount: 4 }, 
            { name: "Psychic", maxDamage: 130, minDamage: 110, maxCount: 2 }
        ] 
    }
];

// --- ДОПОМІЖНІ ФУНКЦІЇ ---
function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPokemon() {
    const randomIndex = random(pokemons.length - 1);
    return pokemons[randomIndex];
}

function generateLog(firstPerson, secondPerson, count) {
    const logs = [
        `${firstPerson.name} згадав щось важливе, але зненацька ${secondPerson.name}, не пам'ятаючи себе від переляку, вдарив у передпліччя ворога.`,
        `${firstPerson.name} поперхнувся, і за це ${secondPerson.name} з переляку приклав прямий удар коліном у лоб ворога.`,
        `${firstPerson.name} забився, але в цей час нахабний ${secondPerson.name}, прийнявши вольове рішення, нечутно підійшовши ззаду, вдарив.`,
        `${firstPerson.name} прийшов до тями, але зненацька ${secondPerson.name} випадково наніс потужний удар.`,
        `${firstPerson.name} поперхнувся, але в цей час ${secondPerson.name} нехотя роздробив кулаком супротивника.`
    ];
    return `${logs[random(logs.length - 1)]} -${count}, [${secondPerson.damageHP}/${secondPerson.defaultHP}]`;
}

// --- КЛАСИ ---
class Selectors {
    constructor(selector) {
        this.elHP = document.getElementById(`health-${selector}`);
        this.elProgressbar = document.getElementById(`progressbar-${selector}`);
        this.elImg = document.getElementById(`img-${selector}`);
        this.elName = document.getElementById(`name-${selector}`);
    }
}

class Pokemon extends Selectors {
    constructor({ name, hp, type, selectors, attacks = [], img }) {
        super(selectors);
        this.name = name;
        this.defaultHP = hp;
        this.damageHP = hp;
        this.type = type;
        this.attacks = attacks;
        this.img = img;

        this.init();
    }

    init() {
        this.elName.innerText = this.name;
        this.elImg.src = this.img;
        this.renderHP();
    }

    renderHPLife = () => {
        this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
    }

    renderProgressbarHP = () => {
        const percent = (this.damageHP / this.defaultHP) * 100;
        this.elProgressbar.style.width = `${percent}%`;
        this.elProgressbar.classList.remove('low', 'critical');

        if (percent < 20) {
            this.elProgressbar.classList.add('critical');
        } else if (percent < 60) {
            this.elProgressbar.classList.add('low');
        }
    }

    renderHP = () => {
        this.renderHPLife();
        this.renderProgressbarHP();
    }

    changeHP = (count, cb) => {
        this.damageHP -= count;
        if (this.damageHP <= 0) {
            this.damageHP = 0;
        }
        this.renderHP();
        if (cb) cb(count);
    }
}

// --- ГОЛОВНА ЛОГІКА ---
const $control = document.querySelector('.control');
const $logs = document.getElementById('logs');
let player1;
let player2;
let isGameOver = false;

function initGame() {
    isGameOver = false;
    $control.innerHTML = ''; 
    $logs.innerHTML = ''; 

    // Створюємо головного гравця та суперника випадковим чином за допомогою spread оператора
    player1 = new Pokemon({
        ...getRandomPokemon(),
        selectors: 'player1'
    });

    player2 = new Pokemon({
        ...getRandomPokemon(),
        selectors: 'player2'
    });

    // Динамічно створюємо кнопки атак для нашого покемона
    player1.attacks.forEach(item => {
        const $btn = document.createElement('button');
        $btn.classList.add('button');
        $btn.innerText = `${item.name} (${item.maxCount})`;
        
        const btnCounter = createClickCounter(item.maxCount, $btn, item.name);

        $btn.addEventListener('click', () => {
            if (isGameOver) return;
            
            btnCounter(() => {
                // Атака нашого покемона по ворогу
                const dmgToEnemy = random(item.maxDamage, item.minDamage);
                
                // Ворог завжди відповідає першим ударом із власного списку доступних атак
                const enemyAttack = player2.attacks[0];
                const dmgToCharacter = random(enemyAttack.maxDamage, enemyAttack.minDamage);

                performAttack(dmgToEnemy, dmgToCharacter);
            });
        });

        $control.appendChild($btn);
    });
}

function performAttack(dmgToEnemy, dmgToCharacter) {
    player2.changeHP(dmgToEnemy, (count) => {
        logAttack(player1, player2, count);
    });

    if (player2.damageHP === 0) {
        endGame(player1, player2);
        return;
    }

    player1.changeHP(dmgToCharacter, (count) => {
        logAttack(player2, player1, count);
    });

    if (player1.damageHP === 0) {
        endGame(player2, player1);
    }
}

function logAttack(attacker, defender, count) {
    const logText = generateLog(attacker, defender, count);
    const $p = document.createElement('p');
    $p.innerText = logText;
    $logs.insertBefore($p, $logs.children[0]);
}

function endGame(winner, loser) {
    isGameOver = true;
    const buttons = document.querySelectorAll('.control .button');
    buttons.forEach(btn => btn.disabled = true);
    
    setTimeout(() => {
        alert(`Бій завершено! ${loser.name} програв.`);
        
        // Створюємо кнопку швидкого перезапуску після програшу/перемоги
        $control.innerHTML = '';
        const $resetBtn = document.createElement('button');
        $resetBtn.classList.add('button');
        $resetBtn.innerText = 'Restart Game';
        $resetBtn.addEventListener('click', initGame);
        $control.appendChild($resetBtn);
    }, 500);
}

// Замикання для підрахунку лімітів натискання з оновленням тексту на самій кнопці
function createClickCounter(limit, btnElement, attackName) {
    let clicksCount = 0;

    return function (actionCallback) {
        if (clicksCount >= limit) return;

        clicksCount++;
        const remaining = limit - clicksCount;
        
        btnElement.innerText = `${attackName} (${remaining})`;

        actionCallback();

        if (remaining === 0) {
            btnElement.disabled = true;
        }
    };
}

// Перший запуск гри
initGame();