const form = document.getElementById("practiceForm");
const feedback = document.getElementById("practiceFeedback");
const resetBtn = document.getElementById("practiceReset");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  let score = 0;

  const q1 = document.getElementById("q1").value;
  const q2 = document.getElementById("q2").value;
  const q3 = document.getElementById("q3").value;

  if (q1 == 4) {
    score++;
  }

  if (q2 == 9) {
    score++;
  }

  if (q3 == "7 r 1") {
    score++;
  }

  feedback.textContent = "Practice score: " + score + "/3";
});


resetBtn.addEventListener("click", function() {
  form.reset();               
  feedback.textContent = "";  
});