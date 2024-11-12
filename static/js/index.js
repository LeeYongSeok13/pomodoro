// 좋아요 모달
      // 모달 열기
  function openLikeModal(feedId) {
    const modal = document.getElementById(`likeModal-${feedId}`);
      if (modal) {
        modal.style.display = 'block';  // 모달을 열 때
        document.body.style.overflow = 'hidden';  // body의 스크롤을 막음
      }
  }

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
  

