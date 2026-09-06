// JavaScript 파일은 현재 필요한 동작이 적으므로 추후 확장용으로 남겨둠.
// 작업물 추가 및 동적 동작을 이곳에 추가.
console.log("Portfolio site initialized.");

// 스크롤 이벤트 리스너 추가
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (!header) {
        return;
    }
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

function adjustLogoColor() {
    console.log("로고 색을 계산합니다");
    const logo = document.querySelector('.logo-img');
    if (!logo) {
        return;
    }
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

    if (!backToTopButton) {
        return;
    }

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

const currentYear = document.getElementById('current-year');
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}



/////////////////////////////////
// works 페이지 채우는 코드 //////
document.addEventListener("DOMContentLoaded", () => {
    const pageType = document.body.dataset.page;

    if (pageType === "works-index") {
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
    } else if (pageType === "work-detail-legacy") {
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
                        applyLegacyWorkMetadata(work);
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
            <a href="${work.slug ? `/works/${work.slug}/` : `/works/work-detail.html?id=${work.id}`}">
                <div class="image-wrapper">
                    <img src="${work.thumbnail}" 
                         alt="${work.title} Thumbnail"
                         class="work-thumbnail">
                    <img src="${work.hoverThumbnail || deriveHoverThumbnail(work.thumbnail)}"
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

function plainWorkText(value) {
    const element = document.createElement("div");
    element.innerHTML = String(value || "").replace(/<br\s*\/?>/gi, " / ");
    return (element.textContent || "").replace(/\s+/g, " ").trim();
}

function setMetaContent(selector, content) {
    let element = document.head.querySelector(selector);
    if (!element) {
        element = document.createElement("meta");
        const propertyMatch = selector.match(/^meta\[property="([^"]+)"\]$/);
        const nameMatch = selector.match(/^meta\[name="([^"]+)"\]$/);
        if (propertyMatch) {
            element.setAttribute("property", propertyMatch[1]);
        } else if (nameMatch) {
            element.setAttribute("name", nameMatch[1]);
        }
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
}

function applyLegacyWorkMetadata(work) {
    const title = plainWorkText(work.title);
    const description = plainWorkText(work.abstract || work.detail).slice(0, 160);
    const canonicalUrl = work.slug
        ? `https://yeoneui.kim/works/${work.slug}/`
        : window.location.href;
    const imageUrl = new URL(work.mainImage, window.location.href).href;

    document.title = `${title} | Yeoneui Kim 김연의`;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', document.title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[property="og:image"]', imageUrl);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
}

// 명시된 hoverThumbnail이 없는 기존 데이터는 thumbnail과 같은 확장자로
// thumbnail2 파일을 찾는다. 예: thumbnail.jpg -> thumbnail2.jpg
function deriveHoverThumbnail(thumbnailPath) {
    const match = thumbnailPath.match(/^(.*?)(\.[^./?#]+)([?#].*)?$/);
    if (!match) {
        return `${thumbnailPath}2`;
    }
    return `${match[1]}2${match[2]}${match[3] || ""}`;
}






// 상세 작품 렌더링 함수
function renderWorkDetail(work) {
    const workContent = document.getElementById("workContent");

    if (!workContent) {
        console.error("Element with id 'workContent' not found in DOM.");
        return;
    }

    // Google Analytics에 가상 페이지뷰 전송
    const virtualUrl = work.slug ? `/works/${work.slug}/` : `/works/${work.id}`;
    const artworkTitle = work.title;       // 작품 제목
    gtag('config', 'G-BY5NT9HC0K', {       // Tracking ID로 교체
        'page_path': virtualUrl,
        'page_title': artworkTitle
    });

    workContent.innerHTML = `
        <div class="work-header">
            <h1 class="ProjectTitle">${work.title}</h1>
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

    appendDetailImages(work); // detail 이미지 추가
}

// detail 이미지를 추가하는 함수
function appendDetailImages(work) {
    const workDetailContainer = document.querySelector(".work-detail");

    if (!workDetailContainer) {
        console.error("Element with class 'work-detail' not found in DOM.");
        return;
    }

    // 새 데이터는 JSON의 경로와 확장자를 그대로 사용한다.
    // 빈 배열은 상세 이미지를 표시하지 않겠다는 명시적인 선택이다.
    if (Array.isArray(work.detailImages)) {
        work.detailImages
            .filter(imagePath => typeof imagePath === "string" && imagePath.trim() !== "")
            .forEach((imagePath, index) => {
                workDetailContainer.insertAdjacentHTML("beforeend", `
                    <div class="media-container">
                        <img src="${imagePath}" alt="Detail Image ${index + 1}" class="media-item detail-image">
                    </div>
                `);
            });
        return;
    }

    // 기존 데이터는 detail1.jpg부터 번호가 끊길 때까지 찾는 방식을 유지한다.
    const detailFolderPath = `../assets/images/${work.id}/`;

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
