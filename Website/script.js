const form = document.getElementById("practiceForm");
const feedback = document.getElementById("practiceFeedback");
const resetBtn = document.getElementById("practiceReset");

if (form && feedback && resetBtn) {

  const lessonPage = document.querySelector(".lesson-page");
  const lesson = lessonPage ? lessonPage.dataset.lesson : "";


  const answersByLesson = {
    division: { q1: "4",  q2: "9",  q3: "7r1" },
    addition: { q1: "45", q2: "50", q3: "33" }
  };


  const correct = answersByLesson[lesson];


  if (!correct) {
    feedback.textContent = "Lesson type not set (data-lesson missing).";
  }

  function normalise(text) {
    return text.toLowerCase().trim().replace(/\s+/g, "");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!correct) return;

    let score = 0;

    const q1 = normalise(document.getElementById("q1").value);
    const q2 = normalise(document.getElementById("q2").value);
    const q3 = normalise(document.getElementById("q3").value)
      .replace("remainder", "r")
      .replace("rem", "r");

    if (q1 === normalise(correct.q1)) score++;
    if (q2 === normalise(correct.q2)) score++;
    if (q3 === normalise(correct.q3)) score++;

    feedback.textContent = `Practice score: ${score}/3`;
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    feedback.textContent = "";
  });
}