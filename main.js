const btnKick1 = document.getElementById('btn-kick1');
const btnKick2 = document.getElementById('btn-kick2');
const $logs = document.getElementById('logs');
let isGameOver = false;

// --- ДОПОМІЖНІ ФУНКЦІЇ ---
function random(max, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLog(firstPerson, secondPerson, count) {
    const { name: firstName } = firstPerson;
    const { name: secondName, damageHP, defaultHP } = secondPerson;

    const logs = [
        `${firstName} згадав щось важливе, але зненацька ${secondName}, не пам'ятаючи себе від переляку, вдарив у передпліччя ворога.`,
        `${firstName} поперхнувся, і за це ${secondName} з переляку приклав прямий удар коліном у лоб ворога.`,
        `${firstName} забився, але в цей час нахабний ${secondName}, прийнявши вольове рішення, нечутно підійшовши ззаду, вдарив.`,
        `${firstName} прийшов до тями, але зненацька ${secondName} випадково наніс потужний удар.`,
        `${firstName} поперхнувся, але в цей час ${secondName} нехотя роздробив кулаком супротивника.`,
        `${firstName} здивувався, а ${secondName} похитнувшись вліпив підлий удар.`,
        `${firstName} висякався, але зненацька ${secondName} провів дроблячий удар.`,
        `${firstName} провів прийоми, і раптово нахабний ${secondName} безпричинно вдарив у ногу противника.`,
        `${firstName} засмутився, як раптом, зненацька ${secondName} випадково вліпив стопою в живіт суперника.`,
        `${firstName} намагався щось сказати, але раптом, зненацька ${secondName} зі нудьги, розбив бров супернику.`
    ];

    const randomText = logs[random(logs.length - 1)];
    return `${randomText} -${count}, [${damageHP}/${defaultHP}]`;
}

// --- КЛАСИ ---
class Selectors {
    constructor(selector) {
        this.elHP = document.getElementById(`health-${selector}`);
        this.elProgressbar = document.getElementById(`progressbar-${selector}`);
    }
}

class Pokemon extends Selectors {
    constructor({ name, defaultHP, selector }) {
        super(selector);
        this.name = name;
        this.defaultHP = defaultHP;
        this.damageHP = defaultHP;
        
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
        
        // Викликаємо колбек-функцію, якщо вона передана (для логів бою)
        if (cb) {
            cb(count);
        }
    }
}

// --- СТВОРЕННЯ ГЕРОЇВ (РЕФАКТОРИНГ) ---
const player1 = new Pokemon({
    name: 'Pikachu',
    defaultHP: 100,
    selector: 'character'
});

const player2 = new Pokemon({
    name: 'Charmander',
    defaultHP: 100,
    selector: 'enemy'
});

// --- ЛОГІКА БОЮ ---
function handleAttack(attacker, defender, dmg) {
    if (isGameOver) return;

    defender.changeHP(dmg, (count) => {
        const logText = generateLog(attacker, defender, count);
        const $p = document.createElement('p');
        $p.innerText = logText;
        $logs.insertBefore($p, $logs.children[0]);

        if (defender.damageHP === 0) {
            isGameOver = true;
            btnKick1.disabled = true;
            btnKick2.disabled = true;

            setTimeout(() => {
                alert(`${defender.name} програв бій!`);
            }, 300);
        }
    });
}

function performAttack(dmgToEnemy, dmgToCharacter) {
    handleAttack(player1, player2, dmgToEnemy);
    if (!isGameOver) {
        handleAttack(player2, player1, dmgToCharacter);
    }
}

// --- ОБРОБКА ЛІМІТІВ КНОПОК ---
function createClickCounter(limit, btn) {
    let clicksCount = 0;

    return function (actionCallback) {
        if (clicksCount >= limit) {
            console.log(`Кнопку "${btn.innerText.trim()}" більше не можна натискати`);
            return;
        }

        clicksCount++;
        const remainingClicks = limit - clicksCount;

        actionCallback();

        if (remainingClicks === 0) {
            btn.disabled = true;
        }
    };
}

const kick1Counter = createClickCounter(6, btnKick1);
const kick2Counter = createClickCounter(6, btnKick2);

btnKick1.addEventListener('click', function () {
    kick1Counter(() => {
        performAttack(random(20, 10), random(20, 10));
    });
});

btnKick2.addEventListener('click', function () {
    kick2Counter(() => {
        performAttack(random(40, 20), random(35, 15));
    });
});