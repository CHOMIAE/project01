export class ProjectView {
    constructor() {
        // console.log('ProjectView');
        this.bodyElem = document.createElement('div');
        // console.log(this.bodyElem);
        this.bodyElem.classList.add('cover-panel');
        document.body.appendChild(this.bodyElem);

        // this.show();

        this.bodyElem.addEventListener('click', e => {
            if (e.target.classList.contains('back-btn')) {
                this.hide();
            }
        });
    };

    show(data) {
        document.body.classList.add('scroll-lock');
        this.bodyElem.style.backgroundColor = data.color;
        this.bodyElem.innerHTML = `
        <section class="project-view">
			<button class="back-btn"><span></span></button>
			<header class="project-view-header">
				<div class="width-setter">
					<h1 class="project-view-title">${data.title}</h1>
				</div>
			</header>
			<div class="project-view-content width-setter">
				<figure class="project-view-image">
					<img src="${data.image}" alt="${data.title}" class="project-view-image01">
                    <img src="${data.gif}" alt="${data.title}" class="project-view-image02">
                    <img src="${data.image_02}" alt="${data.title}" class="project-view-image03">
                    <img src="${data.image_03}" alt="${data.title}" class="project-view-image04">
                    <img src="${data.image_04}" alt="${data.title}" class="project-view-image05">
				</figure>
				<div class="project-view-desc width-setter">
                    ${data.description}
				</div>
			</div>
		</section>
        `;

        const timerId = setTimeout(() => {
            this.bodyElem.classList.add('active');
            clearTimeout(timerId);
        }, 10);
        

    }

    hide() {
        document.body.classList.remove('scroll-lock');
        this.bodyElem.classList.add('close');
        
        const timerId = setTimeout(() => {
            this.bodyElem.classList.remove('active', 'close');
            clearTimeout(timerId);
        }, 1000);
        
    }
};