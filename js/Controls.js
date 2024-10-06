class Controls {
    constructor(type) {
        this.jump = false;
        switch(type) {
            case "Player":
                this.#addKeyboardListener();
                this.#addMouseListener();
                break;
            case "AI":
                break;
        }
    }

    #addKeyboardListener() {
        document.addEventListener("keydown", (e) => {
            if (e.code === 'Space') {
                this.jump = true;
            }
        })
    }
    #addMouseListener() {
        addEventListener('click', (e) => {
            this.jump = true;
        })
    }
}