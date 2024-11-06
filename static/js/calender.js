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
  const todoContainer = document.querySelector(".todo-container");

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
  deletebuttonActive();
  plusDays.addEventListener("click", () => {
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
    // 날짜 클릭시 today 클래스 적용
    const dayItem = document.querySelectorAll(`.dayList > li`);
    let today;
    dayItem.forEach((item) => {
      item.addEventListener("click", async (event) => {
        // 하나가 클릭되면 일단 모든 li의 today를 지움
        dayItem.forEach((day) => {
          day.classList.remove("today");
        });
        // 하나에게만 today를 추가한다.
        if (event.target.tagName === "SPAN") {
          const parentLi = event.target.parentElement;
          parentLi.classList.add("today");
          today = +parentLi.children[1].innerHTML;
        } else {
          event.target.classList.add("today");
          today = +event.target.children[1].innerHTML;
        }

        todoContainer.innerHTML = "";

        const { data } = await axios({
          method: "GET",
          url: "/calender/changeDate",
          params: {
            year: currentYear,
            month: currentMonth - 1,
            day: today,
          },
        });

        todoContainer.innerHTML = data;
        deletebuttonActive();
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
      // 유효성 검사
      if (title === "" || description === "") {
        alert("주제와 세부내용을 모두 입력해주세요!");
        return;
      }
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
      const dataId = data.id;

      closeTodoList();
      // 요소 추가
      const response = await axios({
        method: "GET",
        url: "/get-component",
        params: {
          title: todoform.title.value,
          description: todoform.description.value,
          dataId: dataId,
        },
      });
      // DOMParser 인스턴스 생성
      const parser = new DOMParser();
      // HTML 문자열을 Document로 파싱
      const doc = parser.parseFromString(response.data, "text/html");

      // HTML 요소 선택
      const element = doc.body.firstChild; // 첫 번째 요소 가져오기
      element.style.bottom = "-100vh";
      todoContainer.appendChild(element);
      window.setTimeout(() => {
        element.style.bottom = "0vh";
      }, 100);

      deletebuttonActive();
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
    }, 300);
    window.setTimeout(() => {
      addTodo.style.display = "block";
    }, 500);
  }

  function deletebuttonActive() {
    const deleteButton = document.querySelectorAll(".delete");
    deleteButton.forEach((item) => {
      item.addEventListener("click", async (event) => {
        const parentItem = event.target.parentElement.parentElement;
        const dataId = event.target.parentElement.parentElement.dataset.id;
        const { data } = await axios.delete("/calender/delete", {
          data: { dataId: dataId },
        });
        console.log(data);
        if (data) {
          console.log(parentItem);
          parentItem.style.transform = "translateX(-100vw)";
          window.setTimeout(() => {
            parentItem.remove();
          }, 250);
        }
      });
    });
  }
});
