// 모달 열기 및 닫기 함수
function openModal(message) {
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("resultModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

function openResetModal() {
  document.getElementById("resetPasswordModal").style.display = "flex";
}

function closeResetModal() {
  document.getElementById("resetPasswordModal").style.display = "none";
}

function openErrorModal(message) {
  document.getElementById("errorMessage").textContent = message;
  document.getElementById("errorModal").style.display = "flex";
}

function closeErrorModal() {
  document.getElementById("errorModal").style.display = "none";
}

async function findEmail() {
  const username = document.querySelector(".username").value;
  const phoneNumber = document.querySelector(".phoneNumber").value;

  // 에러 메세지 초기화
  const usernameErrorEl = document.getElementById("usernameError");
  const phoneNumberErrorEl = document.getElementById("phoneNumberError");

  // 초기화 작업: 에러 메세지 지우기
  if (usernameErrorEl) {
    usernameErrorEl.classList.remove("show");
    usernameErrorEl.textContent = ""; // 텍스트 초기화
  }
  if (phoneNumberErrorEl) {
    phoneNumberErrorEl.classList.remove("show");
    phoneNumberErrorEl.textContent = ""; // 텍스트 초기화
  }

  try {
    const response = await fetch("/login/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, phoneNumber }),
    });

    const data = await response.json();

    if (response.status === 200) {
      // 이메일이 확인되면 모달을 띄우고 이메일 주소를 표시
      openModal(`이메일 주소: ${data.emailAddr}`);
    } else if (response.status === 404) {
      // 오류 데이터에 따른 처리
      if (data.error === "username" && usernameErrorEl) {
        // 사용자 이름이 틀린 경우
        usernameErrorEl.classList.add("show"); // 'show' 클래스 추가
        usernameErrorEl.textContent = "해당되는 이름이 없습니다.";
      }
      if (data.error === "phoneNumber" && phoneNumberErrorEl) {
        // 전화번호가 틀린 경우
        phoneNumberErrorEl.classList.add("show"); // 'show' 클래스 추가
        phoneNumberErrorEl.textContent = "해당되는 휴대전화 번호가 없습니다.";
      }

      // 이름과 전화번호 모두 틀렸을 때는 둘 다 표시
      if (data.error === "mismatch") {
        if (usernameErrorEl) {
          usernameErrorEl.classList.add("show"); // 'show' 클래스 추가
          usernameErrorEl.textContent = "해당되는 이름이 없습니다.";
        }
        if (phoneNumberErrorEl) {
          phoneNumberErrorEl.classList.add("show"); // 'show' 클래스 추가
          phoneNumberErrorEl.textContent = "해당되는 휴대전화 번호가 없습니다.";
        }
      }
    }
  } catch (error) {
    console.error("Error finding email:", error);
    // 서버 오류가 발생한 경우만 모달 창을 띄움
    openModal("서버 오류가 발생했습니다.");
  }
}

// 사용자 확인 및 비밀번호 재설정 할 Javascript

let userId; // 사용자 ID를 저장할 변수

// 비밀번호 재설정 요청 함수
async function requestPasswordReset() {
  const username = document.querySelector(".username").value;
  const phoneNumber = document.querySelector(".phoneNumber").value;
  const emailAddr = document.querySelector(".emailAddr").value;

  try {
    const response = await fetch("/login/request-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, phoneNumber, emailAddr }),
    });

    if (response.status === 200) {
      const data = await response.json();
      userId = data.id; // 사용자 ID 저장
      openResetModal(); // 비밀번호 변경 모달 열기
    } else if (response.status === 404) {
      // 404 오류 메시지 처리
      const errorData = await response.json();
      openErrorModal(errorData.message);
    } else {
      openErrorModal("서버 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error requesting password reset:", error);
    openErrorModal("서버 오류가 발생했습니다.");
  }
}

// 비밀번호 업데이트 함수
async function updatePassword() {
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword !== confirmPassword) {
    openModal("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const response = await fetch("/login/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, newPassword }),
    });

    if (response.status === 200) {
      const data = await response.json();
      openModal(data.message); // 성공 메시지 표시
      closeResetModal(); // 비밀번호 입력 모달 닫기
    } else {
      openModal("비밀번호 변경에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error updating password:", error);
    openModal("서버 오류가 발생했습니다.");
  }
}
