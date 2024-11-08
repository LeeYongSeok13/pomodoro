window.onload = function() {
  let currentPage = 2; // 현재 페이지
  let isLoading = false; // 데이터 로딩 여부 체크

  // 첫 번째 페이지 데이터 로드 (페이지 로드 시 자동 호출)
  loadMoreFeeds();

  function loadMoreFeeds() {
    if (isLoading) return;  // 로딩 중일 때는 중복 요청을 방지
    isLoading = true;  // 로딩 시작
  
    fetch(`/get-feeds?page=${currentPage}`)
      .then(response => response.json())
      .then(data => {
        const feedContainer = document.querySelector('.feed-container'); 

        console.log(feedContainer);
        
        // 피드 데이터가 존재하면 화면에 추가
        if (data.feeds && data.feeds.length > 0) {
          data.feeds.forEach(feed => {
            const feedElement = document.createElement('div');
            feedElement.classList.add('feed-item');
            feedElement.innerHTML = `
              <div class="content">
                <p class="user-info">
                  <span class="profile-img"></span>
                  <strong>${feed.User.nickname}</strong>
                </p>
                <img src="${feed.file_url}" alt="post" />
                <p>${feed.content}</p>
                <div class="get-tomato-sum">
                  획득한 토마토<img class="tomato" src="/static/img/tomato.png" alt="획득 토마토" />
                </div>
                <div class="icon-container">
                  <img src="../static/svg/suit-heart.svg" alt="하트 아이콘" />
                  <img src="../static/svg/chat.svg" alt="채팅 아이콘" onclick="toggleCommentBox()" />
                </div>
              </div>
            `;
            feedContainer.appendChild(feedElement);
          });

          currentPage++; // 페이지 번호 증가
          console.log('페이지 번호 증가값 : ',currentPage);
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
