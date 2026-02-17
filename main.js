let boss1Triggered = false
let boss2Triggered = false
let finalBossTriggered = false


const warningEl = document.querySelector('.warning')
const bossUI = document.querySelector('.boss-ui')
const bossHealthBar = document.querySelector('.boss-health')


let bossActive = false
let bossHealth = 20 


const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl = document.querySelector('.score span')
let score = 0

const sound = new Audio("assets/smash.mp3")
function getRank(score) {
    if (score < 200) return "Beginner"
    if (score < 400) return "Hunter"
    if (score < 700) return "Boss Slayer"
    if (score < 1000) return "Elite Destroyer"
    return "Mole God"
}
function run(){
    if (bossActive) return

   

    const i = Math.floor(Math.random() * holes.length)
    const hole = holes[i]
    let timer = null

    const img = document.createElement('img')
    img.classList.add('mole')
    img.src = 'assets/mole.jpg'

    img.addEventListener('click', () => {
        score += 10
        sound.play()
        scoreEl.textContent = score
        img.src = 'assets/mole-whacked.png'
        clearTimeout(timer)
        scoreEl.textContent = score
if (score >= 200 && !boss1Triggered) {
    boss1Triggered = true
    startBoss(20, 100, "first")
    return
}
if (score >= 400 && !boss2Triggered) {
    boss2Triggered = true
    startBoss(30, 200, "second")
    return
}
if (score >= 700 && !finalBossTriggered) {
    finalBossTriggered = true
    startBoss(50, 1000, "final")
    return
}

        setTimeout(() => {
            hole.removeChild(img)
            run()
        }, 500)
    })

    hole.appendChild(img)

    timer = setTimeout(() => {
        if (hole.contains(img)) hole.removeChild(img)
        run()
    }, 1500)
}

run()

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px'
    cursor.style.left = e.pageX + 'px'
})
window.addEventListener('mousedown', () => {
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
})

let bossMoveInterval = null
let minionInterval = null

function startBoss(healthAmount, reward, type) {
    

    bossActive = true
    bossHealth = healthAmount

    warningEl.textContent =
        type === "first" ? "⚠ FIRST BOSS ⚠" :
        type === "second" ? "😈 SECOND BOSS 😈" :
        "☠ FINAL BOSS ☠"

    warningEl.style.display = "block"

    setTimeout(() => {

        warningEl.style.display = "none"
        bossUI.style.display = "block"
        bossHealthBar.style.width = "100%"

        const boss = document.createElement('img');
boss.classList.add('board-boss');

if (type === "final") {
    boss.src = "assets/final-boss.png";
} else {
    boss.src = "assets/boss.jpg";
}

        document.querySelector('.board').appendChild(boss)

        if (type === "second") {
            bossMoveInterval = setInterval(() => {
                const randomHole = holes[Math.floor(Math.random() * holes.length)]
                randomHole.appendChild(boss)
            }, 1000)
        }

        if (type === "final") {
            document.body.classList.add("final-mode")
           
            if (type === "final") {
    boss.classList.add("final");
}


            minionInterval = setInterval(() => {
                const randomHole = holes[Math.floor(Math.random() * holes.length)]
                const minion = document.createElement('img')
                minion.src = "assets/mole.jpg"
                minion.classList.add("mole")

                minion.addEventListener('click', () => {
                    score -= 20
                    scoreEl.textContent = score
                    randomHole.removeChild(minion)
                })

                randomHole.appendChild(minion)

                setTimeout(() => {
                    if (randomHole.contains(minion))
                        randomHole.removeChild(minion)
                }, 800)

            }, 1200)
        }

       boss.addEventListener('click', () => {

    bossHealth--
    sound.play()

    bossHealthBar.style.width = (bossHealth / healthAmount * 100) + "%"

    if (bossHealth <= 0) {

    score += reward
    scoreEl.textContent = score

    clearInterval(bossMoveInterval)
    clearInterval(minionInterval)

    boss.remove()
    bossUI.style.display = "none"
    document.body.classList.remove("final-mode")

    bossActive = false

    if (type === "final") {
        endGame()
        return
    }

    run()
}

})

    }, 2000)
}
function endGame() {

    bossActive = true

    clearInterval(bossMoveInterval)
    clearInterval(minionInterval)

    alert(
        "Game Over!\nScore: " + score +
        "\nRank: " + getRank(score)
    )
}
