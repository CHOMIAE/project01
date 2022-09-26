import { data } from './data.js';
import { ProjectView } from './ProjectView.js';

// new ProjectView();

let numberOfPanels = 8; // 패널 개수
let panelSize = 300; // 패널 크기(폭)
// 2파이는 360도 => 라디안 값으로 변환
let unitRadian = 2*Math.PI / numberOfPanels;
let unitDegree = 360 / numberOfPanels;

let prevPageYOffset;  // 이전 스크롤 위치
let scrollDirection; // 스크롤 방향(위, 아래)

let projectView;

let currentIndex; // 현재 활성화된 프로젝트 번호
let currentPanelElem; // 현재 활성화된 패널 요소 객체

let loaderElem;
let panelsElem;
let panelListElem;
let panelItemeElems;
let observerElems;

let porjectListElem;


const chart1 = document.querySelector('.doughnut1');
const chart2 = document.querySelector('.doughnut2');
const chart3 = document.querySelector('.doughnut3');
const chart4 = document.querySelector('.doughnut4');
const chart5 = document.querySelector('.doughnut5');
const chart6 = document.querySelector('.doughnut6');

const makeChart = (percent, classname, color) => {
  let i = 1;
  let chartFn = setInterval(function() {
    if (i < percent) {
      colorFn(i, classname, color);
      i++;
    } else {
      clearInterval(chartFn);
    }
  }, 10);
}

const colorFn = (i, classname, color) => {
  classname.style.background = "conic-gradient(" + color + " 0% " + i + "%, #dedede " + i + "% 100%)";
}

makeChart(90, chart1, '#04c2f3');
makeChart(88, chart2, '#f57906');
makeChart(65, chart3, '#dc76f4');
makeChart(60, chart4, '#c98df4');
makeChart(48, chart5, '#ff4700');
makeChart(35, chart6, '#007ecf');



function setElems() {
    loaderElem = document.querySelector('.loader-wrapper');
    panelsElem = document.querySelector('.panels');
    panelListElem = document.querySelector('.panel-list');
    panelItemeElems = document.querySelectorAll('.panel-item');
    observerElems = document.querySelectorAll('.observer-ready');
    porjectListElem = document.querySelector('.project-list');
};

// 각 패널들의 회전과 위치 결정
function setPanelItems() {
    // 패널 폭은 300
    const dist = (panelSize / 2) / Math.tan(unitRadian / 2) + (panelSize * 0.65);
    // console.log(dist);

    for (let i = 0; i < panelItemeElems.length; i++) {
        // console.log(panelItemeElems[i]);
        panelItemeElems[i].style.transform = `rotateY(${ unitDegree * i}deg) translateZ(${-dist}px)`;
        panelItemeElems[i].style.backgroundColor = data[i].color;
    };
};

function inactivatePanel() {
    if (currentPanelElem) {
        currentPanelElem.classList.remove('active');
    }
}

function setCurrentPanel() {
    inactivatePanel();
    currentPanelElem = panelItemeElems[currentIndex];
    currentPanelElem.classList.add('active');
}

function rotatePanel() {
    panelListElem.style.transform = `translateZ(${numberOfPanels * 100}px) rotateY(${-unitDegree * currentIndex}deg)`
    setCurrentPanel();
}

window.addEventListener('load', () => {
    setElems();

    // loaderElem.addEventListener('transitionend', () => {
    //     loaderElem.remove();
    // });

    // loaderElem.addEventListener('transitionend', function() {
    //     this.remove();
    //     console.log(this);
    // });

    loaderElem.addEventListener('transitionend', (e) => {
        e.currentTarget.remove();
        // console.log(e.currentTarget);
    });

    document.body.classList.remove('before-load');
    // console.log(loaderElem);

    setPanelItems();

    projectView = new ProjectView();

    // IntersectionObserver
    const io = new IntersectionObserver((entries, observer) => {
        // 눈에 보이기 시작한 객체 isIntersecting : true
        // 완전히 눈에서 사라진 객체 isIntersecting : false
        // console.log(entries);

        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting == true) {
                // isIntersecting이 true라면
                // console.log(entries[i].target.dataset.projectIndex);
                // entries[i].target.dataset.projectIndex

                // 첫번째 프로젝트 처리
                if (entries[i].target.classList.contains('content-observer-start')) {
                    currentIndex = 0;
                    rotatePanel();
                    continue;
                }

                const projectIndex = entries[i].target.dataset.projectIndex*1
                if (projectIndex >= 0) {
                    if (scrollDirection === 'up') {
                        currentIndex = projectIndex + 1;
                    } else {
                        currentIndex = projectIndex;
                    }
    
                    if (currentIndex < numberOfPanels) {
                        rotatePanel();
                    }
                }

                // 맨 위로 올라갔을 때
                if (
                    scrollDirection === 'up' &&
                    entries[i].target.classList.contains('header-content')
                    ) {
                        panelListElem.style.transform = `translateZ(0) rotateY(0deg)`;
                        inactivatePanel()
                    }

                // 마지막 프로젝트를 지났을 때
                if (
                    scrollDirection === 'down' &&
                    entries[i].target.classList.contains('content-observer-end')
                ) {
                    panelsElem.classList.add('static-position');
                }

                // 마지막 프로젝트에서 올라갈 때
                if (
                    scrollDirection === 'up' &&
                    currentIndex === numberOfPanels - 1
                ) {
                    panelsElem.classList.remove('static-position');
                }
            };
        };
        console.log(scrollDirection);
        console.log(currentIndex);
    });

    observerElems.forEach((item, i) => {
        // console.log(item);
        // console.log(i);
        io.observe(item);
    });

    
    window.addEventListener('scroll', () => {
        // console.log('scroll');
        // prevPageYOffset = window.pageYOffset
        if (prevPageYOffset > window.pageYOffset) {
            scrollDirection = 'up';
        } else {
            scrollDirection = 'down';
        }
        prevPageYOffset = window.pageYOffset;

        // console.log(scrollDirection);
    });

    porjectListElem.addEventListener('click', e => {
        console.log(e.target);
        if (e.target.classList.contains('project-btn')) {
            projectView.show(data[ e.target.dataset.projectIndex ]);
        }
    });

});