window.onload = function() {
  let currentPage = 2; // 현재 페이지
  let isLoading = false; // 데이터 로딩 여부 체크

  function loadMoreFeeds() {
    if (isLoading) return;  // 로딩 중일 때는 중복 요청을 방지
    isLoading = true;  // 로딩 시작
  
    fetch(`/get-feeds?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        const feedContainer = document.querySelector('.feed-container'); 
        console.log(data);
        // 피드 데이터가 존재하면 화면에 추가
        if (data && data.feeds.length > 0) {
          const sessionNickname = data.feedNickname;
          data.feeds.forEach(feed => {
            const feedElement = document.createElement('div');
            feedElement.classList.add('feed-item');

            // 로그인한 사용자의 피드게시글만 수정 삭제 보이게 처리
            const buttonHtml = feed.user.nickname === sessionNickname ?`
                 <button type="button" class="imgButton modify" onclick="feedEdit()"></button>
                 <button type="button" class="imgButton delete" onclick="feedDelete()"></button>
                 ` : '';

            // 피드 생성 html
            feedElement.innerHTML = `
              <div class="content">
                <div class="user-info">
              <div class="profile-img">
                <img
                  src="/static/img/profile.png"
                  alt="프로필 이미지"
                  width="30px"
                />
              </div>
              <strong>${feed.user.nickname}</strong>
            </div>
                <img src="${feed.file_url}" alt="post" />
                <p>${feed.content}</p>
                <div class="get-tomato-sum">
                  획득한 토마토<img class="tomato" src="/static/img/tomato.png" alt="획득 토마토" />
                </div>
            <div class="icon-container">
              <div class="left-icons">
                <img src="../static/svg/suit-heart.svg" alt="하트 아이콘" />
                <img
                  src="../static/svg/chat.svg"
                  alt="채팅 아이콘"
                  onclick="toggleCommentBox()"
                />
              </div>
              <div class="right-icons">
                ${buttonHtml} 
              </div>
            </div>
              </div>
            `;
            feedContainer.appendChild(feedElement);
          });

          currentPage++; // 페이지 번호 증가
        }

        isLoading = false; // 로딩 종료
      })
      .catch(error => {
        console.error('Error loading feeds:', error);
        isLoading = false; // 에러가 나면 로딩 종료
      });
  }

  // 스크롤 이벤트 핸들러
  window.addEventListener('scroll', () => {
    // 페이지 끝에 도달하면 데이터 요청
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
      loadMoreFeeds(); // 추가 데이터
    }
  });
}
