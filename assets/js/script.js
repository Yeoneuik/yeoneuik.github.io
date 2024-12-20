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



/////////////////////////////////
// works 페이지 채우는 코드 //////
document.addEventListener("DOMContentLoaded", () => {
    // 현재 페이지 경로를 가져옵니다.
    const currentPath = window.location.pathname;

    if (currentPath.includes("work.html")) {
        // works 페이지 처리
        const workGrid = document.getElementById("workGrid");

        if (!workGrid) {
            console.error("Element with id 'workGrid' not found in DOM.");
            return;
        }

        fetch("assets/data/works.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                renderWorks(data);
            })
            .catch(error => console.error("Error loading JSON:", error.message));
    } else if (currentPath.includes("work-detail.html")) {
        // work-detail 페이지 처리
        const workContent = document.getElementById("workContent");

        if (!workContent) {
            console.error("Element with id 'workContent' not found in DOM.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const workId = urlParams.get("id");

        if (workId) {
            fetch("assets/data/works.json")
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const work = data.find(item => item.id === workId);
                    if (work) {
                        // 페이지 제목 업데이트
                        document.title = work.title.replace(/<br>/g, " "); // `<br>` 태그 제거
                        renderWorkDetail(work);
                    } else {
                        workContent.innerHTML = "<p>Work not found.</p>";
                    }
                })
                .catch(error => {
                    console.error("Error loading JSON:", error.message);
                    workContent.innerHTML = "<p>Failed to load work details.</p>";
                });
        } else {
            workContent.innerHTML = "<p>No work ID provided.</p>";
        }
    }
});

// works 페이지 렌더링 함수
function renderWorks(works) {
    const workGrid = document.getElementById("workGrid");

    if (!workGrid) {
        console.error("Element with id 'workGrid' not found in DOM.");
        return;
    }

    // JSON 데이터를 역순으로 정렬
    const reversedWorks = [...works].reverse();

    workGrid.innerHTML = reversedWorks.map(work => `
        <div class="work-item">
            <a href="${work.link}">
                <div class="image-wrapper">
                    <img src="${work.thumbnail}" alt="${work.title} Thumbnail">
                </div>
                <h3 class="worktitle">${work.title}</h3>
                <p class="subtitle">${work.subtitle}</p>
            </a>
        </div>
    `).join('');
}

// work-detail 페이지 렌더링 함수
function renderWorkDetail(work) {
    const workContent = document.getElementById("workContent");

    if (!workContent) {
        console.error("Element with id 'workContent' not found in DOM.");
        return;
    }

    workContent.innerHTML = `
        <div class="work-header">
            <h2 class="ProjectTitle">${work.title}</h2>
            <p class="subtitle">${work.subtitle}</p>
        </div>
        <div class="work-main">
            <div class="media-container">
                <img src="${work.mainImage}" alt="${work.title}" class="media-item main-image">
            </div>
            ${work.mainVideo ? `
            <div class="media-container">
                <iframe src="${work.mainVideo}" frameborder="0" allowfullscreen class="media-item main-video"></iframe>
            </div>` : ""}
        </div>
        <div class="work-meta">
            <p><strong>Year:</strong> ${work.year}</p>
            <p><strong>Category:</strong> ${work.분류}</p>
            <p><strong>Key Words:</strong> ${work.keyWords}</p>
        </div>
        <div class="work-abstract">
            <!--<h2>Abstract</h2>-->
            <h3>${work.abstract}</h3>
        </div>
        <div class="work-detail">
            <!--<h2>Details</h2>-->
            <p>${work.detail}</p>
        </div>
    `;
}
