

const yes_button = document.getElementById('yes-button');
const cancel_button = document.getElementById('cancel-button');
const new_folder_input = document.getElementById('input');

cancel_button.addEventListener('click', () => {
   ipcRenderer.send('close-confirmation-window');
});

yes_button.addEventListener('click', () => {
    console.log('tt');
    ipcRenderer.send('confirmation-window-proceed');
    
    ipcRenderer.send('close-confirmation-window');
});