document.addEventListener("DOMContentLoaded", function () {
  let currentTab = "part1";
  let filteredPart1 = [...part1Data];
  let filteredPart2 = [...part2Data];

  const part1Container = document.getElementById("part1Container");
  const part2Container = document.getElementById("part2Container");
  const searchNumInput = document.getElementById("searchNum");
  const searchWordInput = document.getElementById("searchWord");
  const resetBtn = document.getElementById("resetBtn");
  const statsLine = document.getElementById("statsLine");
  const tabBtns = document.querySelectorAll(".tab-btn");

  // Функция для замены \n на <br>
  function formatAnswer(text) {
    if (!text) return "";
    return text.replace(/\n/g, "<br>");
  }

  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    );
    return text.replace(regex, `<mark>$1</mark>`);
  }

  function render() {
    const numQuery = searchNumInput.value.trim();
    const wordQuery = searchWordInput.value.trim().toLowerCase();
    const isNumSearch = numQuery !== "";
    const isWordSearch = wordQuery !== "";

    let part1Render = [...part1Data];
    let part2Render = [...part2Data];

    if (isNumSearch) {
      const num = parseInt(numQuery, 10);
      if (!isNaN(num)) {
        part1Render = part1Render.filter((q) => q.num === num);
        part2Render = part2Render.filter((q) => q.num === num);
      } else {
        part1Render = [];
        part2Render = [];
      }
    }

    if (isWordSearch) {
      part1Render = part1Render.filter((q) =>
        q.question.toLowerCase().includes(wordQuery),
      );
      part2Render = part2Render.filter((q) =>
        q.question.toLowerCase().includes(wordQuery),
      );
    }

    filteredPart1 = part1Render;
    filteredPart2 = part2Render;

    // Рендер части 1
    if (filteredPart1.length === 0) {
      part1Container.innerHTML =
        '<div class="no-results">❌ Ничего не найдено (часть 1)</div>';
    } else {
      part1Container.innerHTML = filteredPart1
        .map(
          (q) => `
                <div class="question-card">
                    <div class="q-num">Вопрос №${q.num}</div>
                    <div class="q-text">${highlightText(q.question, wordQuery)}</div>
                    <div class="answer">${formatAnswer(q.answer)}</div>
                </div>
            `,
        )
        .join("");
    }

    // Рендер части 2
    if (filteredPart2.length === 0) {
      part2Container.innerHTML =
        '<div class="no-results">❌ Ничего не найдено (часть 2)</div>';
    } else {
      part2Container.innerHTML = filteredPart2
        .map(
          (q) => `
                <div class="question-card">
                    <div class="q-num">Вопрос №${q.num}</div>
                    <div class="q-text">${highlightText(q.question, wordQuery)}</div>
                    <div class="answer">${formatAnswer(q.answer)}</div>
                </div>
            `,
        )
        .join("");
    }

    const total =
      currentTab === "part1" ? filteredPart1.length : filteredPart2.length;
    const totalAll =
      currentTab === "part1" ? part1Data.length : part2Data.length;
    statsLine.innerHTML = `📌 Показано ${total} из ${totalAll} вопросов (часть ${currentTab === "part1" ? "1" : "2"})`;
  }

  function switchTab(tabId) {
    currentTab = tabId;
    if (tabId === "part1") {
      part1Container.style.display = "flex";
      part2Container.style.display = "none";
    } else {
      part1Container.style.display = "none";
      part2Container.style.display = "flex";
    }
    tabBtns.forEach((btn) => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    render();
  }

  function resetFilters() {
    searchNumInput.value = "";
    searchWordInput.value = "";
    render();
  }

  searchNumInput.addEventListener("input", render);
  searchWordInput.addEventListener("input", render);
  resetBtn.addEventListener("click", resetFilters);
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  render();
});
