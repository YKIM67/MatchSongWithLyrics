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
    const answerInput = document.getElementById('answer');
    
    let rankings = JSON.parse(localStorage.getItem('rankings')) || [];  // 점수 순위를 저장하기 위한 배열
    let songs = [];
    let currentSongIndex = 0;
    let score = 0;
    let timeLeft = 60;
    let timer;
    let consecutiveCorrect = 0; // 연속 정답 카운터

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
        shuffle(songs);
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
        const userAnswer = document.getElementById('answer').value.replace(/\s+/g, '').toLowerCase();
        if (userAnswer === songs[currentSongIndex].title || userAnswer === songs[currentSongIndex].title2) {
            score += 10 + consecutiveCorrect; // 연속 정답 카운터
            consecutiveCorrect++ 
            currentSongIndex++;
        } else {
            consecutiveCorrect = 0; // 연속 정답 카운터 초기화
            wrongAnswer();
        }
        
        // 조건과 상관없이 항상 실행되어야 하는 코드
        scoreElement.textContent = score;
        answer.value = ""; // 입력창 초기화
        displayLyrics();
    });

    // Enter 키로 정답 제출하기
    document.getElementById('answer').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            submitAnswerButton.click(); // Enter를 누르면 제출 버튼 클릭 동작 실행
        }
    });

    // 방향키로 건너뛰기 기능 추가
    document.addEventListener('keydown', (event) => {
        if (event.key === '`') {    // `로 변경
            event.preventDefault(); // 스페이스바의 기본 동작(스크롤)을 방지
            skipButton.click(); // 시프트바를 눌렀을 때 건너뛰기 버튼 클릭 동작 실행
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
        
        // 점수와 이름을 순위 배열에 추가
        rankings.push({ name: playerName, score: score });
  
        // 점수를 내림차순으로 정렬
        rankings.sort((a, b) => b.score - a.score);

        // 순위 리스트를 업데이트
        updateRankingList();

        // 로컬 저장소에 순위를 저장
        localStorage.setItem('rankings', JSON.stringify(rankings));
        // 순위 리스트에 추가 (간단한 순위 예시)
        // const listItem = document.createElement('li');
        // listItem.textContent = `${playerName}: ${score}점`;
        // document.getElementById('ranking-list').appendChild(listItem);

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
    // 정답제출시 오답일때 그래픽 효과
    function wrongAnswer() {
        answerInput.classList.add('blink');
        setTimeout(() => {
            answerInput.classList.remove('blink');
        }, 1000);  // 애니메이션이 끝난 후 클래스 제거
    }
    // 배열을 무작위로 섞기
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    // 순위 리스트 업데이트 함수
    function updateRankingList() {
        const rankingList = document.getElementById('ranking-list');
        rankingList.innerHTML = ''; // 기존 리스트를 초기화
  
        rankings.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${entry.name}: ${entry.score}점`;
            rankingList.appendChild(listItem);
        });

        // 페이지가 로드될 때 순위 리스트 업데이트
        document.addEventListener('DOMContentLoaded', () => {
        updateRankingList();
        });
    }
});
