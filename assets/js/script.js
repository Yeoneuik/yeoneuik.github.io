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
    const currentPath = window.location.pathname;

    if (currentPath.includes("/works/")&& !currentPath.includes("work-detail.html")) {
        const workGrid = document.getElementById("workGrid");
        const filterButtons = document.getElementById("filterButtons");

        if (!workGrid) {
            console.error("Element with id 'workGrid' not found in DOM.");
            return;
        }

        let allWorks = []; // 모든 작품 데이터를 저장

        // JSON 데이터 로드
        fetch("../assets/data/works.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                allWorks = data;
                renderWorks(allWorks); // 초기에는 모든 작품 표시

                // "모두 / All" 버튼을 선택 상태로 설정
                const allButton = filterButtons.querySelector('button[data-filter="All"]');
                if (allButton) {
                    allButton.classList.add("active");
                }
            })
            .catch(error => console.error("Error loading JSON:", error.message));

        // 필터 버튼 클릭 이벤트
        if (filterButtons) {
            filterButtons.addEventListener("click", (event) => {
                if (event.target.tagName === "BUTTON") {
                    const filter = event.target.dataset.filter;

                    // 버튼 활성화 상태 업데이트
                    document.querySelectorAll(".filter-buttons button").forEach(button => {
                        button.classList.toggle("active", button.dataset.filter === filter);
                    });

                    // 작품 필터링
                    if (filter === "All") {
                        renderWorks(allWorks);
                    } else {
                        const filteredWorks = allWorks.filter(work => work.분류 === filter);
                        renderWorks(filteredWorks);
                    }
                }
            });
        }
    } else if (currentPath.includes("work-detail.html")) {
        const workContent = document.getElementById("workContent");

        if (!workContent) {
            console.error("Element with id 'workContent' not found in DOM.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const workId = urlParams.get("id");

        if (workId) {
            fetch("../assets/data/works.json")
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const work = data.find(item => item.id === workId);
                    if (work) {
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
            <a href="/works/work-detail.html?id=${work.id}">
                <div class="image-wrapper">
                    <img src="${work.thumbnail}" 
                         alt="${work.title} Thumbnail"
                         class="work-thumbnail">
                    <img src="${work.thumbnail.replace('.jpg', '2.jpg')}"
                         alt="${work.title} Hover Thumbnail"
                         class="work-thumbnail hover-img">
                </div>
                <h3 class="worktitle">${work.title}</h3>
                <p class="subtitle">${work.subtitle}</p>
                <p class="filter">${work.분류}</p>
            </a>
        </div>
    `).join('');

    // work-item 전체에 hover 이벤트 적용
    document.querySelectorAll('.work-item').forEach(item => {
        const hoverImg = item.querySelector('.hover-img');

        item.addEventListener('mouseenter', () => {
            hoverImg.style.opacity = "1"; // 부드럽게 나타남
        });

        item.addEventListener('mouseleave', () => {
            hoverImg.style.opacity = "0"; // 부드럽게 사라짐
        });
    });
}






// 상세 작품 렌더링 함수
function renderWorkDetail(work) {
    const workContent = document.getElementById("workContent");

    if (!workContent) {
        console.error("Element with id 'workContent' not found in DOM.");
        return;
    }

    // Google Analytics에 가상 페이지뷰 전송
    const virtualUrl = `/works/${work.id}`; // 작품별 가상 URL
    const artworkTitle = work.title;       // 작품 제목
    gtag('config', 'G-BY5NT9HC0K', {       // Tracking ID로 교체
        'page_path': virtualUrl,
        'page_title': artworkTitle
    });

    workContent.innerHTML = `
        <div class="work-header">
            <h2 class="ProjectTitle">${work.title}</h2>
            <p class="subtitle">${work.subtitle}</p>
        </div>
        <div class="work-main">
            <div class="media-container">
                <img src="${work.mainImage}" alt="${work.title}" class="media-item main-image">
            </div>
        </div>
        <div class="work-meta">
            <p><strong>Year:</strong> ${work.year}</p>
            <p><strong>Category:</strong> ${work.분류}</p>
            <p><strong>Key Words:</strong> ${work.keyWords}</p>
        </div>
        <div class="work-abstract">
            <h3>${work.abstract}</h3>
            <p>${work.detail}</p>
            <br>
        </div>
        ${work.mainVideo ? `
            <div class="media-container">
                <iframe src="${work.mainVideo}" frameborder="0" allowfullscreen class="media-item main-video"></iframe>
            </div>` : ""}
        <div class="work-detail"></div>
    `;

    appendDetailImages(work.id); // detail 이미지 추가
}

// detail 이미지를 추가하는 함수
function appendDetailImages(workId) {
    const workDetailContainer = document.querySelector(".work-detail");

    if (!workDetailContainer) {
        console.error("Element with class 'work-detail' not found in DOM.");
        return;
    }

    // detail 이미지가 저장된 폴더 경로
    const detailFolderPath = `../assets/images/${workId}/`;

    // detail 이미지 개수를 추정하여 동적으로 생성
    let imageIndex = 1; // detail1.jpg부터 시작

    function loadNextImage() {
        const imagePath = `${detailFolderPath}detail${imageIndex}.jpg`;
        const img = new Image();

        img.onload = () => {
            // 이미지 로드 성공 시 추가
            workDetailContainer.insertAdjacentHTML("beforeend", `
                <div class="media-container">
                    <img src="${imagePath}" alt="Detail Image ${imageIndex}" class="media-item detail-image">
                </div>
            `);

            // 다음 이미지 로드 시도
            imageIndex++;
            loadNextImage();
        };

        img.onerror = () => {
            // 이미지 로드 실패 시 종료
            console.log(`No more images found after detail${imageIndex - 1}.jpg`);
        };

        img.src = imagePath;
    }

    // 첫 번째 이미지 로드 시작
    loadNextImage();
}
