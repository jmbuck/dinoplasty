const app = {
    init(selectors) {
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.addDino.bind(this));
        this.max = 0;
        this.list = document.querySelector(selectors.listSelector);
        this.dinos = [];
    
    },

    renderListItem(dino) {
        const item = document.createElement('li');
        item.innerHTML =`
            <div class="input-group">
                <div class="input-group-field">${dino.name}</div>
                <div class="input-group-button">
                    <button type="button" id="${'like'+dino.id}" class="button">Like</button>
                </div>
                <div class="input-group-button">
                    <button type="button" id="${'del'+dino.id}" class="button">Delete</button>
                </div>
                <div class="input-group-button">
                    <button type="button" id="${'up'+dino.id}" class="button">Up</button>
                </div>
                <div class="input-group-button">
                    <button type="button" id="${'down'+dino.id}" class="button">Down</button>
                </div>
            </div>
        `;

        return item;
    },

    addEventListeners() {
        for(let i = 0; i < max; i++) {
            document.querySelector('#like'+id).addEventListener('click', this.like.bind(this));
            document.querySelector('#del'+id).addEventListener('click', this.delete.bind(this));
            document.querySelector('#up'+id).addEventListener('click', this.moveUp.bind(this));
            document.querySelector('#down'+id).addEventListener('click', this.moveDown.bind(this));
        }
    },

    like(event) {

    },

    delete(event) {

    },

    moveUp(event) {

    },

    moveDown(event) {

    },

    addDino(event) {
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value,
            id: this.max,
        };
        form.dinoName.value = '';

        this.list.insertBefore(this.renderListItem(dino), this.list.firstChild); 
        this.dinos.push(dino);

        this.addEventListeners();


        /*
            Add a promote/fav button 
            Add a delete button
            Add buttons to move a dinosaur up and down the list.
            Persist the dinosaur data using `window.localStorage`. The dinosaurs should stay
            in the list even when the page is refreshed.
            Edit button
        */
        this.max++;
    },
};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});