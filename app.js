const app = {
    init(formSelector) {
        document
            .querySelector(formSelector)
            .addEventListener('submit', this.addDino.bind(this));
    
    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dinoName = form.dinoName.value;
    },

}

app.init('#dino-form');