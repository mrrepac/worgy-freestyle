const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Отключаем аппаратное ускорение если есть проблемы с рендерингом
// app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 420,
        height: 700,
        minWidth: 360,
        minHeight: 600,
        maxWidth: 500,
        resizable: true,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        backgroundColor: '#0a0a0a',
        show: false, // Показываем после загрузки
        autoHideMenuBar: true // Скрываем меню для более чистого вида
    });

    // Убираем меню полностью
    Menu.setApplicationMenu(null);

    // Загружаем HTML
    mainWindow.loadFile('index.html');

    // Показываем окно когда готово (избегаем белого экрана)
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Открываем внешние ссылки в системном браузере
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    // Открываем DevTools только в режиме разработки
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Запуск приложения
app.whenReady().then(createWindow);

// Закрытие при закрытии всех окон (для Windows/Linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Для macOS - пересоздаём окно при клике на иконку в доке
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

