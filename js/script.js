document.addEventListener('DOMContentLoaded', () => {
    const yearSelectionPage = document.getElementById('year-selection-page');
    const gamePage = document.getElementById('game-page');
    const resultPage = document.getElementById('result-page');
    const rankingPage = document.getElementById('ranking-page');
    const lyricsElement = document.getElementById('lyrics');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const finalScoreElement = document.getElementById('final-score');
    const submitAnswerButton = document.getElementById('submit-answer');
    const skipButton = document.getElementById('skip');
    
    let songs = [];
    let currentSongIndex = 0;
    let score = 0;
    let timeLeft = 20;
    let timer;

    // 페이지 초기 상태 설정 (년도 선택 페이지만 보이도록)
    yearSelectionPage.classList.add('active');
    gamePage.classList.remove('active');  // 게임 페이지 숨김
    resultPage.classList.remove('active');  // 결과 페이지 숨김
    rankingPage.classList.remove('active');  // 순위 페이지 숨김

    // 노래 데이터를 JSON에서 불러오기
    function loadSongs(year) {
        fetch(`data/songs-${year}.json`)
            .then(response => response.json())
            .then(data => {
                songs = data;
                startGame();
            })
            .catch(error => console.error('노래 데이터를 불러오는 중 오류:', error));
    }

    // 게임 시작
    function startGame() {
        yearSelectionPage.classList.remove('active');  // 년도 선택 페이지 숨김
        gamePage.classList.add('active');  // 게임 페이지 표시
        displayLyrics();
        startTimer();
    }

    // 타이머 시작
    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft === 0) {
                endGame();
            }
        }, 1000);
    }

    // 노래 가사 표시
    function displayLyrics() {
        if (currentSongIndex < songs.length) {
            lyricsElement.textContent = songs[currentSongIndex].lyrics;
        } else {
            endGame();
        }
    }

    // 정답 제출 버튼 클릭
    submitAnswerButton.addEventListener('click', () => {
        const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
        if (userAnswer === songs[currentSongIndex].title.toLowerCase()) {
            score += 10;
            currentSongIndex++;
        }
        scoreElement.textContent = score;
        document.getElementById('answer').value = ""; // 입력창 초기화
        displayLyrics();
    });

    // Enter 키로 정답 제출하기
    document.getElementById('answer').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitAnswerButton.click(); // Enter를 누르면 제출 버튼 클릭 동작 실행
        }
    });

    // 스페이스바로 건너뛰기 기능 추가
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            event.preventDefault(); // 스페이스바의 기본 동작(스크롤)을 방지
            skipButton.click(); // 스페이스바를 눌렀을 때 건너뛰기 버튼 클릭 동작 실행
        }
    });

    // 건너뛰기 버튼 클릭
    skipButton.addEventListener('click', () => {
        currentSongIndex++;
        document.getElementById('answer').value = ""; // 입력창 초기화
        displayLyrics();
    });

    // 게임 종료
    function endGame() {
        clearInterval(timer);
        gamePage.classList.remove('active');  // 게임 페이지 숨김
        resultPage.classList.add('active');  // 결과 페이지 표시
        finalScoreElement.textContent = score;
    }

    // 점수 제출
    document.getElementById('submit-score').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value;
        if (!playerName) {
            alert('이름을 입력하세요.');
            return;
        }

        // 순위 리스트에 추가 (간단한 순위 예시)
        const listItem = document.createElement('li');
        listItem.textContent = `${playerName}: ${score}점`;
        document.getElementById('ranking-list').appendChild(listItem);

        resultPage.classList.remove('active');
        rankingPage.classList.add('active');
    });

    // 처음으로 돌아가기
    document.getElementById('go-home').addEventListener('click', () => {
        location.reload(); // 페이지 새로고침
    });

    // 게임 시작 버튼 클릭
    document.getElementById('start-game').addEventListener('click', () => {
        const selectedYear = document.getElementById('year-select').value;
        loadSongs(selectedYear);
    });
});
