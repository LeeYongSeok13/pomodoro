// 모달 열기 및 닫기 함수
function openModal(message) {
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("resultModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

// 이메일 찾기 함수
async function findEmail() {
  const username = document.querySelector(".username").value;
  const phoneNumber = document.querySelector(".phoneNumber").value;

  console.log(username);
  console.log(phoneNumber);

  try {
    const response = await fetch("/login/find", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, phoneNumber }),
    });

    if (response.status === 200) {
      const data = await response.json();
      openModal(`이메일 주소: ${data.emailAddr}`);
    } else if (response.status === 404) {
      openModal("이메일을 찾을 수 없습니다.");
    } else {
      openModal("서버 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("Error finding email:", error);
    openModal("서버 오류가 발생했습니다.");
  }
}

// 사용자 확인 및 비밀번호 재설정 할 Javascript

let userId; // 사용자 ID를 저장할 변수

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

// 비밀번호 재설정 요청 함수
async function requestPasswordReset() {
  const username = document.querySelector(".username").value;
  const phoneNumber = document.querySelector(".phoneNumber").value;
  const emailAddr = document.querySelector(".emailAddr").value;

  try {
    const response = await fetch("/login/find", {
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
    const response = await fetch("/login/find", {
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
