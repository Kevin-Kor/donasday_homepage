/**
 * 도나스데이 용인 본점 웹사이트 JavaScript
 * 작성일: 2025-03-14
 * 수정일: 2025-03-15
 */

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // AOS 초기화 (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // 메뉴 토글 기능
    initMenuToggle();
    
    // 스크롤 이벤트 처리
    initScrollEvents();
    
    // 메뉴 카테고리 탭 기능
    initMenuTabs();
    
    // 슬라이더 초기화
    initSliders();
    
    // 지도 초기화
    initMap();
    
    // 문의 폼 제출 처리
    initContactForm();

    // 이미지 로딩 오류 처리 초기화
    handleImageError();
});

/**
 * 메뉴 토글 기능 초기화
 */
function initMenuToggle() {
    const menuBtn = document.querySelector('.menu-btn');
    const navigation = document.querySelector('.navigation');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // 메뉴 버튼 클릭 이벤트
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navigation.classList.toggle('active');
        });
    }
    
    // 네비게이션 링크 클릭 시 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navigation.classList.remove('active');
        });
    });
}

/**
 * 스크롤 이벤트 처리 초기화
 */
function initScrollEvents() {
    const header = document.querySelector('.header');
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    
    // 스크롤 이벤트
    window.addEventListener('scroll', function() {
        // 헤더 스타일 변경
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 스크롤 탑 버튼 표시/숨김
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    // 스크롤 탑 버튼 클릭 이벤트
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 스무스 스크롤 구현
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 메뉴 카테고리 탭 기능 초기화
 */
function initMenuTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 활성 탭 변경
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 해당 카테고리 표시
            const category = this.getAttribute('data-category');
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
                if (cat.id === category) {
                    cat.classList.add('active');
                }
            });
        });
    });
}

/**
 * 슬라이더 초기화
 */
function initSliders() {
    // 브랜드 스토리 갤러리 슬라이더 (수정된 선택자)
    if (document.querySelector('.brand-story-gallery .swiper-container')) {
        try {
            const brandStorySwiper = new Swiper('.brand-story-gallery .swiper-container', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.brand-story-gallery .swiper-pagination',
                    clickable: true
                },
                on: {
                    init: function() {
                        console.log('브랜드 스토리 스와이퍼 초기화 완료');
                    }
                }
            });
        } catch (error) {
            console.error('브랜드 스토리 슬라이더 초기화 중 오류:', error);
            // 오류 발생 시 대체 콘텐츠 표시
            createPlaceholderForBrandStory();
        }
    } else {
        console.warn('브랜드 스토리 슬라이더 컨테이너를 찾을 수 없습니다.');
    }
    
    // 매장 갤러리는 정적 그리드로 변경되어 슬라이더 초기화 불필요
    // 매장 갤러리 이미지 오류 처리 확인
    handleStoreGalleryImages();
}

/**
 * 브랜드 스토리에 대한 플레이스홀더 생성
 */
function createPlaceholderForBrandStory() {
    const brandGallery = document.querySelector('.brand-story-gallery');
    if (brandGallery) {
        // 기존 내용 제거
        brandGallery.innerHTML = '';
        
        // 플레이스홀더 갤러리 생성
        const placeholderGallery = document.createElement('div');
        placeholderGallery.className = 'placeholder-gallery';
        
        // 3개의 플레이스홀더 이미지 추가
        for (let i = 0; i < 3; i++) {
            const placeholderImage = document.createElement('div');
            placeholderImage.className = 'gallery-image';
            placeholderImage.style.backgroundColor = getRandomPastelColor();
            placeholderImage.innerHTML = `<span>도나스데이 브랜드 이미지 ${i + 1}</span>`;
            placeholderGallery.appendChild(placeholderImage);
        }
        
        brandGallery.appendChild(placeholderGallery);
    }
}

/**
 * 매장 갤러리 이미지 처리
 */
function handleStoreGalleryImages() {
    const storeGalleryImages = document.querySelectorAll('.store-gallery .gallery-image img');
    
    storeGalleryImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            const parentDiv = this.parentElement;
            parentDiv.removeChild(this);
            parentDiv.style.backgroundColor = getRandomPastelColor();
            parentDiv.innerHTML = `<span>매장 이미지 ${index + 1}</span>`;
        });
    });
}

/**
 * 지도 초기화
 */
function initMap() {
    const mapContainer = document.getElementById('map');
    
    if (mapContainer) {
        // Leaflet.js를 사용한 지도 초기화
        try {
            // 용인 도나스데이 위치 좌표 (경기도 용인시 기흥구 구성로 160)
            const lat = 37.2834;
            const lng = 127.0765;
            
            const map = L.map('map').setView([lat, lng], 16);
            
            // OpenStreetMap 타일 레이어 추가
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // 마커 추가
            const marker = L.marker([lat, lng]).addTo(map);
            
            // 팝업 추가
            marker.bindPopup('<strong>도나스데이 용인 본점</strong><br>경기도 용인시 기흥구 구성로 160').openPopup();
        } catch (error) {
            console.error('지도 로딩 중 오류 발생:', error);
            mapContainer.innerHTML = '<div class="map-error">지도를 로드할 수 없습니다.</div>';
        }
    }
}

/**
 * 문의 폼 제출 처리 초기화
 */
function initContactForm() {
    const contactForm = document.getElementById('inquiry-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };
            
            // 폼 유효성 검사
            if (!validateForm(formData)) {
                return;
            }
            
            // 실제 구현에서는 서버로 데이터 전송
            // 여기서는 성공 메시지 표시로 대체
            showFormSuccess();
            
            // 폼 초기화
            contactForm.reset();
        });
    }
}

/**
 * 폼 유효성 검사
 */
function validateForm(data) {
    // 이름 검사
    if (!data.name || data.name.trim() === '') {
        alert('이름을 입력해주세요.');
        return false;
    }
    
    // 이메일 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        alert('유효한 이메일 주소를 입력해주세요.');
        return false;
    }
    
    // 전화번호 검사
    const phoneRegex = /^[0-9]{2,3}-?[0-9]{3,4}-?[0-9]{4}$/;
    if (!data.phone || !phoneRegex.test(data.phone.replace(/-/g, ''))) {
        alert('유효한 전화번호를 입력해주세요.');
        return false;
    }
    
    // 메시지 검사
    if (!data.message || data.message.trim() === '') {
        alert('문의 내용을 입력해주세요.');
        return false;
    }
    
    return true;
}

/**
 * 폼 제출 성공 메시지 표시
 */
function showFormSuccess() {
    alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
}

/**
 * 이미지 로딩 오류 처리
 */
function handleImageError() {
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
        img.addEventListener('error', function() {
            // 이미지의 부모 요소
            const parentElement = this.parentElement;
            
            // 이미지 제거
            parentElement.removeChild(this);
            
            // 대체 콘텐츠 추가
            parentElement.style.backgroundColor = getRandomPastelColor();
            
            // 이미지 종류에 따라 다른 메시지 표시
            let message = '이미지를 불러올 수 없습니다';
            if (parentElement.closest('.menu-image')) {
                message = `도넛 이미지 ${index % 4 + 1}`;
            } else if (parentElement.closest('.brand-story-gallery')) {
                message = `브랜드 스토리 이미지 ${index % 3 + 1}`;
            } else if (parentElement.closest('.store-gallery')) {
                message = `매장 이미지 ${index % 4 + 1}`;
            }
            
            parentElement.innerHTML = `<span>${message}</span>`;
        });
    });
}

/**
 * 임시 이미지 플레이스홀더 생성
 * 실제 이미지가 없는 경우 사용
 */
function createPlaceholderImages() {
    // 메뉴 이미지 플레이스홀더
    document.querySelectorAll('.menu-image-placeholder').forEach((placeholder, index) => {
        placeholder.style.backgroundColor = getRandomPastelColor();
        placeholder.innerHTML = `<span>도넛 이미지 ${index + 1}</span>`;
    });
    
    // 갤러리 이미지 플레이스홀더
    document.querySelectorAll('.gallery-image').forEach((image, index) => {
        // 이미 이미지가 있는지 확인
        const hasImage = image.querySelector('img') || image.style.backgroundImage;
        
        if (!hasImage || image.style.backgroundImage === 'none') {
            image.style.backgroundColor = getRandomPastelColor();
            
            // 이미지 종류에 따라 다른 메시지 표시
            let message = '갤러리 이미지';
            if (image.closest('.brand-story-gallery')) {
                message = `브랜드 스토리 이미지 ${index % 3 + 1}`;
            } else if (image.closest('.store-gallery')) {
                message = `매장 이미지 ${index % 4 + 1}`;
            } else {
                message = `갤러리 이미지 ${index + 1}`;
            }
            
            image.innerHTML = `<span>${message}</span>`;
        }
    });
}

/**
 * 랜덤 파스텔 색상 생성
 */
function getRandomPastelColor() {
    const pastelColors = [
        'rgb(240, 190, 168)', // 살구색
        'rgb(220, 210, 170)', // 연한 베이지
        'rgb(200, 220, 240)', // 하늘색
        'rgb(190, 220, 210)', // 민트색
        'rgb(230, 210, 190)', // 베이지
        'rgb(210, 230, 200)', // 연한 초록
        'rgb(240, 200, 210)'  // 연한 핑크
    ];
    
    // 미리 정의된 파스텔 색상 중 랜덤 선택
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

// 페이지 로드 완료 후 플레이스홀더 이미지 생성
window.addEventListener('load', createPlaceholderImages);