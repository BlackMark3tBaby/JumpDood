document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    
    let doodlerLeftSpace = 50
    let startPoint = 150
    let doodlerBottomSpace = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    // START MUSIC
function playBackgroundMusic() {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play();
}

    // STOP MUSIC
function stopBackgroundMusic() {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.pause();
}


    //IT'S THE DOOD

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeftSpace = platforms[0].left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
        console.log(doodler)
    }

    //PLATFORMS

    class Platform {
        constructor(newPlatformBottom) {
            this.bottom = newPlatformBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')
            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i =0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatformBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatformBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 0) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score ++
                    console.log(platforms)
                    let newPlatform = new Platform(585)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    //JUMP & FALL

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        doodler.style.backgroundImage = "url(src/doodjump.png"
        upTimerId = setInterval(function() {
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace > startPoint + 200) {
                fall()
            }
        },30)
    } 

    function fall() {
        clearInterval(upTimerId) 
        isJumping = false
        doodler.style.backgroundImage = "url(src/dood.png"
        downTimerId = setInterval(function () {
            doodlerBottomSpace -= 5
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if (doodlerBottomSpace <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottomSpace >= platform.bottom) &&
                    (doodlerBottomSpace <= platform.bottom + 15) &&
                    ((doodlerLeftSpace + 60) >= platform.left)  &&
                    (doodlerLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottomSpace
                    jump()
                }
            })
        },25)
    }

    //GAME OVER

    function gameOver() {
        console.log('game over')
        isGameOver = true
        showStartButton();
        stopBackgroundMusic();
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    //MOVEMENT

    function control(e) {
        if (e.key === "ArrowLeft") {
        moveLeft()
        } else if (e.key === "ArrowRight") {
        moveRight()
        } else if (e.key === "ArrowUp") {
        moveStraight()
        }
        else if (e.code === "Space") {
            document.getElementById('start-button').click();
        }
    }

    function moveLeft() {
        if (isGoingLeft) return
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerLeftSpace >= 0) {
            doodlerLeftSpace -=5
            doodler.style.left = doodlerLeftSpace + 'px'
            } else moveRight()
        },20)
    }

    function moveRight() {
        if (isGoingRight) return
        if (isGoingLeft) {
            clearInterval(leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerId = setInterval(function() {
            if (doodlerLeftSpace <= 340) {
                doodlerLeftSpace += 5
                doodler.style.left = doodlerLeftSpace + 'px'
            } else moveLeft()
        },20)
    }

    function moveStraight() {
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
        isGoingRight = false
        isGoingLeft = false

    }

    //START

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()            
            setInterval(movePlatforms, 25)
            jump()
            document.addEventListener('keydown', control)
            playBackgroundMusic();
        }
    }

    //SHOW START BUTTON AFTER GAMEOVER
    function showStartButton() {
        document.getElementById('start-button').style.display = 'block'
    }

    // Attach event listeners to buttons
    document.getElementById('left-button').addEventListener('click', moveLeft);
    document.getElementById('right-button').addEventListener('click', moveRight);
    document.getElementById('up-button').addEventListener('click', moveStraight);
    document.getElementById('start-button').addEventListener('click', () => {
        window.location.reload();
    });

    //attach to button
    start()
})