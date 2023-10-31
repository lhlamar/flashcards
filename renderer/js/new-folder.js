


const done_button = document.getElementById('done-button');
const cancel_button = document.getElementById('cancel-button');
const new_folder_input = document.getElementById('input');

cancel_button.addEventListener('click', () => {
   ipcRenderer.send('close-new-folder-window');
});

done_button.addEventListener('click', () => {
    
    ipcRenderer.send('new-folder-request', new_folder_input.value);
    ipcRenderer.send('close-new-folder-window');
});