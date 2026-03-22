const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson- ${lesson.level_no}</button>
    `;
    levelContainer.append(btnDiv);
  }
};

const loadLevelWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLevelWord(json.data));
};


// {
//     "id": 84,
//     "level": 1,
//     "word": "Fish",
//     "meaning": "মাছ",
//     "pronunciation": "ফিশ"
// }


const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  words.forEach((word) => {
    console.log(word)
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
          <h2 class="font-bold text-2xl">${word.word}</h2>
          <p class="font-medium">Meaning/Pronunciation</p>
          <div class="font-bangla font-semibold">${word.meaning} / ${word.pronunciation}</div>
          <div class="flex justify-between items-center">
            <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
            <button class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
    `;
    wordContainer.append(card);
  });
};
loadLevelWord();
loadLesson();
