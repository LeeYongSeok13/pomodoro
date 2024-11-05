window.addEventListener("load", async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate() - 1;
  const lastDay = new Date(year, month, 0).getDate();
  // const day = today.getDay();
  // const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  // const dayName = dayNames[day];
  // const lastdays = [];
  let currentIndex = 0;

  const plusDays = document.querySelector(".plusDays");
  const minusDays = document.querySelector(".minusDays");
  const plusmonth = document.querySelector(".plusmonth");
  const minusmonth = document.querySelector(".minusmonth");
  const monthSpan = document.querySelector("#month");
  const yearSpan = document.querySelector("#year");
  const dayList = document.querySelector(".dayList");
  const dayItem = document.querySelectorAll(`.dayList > li`);
  const addTodo = document.querySelector(".addTodo");
  const addList = document.querySelector(".addList");
  const addListClose = document.querySelector(".addListClose");
  const addListButton = document.querySelector(".addListButton");
  const todoform = document.forms["todoform"];

  dayItem[date].classList.add("today");
  let currentMonth = +monthSpan.innerHTML.split("월").join("");
  let currentYear = +yearSpan.innerHTML.split("년").join("");
  // 첫 로딩시 현재 날짜로 이동
  for (let i = date; i >= 0; i--) {
    if (i % 4 === 0) {
      currentIndex = i;
      break;
    }
  }
  dayList.style.transform = `translateX(-${currentIndex * 20}vw)`;
  todayClick();

  plusDays.addEventListener("click", () => {
    console.log(currentIndex, currentMonth);
    if (currentIndex >= lastDay - 4) return;
    if (currentIndex >= 24 && currentMonth === 2) return;
    currentIndex += 4;
    dayList.style.transform = `translateX(-${currentIndex * 20}vw)`;
  });

  minusDays.addEventListener("click", () => {
    if (currentIndex <= 0) return;
    currentIndex -= 4;
    dayList.style.transform = `translateX(-${currentIndex * 20}vw)`;
  });

  plusmonth.addEventListener("click", async () => {
    if (currentMonth >= 12) {
      currentMonth = 1;
      monthSpan.innerHTML = `1월`;
      yearSpan.innerHTML = `${++currentYear}년`;
    } else {
      monthSpan.innerHTML = `${++currentMonth}월`;
    }

    const { data } = await axios({
      method: "GET",
      url: `calender/${currentMonth}/${currentYear}`,
    });

    dayList.innerHTML = "";

    for (let day = 1; day <= data.lastDay; day++) {
      const li = document.createElement("li");
      const spanDay = document.createElement("span");
      const spanDate = document.createElement("span");
      spanDay.innerHTML = data.dayNames[(data.firstDayOfMonth + day - 1) % 7];
      spanDay.classList.add("day");
      spanDate.innerHTML = `${day}`;
      spanDate.classList.add("date");
      li.appendChild(spanDay);
      li.appendChild(spanDate);
      dayList.appendChild(li); // 각 날짜 추가
    }
    todayClick();
  });

  minusmonth.addEventListener("click", async () => {
    if (currentIndex >= 28 && currentMonth === 3) {
      currentIndex = 24;
      dayList.style.transform = `translateX(-${currentIndex * 20}vw)`;
    }
    if (currentMonth <= 1) {
      currentMonth = 12;

      monthSpan.innerHTML = `12월`;
      yearSpan.innerHTML = `${--currentYear}년`;
    } else {
      monthSpan.innerHTML = `${--currentMonth}월`;
    }

    const { data } = await axios({
      method: "GET",
      url: `calender/${currentMonth}/${currentYear}`,
    });

    dayList.innerHTML = "";

    for (let day = 1; day <= data.lastDay; day++) {
      const li = document.createElement("li");
      const spanDay = document.createElement("span");
      const spanDate = document.createElement("span");
      spanDay.innerHTML = data.dayNames[(data.firstDayOfMonth + day - 1) % 7];
      spanDay.classList.add("day");
      spanDate.innerHTML = `${day}`;
      spanDate.classList.add("date");
      li.appendChild(spanDay);
      li.appendChild(spanDate);
      dayList.appendChild(li); // 각 날짜 추가
    }
    todayClick();
  });

  function todayClick() {
    const dayItem = document.querySelectorAll(`.dayList > li`);
    dayItem.forEach((item) => {
      item.addEventListener("click", (event) => {
        dayItem.forEach((day) => {
          day.classList.remove("today");
        });
        if (event.target.tagName === "SPAN") {
          const parentLi = event.target.parentElement;
          parentLi.classList.add("today");
        }
      });
    });
  }
  addTodo.addEventListener("click", () => {
    openTodoList();
  });
  addListClose.addEventListener("click", () => {
    closeTodoList();
  });
  addListButton.addEventListener("click", async () => {
    try {
      const title = todoform.title.value;
      const description = todoform.description.value;
      const today = +document.querySelector(".today > .date").innerHTML;

      const { data } = await axios({
        method: "POST",
        url: "/calender/addTodo",
        data: {
          title: title,
          description: description,
          year: currentYear,
          month: currentMonth,
          today: today,
        },
      });

      todoform.title.value = "";
      todoform.description.value = "";
    } catch (err) {
      console.error(err);
    }
  });

  function openTodoList() {
    addList.style.display = "block";
    window.setTimeout(() => {
      addList.style.bottom = "0vh";
    }, 50);
    addTodo.style.display = "none";
  }

  function closeTodoList() {
    addList.style.bottom = "";
    window.setTimeout(() => {
      addList.style.display = "";
    }, 400);

    addTodo.style.display = "block";
  }
});
