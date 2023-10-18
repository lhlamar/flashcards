const new_folder_button = document.getElementById('new-folder-button');

new_folder_button.addEventListener('click', () => {
    ipcRenderer.send('open-new-set-window');
})