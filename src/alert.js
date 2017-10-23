ipcRenderer.on('alertMessage', (event, arg) => {
    document.getElementById('alertText').textContent = arg;
});
