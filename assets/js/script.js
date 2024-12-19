// JavaScript 파일은 현재 필요한 동작이 적으므로 추후 확장용으로 남겨둠.
// 작업물 추가 및 동적 동작을 이곳에 추가.
console.log("Portfolio site initialized.");

// 스크롤 이벤트 리스너 추가
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

function adjustLogoColor() {
    console.log("로고 색을 계산합니다");
    const logo = document.querySelector('.logo-img');
    const backgroundColor = window.getComputedStyle(document.body).backgroundColor;

    // RGB 값을 추출하여 밝기 계산
    const [r, g, b] = backgroundColor.match(/\d+/g).map(Number);
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114); // 가중치를 이용한 밝기 계산

    if (brightness > 128) {
        // 밝은 배경일 경우
        logo.style.filter = "invert(1)";
    } else {
        // 어두운 배경일 경우
        logo.style.filter = "invert(0)";
    }
}

// 페이지 로드 시 색상 조정
window.addEventListener('load', adjustLogoColor);
// 윈도우 크기 조정 시 색상 재조정
window.addEventListener('resize', adjustLogoColor);

document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

document.getElementById('current-year').textContent = new Date().getFullYear();