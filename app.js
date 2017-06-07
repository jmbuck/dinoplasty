const app = {
    init(formSelector) {
        document
            .querySelector(formSelector)
            .addEventListener('submit', this.addDino.bind(this));
        this.max = 0;
    
    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value,
            id: this.max+1,
        };

        console.log(dino.name, dino.id);
        ++this.max;
    },

};

app.init('#dino-form');