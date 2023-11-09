


const done_button = document.getElementById('done-button');
const cancel_button = document.getElementById('cancel-button');
const name_set_input = document.getElementById('input');

cancel_button.addEventListener('click', () => {
   ipcRenderer.sendSync('name-set-window-cancel');
});

done_button.addEventListener('click', () => {
    
    ipcRenderer.sendSync('name-set-window-done', name_set_input.value);
});