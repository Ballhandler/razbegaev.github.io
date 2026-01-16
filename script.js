document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const card = document.querySelector('.invitation-card');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const responseMessage = document.getElementById('responseMessage');
    
    // Конфигурация Telegram бота
    // ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ!
    const TELEGRAM_BOT_TOKEN = '8531904307:AAGwQ-dsKn8B32fSgPx8YoHrSXKM_COEvw0';
    const TELEGRAM_CHAT_ID = '468095537';
    
    // Адрес API для отправки сообщений в Telegram
    const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const audio = new Audio(); // Создаем аудио элемент
    let isAudioPlaying = false;
    
    const TRACK_URL = './fon.mp3';

    audio.src = TRACK_URL;
    audio.loop = true; // Зациклить воспроизведение
    audio.volume = 0.5; // Громкость 50%

    // Переворот открытки
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');

            // Воспроизведение/пауза аудио
        if (!isAudioPlaying) {
            // Запускаем воспроизведение
            audio.play().then(() => {
                isAudioPlaying = true;
                console.log('Музыка включена');
                
                // Добавляем визуальную индикацию
                const indicator = document.createElement('div');
                indicator.id = 'audio-indicator';
                indicator.innerHTML = '<i class="fas fa-music"></i> Музыка играет';
                indicator.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(155, 89, 182, 0.0);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    animation: fadeIn 0.5s ease;
                `;
                document.body.appendChild(indicator);
                
                // Кнопка остановки музыки
                const stopBtn = document.createElement('button');
                stopBtn.innerHTML = '<i class="fas fa-stop"></i>';
                stopBtn.style.cssText = `
                    background: transparent;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 16px;
                `;
                stopBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    audio.pause();
                    audio.currentTime = 0;
                    isAudioPlaying = false;
                    indicator.remove();
                });
                indicator.appendChild(stopBtn);
            }).catch(error => {
                console.error('Ошибка воспроизведения:', error);
                alert('Для воспроизведения музыки требуется взаимодействие с пользователем. Нажмите на кнопку ответа или обновите страницу.');
            });
        }

    });
    
    let userName = localStorage.getItem('userName');

    if (userName === 'Даня'||
        userName === 'Карина'||
        userName === 'Вова'||
        userName === 'Катя'||
        userName === 'Коля'||
        userName === 'Арина'||
        userName === 'Кирилл'||
        userName === 'Максим'||
        userName === 'Кристина'
        ){


        // Функция отправки уведомления в Telegram
        async function sendTelegramNotification(response) {
            const message = response === 'yes' 
                ? `🎉 Отличные новости! ${userName} подтвердил участие в вашем дне рождения!` 
                : `😔 К сожалению, ${userName} не сможет прийти на ваш день рождения.`;
            
            const data = {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            };
            
            try {
                const response = await fetch(TELEGRAM_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                return result.ok;
            } catch (error) {
                console.error('Ошибка отправки:', error);
                return false;
            }
        }
        
        // Обработка ответа пользователя
        async function handleUserResponse(response) {

            // Показываем сообщение пользователю
            if (response === 'yes') {
                responseMessage.textContent = `Ура, ${userName}! Жду тебя на празднике! Не забудь аппетит и хорошее настроение. Костюм марионетки необязателен!🎉`;
                responseMessage.className = 'response-message success';
            } else {
                responseMessage.textContent = `Очень жаль, ${userName}! Буду скучать! ❤️`;
                responseMessage.className = 'response-message success';
            }
            
            // Отправляем уведомление в Telegram
            const success = await sendTelegramNotification(response);
            
            if (!success) {
                console.log('Уведомление не отправлено - проверьте настройки бота');
                responseMessage.className = 'response-message error';
            }
            
            // Блокируем кнопки после ответа
            yesBtn.disabled = true;
            noBtn.disabled = true;
            yesBtn.style.opacity = '0.6';
            noBtn.style.opacity = '0.6';
            
            // Добавляем анимацию
            if (response === 'yes') {
                celebrate();
            }
        }
        
        // Обработчики кнопок
        yesBtn.addEventListener('click', () => handleUserResponse('yes'));
        noBtn.addEventListener('click', () => handleUserResponse('no'));
        
        // Функция праздничной анимации
        function celebrate() {
            const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#2ecc71', '#9b59b6'];
            
            for (let i = 0; i < 50; i++) {
                createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }
        }
        
        function createConfetti(color) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = color;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 15 + 10 + 'px';
            confetti.style.position = 'fixed';
            confetti.style.top = '-20px';
            confetti.style.zIndex = '9999';
            confetti.style.borderRadius = '0';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    } else { setTimeout(() => {
            alert(`Не ломай сайт, бяка!!!`);
        }, 500);}
    
    // Заполняем данные приглашения (замените на свои)
    function populateInvitationData() {
        const invitationData = {
            name: 'Дима',
            date: '24 января 2026',
            time: '14:00',
            place: 'ул.Вертолетчиков д.13, кв.300',
            hostName: 'Дмитрий'
        };
        
        // Заполняем данные в открытке
        document.querySelectorAll('.invitation-details p strong').forEach(el => {
            const text = el.parentElement.textContent;
            if (text.includes('Именинник')) {
                el.nextSibling.textContent = ' ' + invitationData.name;
            } else if (text.includes('Дата')) {
                el.nextSibling.textContent = ' ' + invitationData.date;
            } else if (text.includes('Время')) {
                el.nextSibling.textContent = ' ' + invitationData.time;
            } else if (text.includes('Место')) {
                el.nextSibling.textContent = ' ' + invitationData.place;
            }
        });
        
        // Заполняем имя в подвале
        document.querySelector('.footer .name').textContent = invitationData.hostName;
    }
    
    // Запускаем заполнение данных
    populateInvitationData();
    
    // Инструкция по настройке Telegram бота
    console.log(`
    ====================================================
    ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM УВЕДОМЛЕНИЙ:
    
    1. Создайте бота через @BotFather в Telegram
    2. Получите токен бота
    3. Узнайте свой Chat ID:
       - Напишите что-нибудь вашему боту
       - Перейдите по ссылке: https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
       - Найдите "chat":{"id":ВАШ_ID
    4. Замените в файле script.js:
       - TELEGRAM_BOT_TOKEN на токен вашего бота
       - TELEGRAM_CHAT_ID на ваш Chat ID
    ====================================================
    `);

});