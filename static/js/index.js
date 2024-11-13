// 좋아요 모달 // 모달 열기
  function openLikeModal(feedId) {
    const modal = document.getElementById(`likeModal-${feedId}`);
      if (modal) {
        modal.style.display = 'block';  // 모달을 열 때
        document.body.style.overflow = 'hidden';  // body의 스크롤을 막음

        fetchLikeUsers(feedId);
      }
  }

  // 좋아요 사용자 데이터 가져오기
  function fetchLikeUsers(feedId) {
    fetch(`/api/likes/${feedId}`)
      .then (response => response.json())
      .then (data => {
        const likeList = document.getElementById(`likes-list-${feedId}`);

        likeList.innerHTML = ''; // 기존 목록 초기화 (새로운 값을 계속 보여주기 위해)
        
        // 사용자 목록 업데이트
        data.users.forEach(user => {
          const listItem = document.createElement('li');
          // 'user' 클래스 추가
          listItem.classList.add('user');

         // profile_image가 null일 경우 기본 이미지 사용
          const profileImage = user.profile_image || '../static/img/profile.png';
          
          listItem.innerHTML = `
              <img src="${profileImage}" alt="${user.nickname}" class="user-profile-img" />
              <span class="user-nickname">${user.nickname}</span>
          `;
          likeList.appendChild(listItem);
        });
      })
      .catch (error => {
        console.error(error);
      })
  }

  // 각 피드 좋아요 수 가져와서 업데이트
  async function updateLikeCounts (feedIds) {
    for (const feedId of feedIds) {
      try {
        const response = await fetch(`/get-like-count?feedId=${feedId}`);
        const { likeCount } = await response.json();

        const likeText = document.getElementById(`like-text-${feedId}`);
        if (likeCount > 0) {
          likeText.textContent = `${likeCount}명이 해당 게시물에 공감하고 있어요`;
        } else {
          likeText.textContent = '아직 공감한 사람이 없습니다.';
        }
      } catch (error) {
        console.error('error');
      }
    }
  }
  // 해당 피드에 대해서만 좋아요 수 최신화
  async function updateFeedLike(feedId) {
    try {
      const response = await fetch(`/get-feed-like?feedId=${feedId}`); 
      const { likeCnt } = await response.json(); // likeCount를 객체로 받을 경우
  
      const likeText = document.getElementById(`like-text-${feedId}`);
      if (likeCnt > 0) {
        likeText.textContent = `${likeCnt}명이 해당 게시물에 공감하고 있어요`;
      } else {
        likeText.textContent = '아직 공감한 사람이 없습니다.';
      }
    } catch (error) {
      console.error('Failed to update like count', error);
    }
  }
  
    // 페이지 로드 시 좋아요 개수 업데이트
    window.addEventListener('load', () => {
      const feedIds = [...document.querySelectorAll('.like-info')].map(info => info.dataset.feedId);
      updateLikeCounts(feedIds);
    });


  window.addEventListener('click', function(event) {
    var modal = event.target.closest('.like-modal'); // 클릭한 요소가 모달이라면
    var modalContent = modal ? modal.querySelector('.like-modal-content') : null; // 모달 콘텐츠 영역 찾기
    
    // 클릭한 요소가 모달 배경이면서 모달 콘텐츠 영역이 아닐 경우
    if (modal && !modalContent.contains(event.target)) {
      var feedId = modal.getAttribute('data-feed-id'); // data-feed-id 속성에서 feedId 값 가져오기
      closeLikeModal(feedId); // 모달 닫는 함수 호출
    }
  });
  
  
  // closeLikeModal 함수
  function closeLikeModal(feedId) {
    var modal = document.querySelector('.like-modal[data-feed-id="'+ feedId +'"]'); // 해당 feedId 값을 가진 모달만 찾기
    if (modal) {
      modal.style.display = 'none'; 
      document.body.style.overflow = ''; 
    }
  }

// 페이지 로드 시, 서버에서 받아온 좋아요 상태에 따라 하트 아이콘을 업데이트
async function setLikeStatusOnPageLoad() {
  try {
    const response = await fetch('/get-like-status');
    const feedLikeStatus = await response.json();

    // 각 피드에 대해 좋아요 상태를 업데이트
    feedLikeStatus.forEach(({ feedId, liked }) => {
      const heartIcon = document.getElementById(`likeIcon-${feedId}`);
      if (heartIcon) {
        if (liked) {
          heartIcon.classList.add('liked'); // 좋아요가 되어 있으면 하트 아이콘 활성화
        } else {
          heartIcon.classList.remove('liked'); // 좋아요가 되어 있지 않으면 비활성화
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch like status', error);
  }
}
// 페이지 로드 시 실행
window.addEventListener('load', setLikeStatusOnPageLoad);



async function toggleLike(feedId) {
  try {
    const response = await fetch(`/toggle-like?feedId=${feedId}`, { method: 'POST' });
    const data = await response.json();

    const heartIcon = document.getElementById(`likeIcon-${feedId}`);
    if (data.liked) {
      heartIcon.classList.add('liked'); // 좋아요 버튼 활성화 (빨간색 하트로 변경)
    } else {
      heartIcon.classList.remove('liked'); // 좋아요 버튼 비활성화 (기본 하트로 변경)
    }

    updateFeedLike(feedId);

  } catch (error) {
    console.error('Failed to toggle like', error);
  }
}
