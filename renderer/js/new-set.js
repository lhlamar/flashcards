


const back_button = document.getElementById('back-button');



back_button.addEventListener('click', () => {
    console.log('test');
    ipcRenderer.send('open-home-window');
})
