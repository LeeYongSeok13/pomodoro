window.addEventListener("load", () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = today.getDay();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = dayNames[day];
  const lastdays = [0];
  let currentIndex = 0;

  const plusDays = document.querySelector(".plusDays");
  const dayList = document.querySelector(".dayList");
  console.log(plusDays);

  plusDays.addEventListener("click", () => {
    currentIndex += 4;
    dayList.style.transform = `translateX(-${currentIndex * 20} vw)`;
    console.log(currentIndex);
  });

  // 각 월별 마지막 날짜 계산
  function getDaysInMonth(year, month) {
    // month는 0부터 시작하므로 1을 더해줌
    return new Date(year, month + 1, 0).getDate();
  }
  // 마지막 날짜 정리
  for (let month = 0; month < 12; month++) {
    const days = getDaysInMonth(year, month);
    lastdays.push(days);
  }
});
