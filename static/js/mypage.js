window.addEventListener("load", () => {
  const input = document.querySelector("#profileChange");

  input.addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await fetch("/myPage/profileImage", {
        method: "POST",
        body: formData, // formData는 body에 전달
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        const profileImage = document.querySelector("#profileImage");
        profileImage.src = data.fileUrl; // 업로드된 이미지 URL로 이미지 소스 설정
      } else {
        console.error("프로필 이미지 업데이트 실패:", data.message);
      }
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
    }
  });
});
