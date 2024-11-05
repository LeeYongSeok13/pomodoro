// if (!isLoginValid) {
//   res.render("login", { loginEM: "아이디 또는 비밀번호가 틀렸습니다." });
// } else {
//   res.redirect("/");
// }

// 모달창 js코드

const modal = document.querySelector(".register-modal");
const btnOpenModal = document.querySelector(".modalOffBt");
const btnOffModal = document.querySelector(".loginBt");

btnOpenModal.addEventListener("click", () => {
  modal.classList.add("d-none");
});

btnOffModal.addEventListener("click", () => {
  modal.classList.remove("d-none");
  modal.classList.add("modalOn");

  modalOffBt.classList.add("modalBt");
});
