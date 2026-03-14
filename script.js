document.addEventListener("DOMContentLoaded", () => {

  // Practice Quiz on Lessons Pages
  const form = document.getElementById("practiceForm");
  const resetBtn = document.getElementById("practiceReset");
  const scoreDisplay = document.getElementById("scoreDisplay");

  if (form && scoreDisplay && resetBtn) {
    const answersByLesson = {
      addition: { q1: "45", q2: "50", q3: "33" },
      subtraction: { q1: "7", q2: "36", q3: "115" },
      multiplication: { q1: "36", q2: "156", q3: "990" },
      division: { q1: "4", q2: "9", q3: "7r1" }
    };

    const lessonPage = document.querySelector(".lesson-page");
    const lesson = lessonPage ? lessonPage.dataset.lesson : null;

    if (!lesson || !answersByLesson[lesson]) {
      scoreDisplay.textContent = "Lesson type not set or invalid!";
    }

    const correctAnswers = answersByLesson[lesson];

    function normalize(text) {
      return text.toLowerCase().trim()
                 .replace(/\s+/g, "")
                 .replace("remainder", "r")
                 .replace("rem", "r");
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault(); 
      if (!correctAnswers) return;

      let score = 0;
      ["q1", "q2", "q3"].forEach(id => {
        const userAnswer = normalize(document.getElementById(id).value);
        const correct = normalize(correctAnswers[id]);
        if (userAnswer === correct) score++;
      });

      scoreDisplay.innerHTML = `You scored <strong>${score}/3</strong>`;
    });

    resetBtn.addEventListener("click", () => {
      form.reset();
      scoreDisplay.innerHTML = `You scored <strong>0/3</strong>`;
    });
  }

  // Lessons Page Dropdown Buttons
  const buttons = document.querySelectorAll(".level-btn");
  const dropdowns = document.querySelectorAll(".lesson-dropdown");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const target = button.dataset.target;

      dropdowns.forEach(d => d.classList.remove("show"));
      buttons.forEach(b => b.classList.remove("active"));

      document.getElementById(target).classList.add("show");
      button.classList.add("active");
    });
  });

  // Scrolling Reviews Script
  let reviews = [];
  let index = 0;
  let turn = 0;
  const cards = document.querySelectorAll(".review-card");

  if (cards.length > 0) {
    fetch("reviews.json")
      .then(res => res.json())
      .then(data => {
        reviews = data.reviews;
        if (reviews.length >= 2) showInitial();
        setInterval(updateReviews, 3000);
      });
  }

  function showInitial() {
    cards[0].innerHTML = `<div class="review-content">${formatReview(reviews[0])}</div>`;
    cards[1].innerHTML = `<div class="review-content">${formatReview(reviews[1])}</div>`;
    index = 2;
  }

  function updateReviews() {
    const currentCard = cards[turn];
    const content = currentCard.querySelector(".review-content");
    content.style.transform = "translateX(-100%)";
    content.style.opacity = "0";

    setTimeout(() => {
      currentCard.innerHTML = `<div class="review-content" style="transform: translateX(100%); opacity:0;">${formatReview(reviews[index])}</div>`;
      const newContent = currentCard.querySelector(".review-content");
      setTimeout(() => {
        newContent.style.transform = "translateX(0)";
        newContent.style.opacity = "1";
      }, 50);
      turn = 1 - turn;
      index = (index + 1) % reviews.length;
    }, 500);
  }

  function formatReview(review) {
    return `
      "${review.text}"<br><br>
      ${review.stars}<br>
      <strong>${review.student}</strong>
    `;
  }

  //Quizzes page Quiz and Leaderboard
  const embedContainer = document.getElementById("multiQuizEmbed");
  if(!embedContainer) return;

  embedContainer.innerHTML = `
    <div class="quiz-card" id="quizCardContainer">
      <h2>Multi-Topic Maths Quiz</h2>
      <p>Complete the quiz across all topics and see if you can earn Gold, Silver, or Bronze!</p>
      <div id="quizCard"></div>
    </div>

    <div class="your-score" id="yourScoreBox">
      <h3>Your Score</h3>
      <p>Complete the quiz to see your score.</p>
    </div>

    <div class="leaderboard" id="leaderboard">
      <h3>Top 5 Leaderboard</h3>
      <div class="lb-entries"></div>
    </div>
  `;

  const quizCard = document.getElementById("quizCard");
  const yourScoreBox = document.getElementById("yourScoreBox");
  const leaderboardDiv = document.getElementById("leaderboard").querySelector(".lb-entries");

  let leaderboard = JSON.parse(localStorage.getItem("multiQuizLeaderboard")) || [];

  const quizData = [
    { topic: "Addition", questions: [
        {q:"12 + 5 = ", a:"17"}, {q:"23 + 17 = ", a:"40"}, {q:"56 + 44 = ", a:"100"}, {q:"120 + 35 = ", a:"155"}, {q:"87 + 59 = ", a:"146"} ]},
    { topic: "Subtraction", questions: [
        {q:"15 - 7 = ", a:"8"}, {q:"50 - 23 = ", a:"27"}, {q:"100 - 55 = ", a:"45"}, {q:"200 - 78 = ", a:"122"}, {q:"89 - 34 = ", a:"55"} ]},
    { topic: "Multiplication", questions: [
        {q:"4 x 6 = ", a:"24"}, {q:"7 x 8 = ", a:"56"}, {q:"9 x 12 = ", a:"108"}, {q:"5 x 15 = ", a:"75"}, {q:"11 x 11 = ", a:"121"} ]},
    { topic: "Division", questions: [
        {q:"12 ÷ 4 = ", a:"3"}, {q:"56 ÷ 7 = ", a:"8"}, {q:"144 ÷ 12 = ", a:"12"}, {q:"81 ÷ 9 = ", a:"9"}, {q:"100 ÷ 25 = ", a:"4"} ]}
  ];

  let currentStep = 0;
  let totalScore = 0;

  function renderStep() {
    const topicData = quizData[currentStep];
    quizCard.innerHTML = `
      <h3>${topicData.topic} Quiz</h3>
      <form id="stepForm">
        <ol class="practice-list">
          ${topicData.questions.map((q,i)=> `<li><label>${q.q}</label><input type="text" data-index="${i}" required></li>`).join("")}
        </ol>
        <div class="practice-actions">
          <button type="submit" class="btn btn-primary">${currentStep < quizData.length-1 ? 'Next' : 'Submit'}</button>
        </div>
      </form>
    `;
    document.getElementById("stepForm").addEventListener("submit", handleStepSubmit);
  }

  function handleStepSubmit(e){
    e.preventDefault();
    const inputs = Array.from(e.target.querySelectorAll("input"));
    const topicData = quizData[currentStep];

    inputs.forEach(input=>{
      const i = parseInt(input.dataset.index);
      if(input.value.trim() === topicData.questions[i].a) totalScore++;
    });

    currentStep++;
    if(currentStep < quizData.length){
      renderStep();
    } else {
      showFinalScore();
    }
  }

  function showFinalScore(){
    quizCard.innerHTML = `
      <h3>Quiz Complete!</h3>
      <p>You scored ${totalScore} / ${quizData.length*5}</p>
      <label>Enter your username:</label>
      <input type="text" id="finalUsername" placeholder="Your name">
      <div class="practice-actions">
        <button id="submitScore" class="btn btn-success">Submit Score</button>
      </div>
    `;

  document.getElementById("submitScore").addEventListener("click", function(){
  const username = document.getElementById("finalUsername").value.trim() || "Anonymous";

  // Add user to leaderboard
  leaderboard.push({username, score: totalScore, time: Date.now()});
  leaderboard.sort((a,b)=> b.score - a.score || a.time - b.time);
  leaderboard = leaderboard.slice(0,5); // keep top 5
  localStorage.setItem("multiQuizLeaderboard", JSON.stringify(leaderboard));
  updateLeaderboard();

  // Determine user's position
  const userIndex = leaderboard.findIndex(entry => entry.username === username && entry.score === totalScore);

  let medalClass = '';
  let medalText = '';
  if(userIndex === 0){ medalClass = 'gold'; medalText = 'Gold'; }
  else if(userIndex === 1){ medalClass = 'silver'; medalText = 'Silver'; }
  else if(userIndex === 2){ medalClass = 'bronze'; medalText = 'Bronze'; }

  yourScoreBox.innerHTML = `<h3>Your Score</h3>
    <div class="lb-row">
      <span>${username}</span>
      <span>${totalScore} / ${quizData.length*5}</span>
      ${medalText ? `<span class="score-medal ${medalClass}">${medalText}</span>` : ''}
    </div>`;

  quizCard.innerHTML = "<p>Score submitted! See your result above.</p>";
    });
  }

  function updateLeaderboard(){
  leaderboardDiv.innerHTML = ''; 

  leaderboard.forEach((entry, index) => {
    const div = document.createElement("div");
    div.classList.add("lb-row");

    let medalClass = '';
    let medalText = '';
    if(index === 0){ medalClass = 'gold'; medalText = 'Gold'; }
    else if(index === 1){ medalClass = 'silver'; medalText = 'Silver'; }
    else if(index === 2){ medalClass = 'bronze'; medalText = 'Bronze'; }

    div.innerHTML = `
      <span>${entry.username}</span>
      <span>${entry.score}</span>
      ${medalText ? `<span class="score-medal ${medalClass}">${medalText}</span>` : ''}
    `;
    leaderboardDiv.appendChild(div);
  });
}

  renderStep();
  updateLeaderboard();

});

