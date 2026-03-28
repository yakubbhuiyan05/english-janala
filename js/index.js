const createElements = (arr) => {
  const htmlElements = arr.map((el) => `<span class="btn">${el}</span>`);
  return htmlElements.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};
const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
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
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      // console.log(clickBtn);
      clickBtn.classList.add("active");
      displayLevelWord(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};
const displayWordDetails = (word) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
    <div class="text-2xl font-bold">
              <h2>${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
            </div>
            <div class="">
              <h2 class="font-bold">
                Meaning
              </h2>
              <p>${word.meaning}</p>
            </div>
            <div class="">
              <h2 class="font-bold">
                Example
              </h2>
              <p>${word.sentence}</p>
            </div>
            <div class="">
              <h2 class="font-bold">
                Synonym
              </h2>
              <div class="">${createElements(word.synonyms)}</div>
            </div>
  `;
  document.getElementById("word_modal").showModal();
};

// {
//     "id": 84,
//     "level": 1,
//     "word": "Fish",
//     "meaning": "মাছ",
//     "pronunciation": "ফিশ"
// }
// {
//   "status": true,
//   "message": "successfully fetched a word details",
//   "data": {
//     "word": "Brisk",
//     "meaning": "চটপটে / দ্রুত",
//     "pronunciation": "ব্রিস্ক",
//     "level": 3,
//     "sentence": "He took a brisk walk in the morning.",
//     "points": 3,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//       "quick",
//       "energetic"
//     ],
//     "id": 27
//   }
// }

const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = `
      <div
          class="text-center bg-sky-100 col-span-full rounded-xl py-10 space-y-6 font-bangla"
        >
        <img class="mx-auto" src="./assets/alert-error.png"/>
          <p class="text-xl font-medium text-gray-400">
            এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
    `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    console.log(word);
    const card = document.createElement("div");
    card.innerHTML = `
      <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
          <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
          <p class="font-medium">Meaning/Pronunciation</p>
          <div class="font-bangla font-semibold">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি।"}</div>
          <div class="flex justify-between items-center">
            <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
    `;
    wordContainer.append(card);
  });
  manageSpinner(false);
};
loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  // console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      // console.log(filterWords);
      displayLevelWord(filterWords);
    });
});
