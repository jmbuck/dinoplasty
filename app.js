const app = {
    init(selectors) {
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this));
        this.max = 0;
        this.list = document.querySelector(selectors.listSelector);
    
    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value,
            id: this.max+1,
        };

        this.list.appendChild(this.renderListItem(dino)); 

        console.log(dino.name, dino.id);
        ++this.max;
    },

    renderListItem(dino) {
        const item = document.createElement('li');
        item.textContent = dino.name;
        return item;
    },

};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});