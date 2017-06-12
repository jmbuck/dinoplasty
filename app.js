const app = {
    init(selectors) {
        document
            .querySelector(selectors.formSelector)
            .addEventListener('submit', this.handleSubmit.bind(this));
        this.max = 0;
        this.list = document.querySelector(selectors.listSelector);
        this.load();
    },

    load() {       
        //If localStorage has data (isn't null), parse it and update list and data array,
        //Reassign IDs so they remain unique
        this.dinos = JSON.parse(localStorage.getItem('dinos'));
        if(this.dinos) {
            this.dinos.map((dino) => {
                dino.id = this.max;
                this.addDino(dino)
                const icon = document.querySelector(`[data-id="${dino.id}"] .like>i`)
                if(dino.liked === true) {
                    icon.textContent = 'favorite';
                }
            })
        }
        else {
             this.dinos = [];
        }
    },

    save() {
        localStorage.setItem('dinos', JSON.stringify(this.dinos))
    },

    createListItem(dino) {
        //Creates list item with unique IDs for each button
        const listItem = document.createElement('li');
        listItem.innerHTML =`
            <div class="input-group">
                <div class="input-group-field name">${dino.name}</div>
                <div class="input-group-button">
                    <div class="editName">
                        <i class="material-icons" style="font-size: 36px">edit</i>
                    </div>
                </div>
                <div class="input-group-field era">${dino.era}</div>
                <div class="input-group-button">
                    <div class="editEra">
                        <i class="material-icons" style="font-size: 36px">edit</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="like">
                        <i class="material-icons" style="font-size: 36px">favorite_border</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="delete">
                        <i class="material-icons" style="font-size: 36px">delete</i>
                    </div>
                </div>
                <div class="input-group-button">
                    <div class="up">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_up</i>
                    </div>
                </div>  
                <div class="input-group-button">
                      <div class="down">
                        <i class="material-icons" style="font-size: 36px">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>
        `;

        this.addEventListeners(listItem);
        listItem.dataset.id = dino.id;
        if(dino.liked === true) {
            listItem.style.backgroundColor = '#EDCB96';
        }
        return listItem;
    },

    addEventListeners(listItem) {
        //click events
        listItem.querySelector('.like').addEventListener('click', this.like.bind(this));
        listItem.querySelector('.delete').addEventListener('click', this.delete.bind(this));
        listItem.querySelector('.up').addEventListener('click', this.moveUp.bind(this));
        listItem.querySelector('.down').addEventListener('click', this.moveDown.bind(this));
        listItem.querySelector('.editName').addEventListener('mousedown', (e) => {
                                                                this.edit(e, 'name')});
        listItem.querySelector('.editEra').addEventListener('mousedown', (e) => {
                                                                this.edit(e, 'era')});

        //hover events on delete
        listItem.querySelector('.delete').addEventListener('mouseover', function(event) {
            event.target.innerHTML = 'delete_forever';
        } );
        listItem.querySelector('.delete').addEventListener('mouseout', function(event) {
            event.target.innerHTML = 'delete';
        });
    },

    edit(e, f) {
        e.preventDefault();
        const icon = e.target;
        const listItem = icon.closest('li');
        const field = listItem.querySelector(`.${f}`);
        
        if(icon.textContent === 'edit') {
            //Change button icon, store original text, and focus user on textbox
            icon.textContent = 'check'
            if(f === 'name') 
                this.oldName = field.textContent;
            else
                this.oldEra = field.textContent;
            field.setAttribute('contenteditable', 'true');
            field.textContent = '';
            field.focus();

            field.addEventListener('keydown', (e) => {
                if(e.keyCode == 13) { //Enter keypress
                    //Complete editing
                    this.finishEditing(field, icon, true)
                } 
                if(e.keyCode == 27) { //Escape keypress
                    //Cancel editing
                    this.finishEditing(field, icon, false);
                }
            })

            field.addEventListener('blur', (e) => {
                //If user clicks out of textbox, cancel editing
                if(field.getAttribute('contenteditable') === 'true') {
                     this.finishEditing(field, icon, false);
                }
            })
        } else {
            //User clicks button to complete editing
            this.finishEditing(field, icon, true);
        }
        
    },

    finishEditing(field, icon, changed) {
        if(field.textContent === '' || !changed) {
            if(field.classList.contains('name'))
                field.textContent = this.oldName;
            else 
                field.textContent = this.oldEra;
        } 
        icon.textContent = 'edit';
        field.setAttribute('contenteditable', 'false');
        if(changed) {
            const listItem = icon.closest('li');
            for(let i = 0; i < this.dinos.length; i++) {
                if(this.dinos[i].id === parseInt(listItem.dataset.id)) {
                    if(field.classList.contains('name'))  this.dinos[i].name = field.textContent;
                    else  this.dinos[i].era = field.textContent;  
                    this.save();
                    break;
                }
            }
        }
    },

    like(event) {
        const icon = event.target;
        const listItem = icon.closest('li');
        let dino;
        //Searches the dinos array for id matching listItem id
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id === parseInt(listItem.dataset.id)) {
                dino = this.dinos[i];
                break;
            }
        }

        //Toggles button text and background color
        if(icon.innerHTML === 'favorite_border') {
            listItem.style.backgroundColor = '#EDCB96';
            icon.textContent = 'favorite';
            dino.liked = true;
        } else {
            listItem.style.backgroundColor = '#9E7682';
            icon.textContent = 'favorite_border';
            dino.liked = false;
        }
        this.save();
    },

    delete(event) {
        const icon = event.target;
        const listItem = icon.closest('li');
        //Searches the dinos array for id matching listItem id
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id === parseInt(listItem.dataset.id)) {
                this.dinos.splice(i, 1);
                this.save();
                listItem.remove();
                break;
            }
        }
    },

    moveUp(event) {      
        const listItem = event.target.closest('li');
        //Searches the dinos array for id matching listItem id
        //and swaps the element with the next in the array (up in the list)
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id === parseInt(listItem.dataset.id)) {
                if(i < this.dinos.length-1) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i+1];
                    this.dinos[i+1] = temp;
                    listItem.parentNode.insertBefore(listItem, listItem.previousSibling)
                    this.save();
                    break;
                }
            }
        }
    },

    moveDown(event) {
        const listItem = event.target.closest('li');
        //Searches the dinos array for id matching listItem id
        //and swaps the element with the previous in the array (down in the list)
        for(let i = 0; i < this.dinos.length; i++) {
            if(this.dinos[i].id === parseInt(listItem.dataset.id)) {
                if(i > 0) {
                    let temp = this.dinos[i];
                    this.dinos[i] = this.dinos[i-1];
                    this.dinos[i-1] = temp;
                    listItem.parentNode.insertBefore(listItem.nextSibling, listItem);
                    this.save();
                    break;
                }
            }
        }
    },

    handleSubmit(event) {
        //Create dino object
        event.preventDefault();
        const form = event.target;
        const dino = { 
            name: form.dinoName.value.trim(),
            era: form.dinoEra.value.trim(),
            id: this.max,
            liked: false,
        };

        //Add dino onto array and list
        this.dinos.push(dino);
        this.addDino(dino);
        form.reset();
    },

    addDino(dino) {
        //Insert into start of list and dinos array
        const listItem = this.createListItem(dino)
        this.list.insertBefore(listItem, this.list.firstChild); 
       
        //Save data in local storage
        this.save();
        this.max++;
    },
};

app.init({
    formSelector: '#dino-form',
    listSelector: '#dino-list',
});

/*
    Change listItem HTML
    Add another field to the form (era, eating habits, etc), make sure that data also persists
    Improve CSS
    Edit names of dinosaurs, *content editable*, 
*/
    