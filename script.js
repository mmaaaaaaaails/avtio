(function() {
    'use strict';

    console.log('🚀 Скрипт поиска ссылки Авито (final) запущен!');

    const fieldId = '11136';
    let attempts = 0;
    const maxAttempts = 10;

    function findAndCopyLink() {
        attempts++;

        let foundLink = null;

        // 🔥 1. Самый надежный способ — ищем в HTML
        const matches = document.body.innerHTML.match(/https?:\/\/[^\s"]*avito\.ru[^\s"]*/g);

        if (matches && matches.length) {
            const cleanLinks = matches.map(link => link.replace(/&amp;/g, '&'));

            // берем ссылку на объявление (исключаем профиль)
            const adLink = cleanLinks.find(link => !link.includes('/profile'));

            if (adLink) {
                foundLink = adLink;
            }
        }

        // 🔁 2. fallback — ищем в iframe (на всякий случай)
        if (!foundLink) {
            const frames = document.querySelectorAll('iframe');

            frames.forEach((frame) => {
                if (frame.src && frame.src.includes('avito.ru')) {
                    foundLink = frame.src;
                }
            });
        }

        // 🔁 3. fallback — ищем обычные ссылки
        if (!foundLink) {
            const link = document.querySelector('a[href*="avito.ru"]');
            if (link) foundLink = link.href;
        }

        if (foundLink) {
            console.log('✅ Найдена ссылка Авито:', foundLink);

            const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) || 
                          document.getElementById(`custom_field_${fieldId}`);

            if (field) {
                if (!field.value) {
                    field.value = foundLink;
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('🎉 Ссылка вставлена в поле!');
                } else {
                    console.log('ℹ️ Поле уже заполнено');
                }
            } else {
                console.error('❌ Поле не найдено');
            }

        } else if (attempts < maxAttempts) {
            console.warn(`⏳ Попытка ${attempts}: ссылка не найдена, повтор через 3 сек...`);
            setTimeout(findAndCopyLink, 3000);
        } else {
            console.error('❌ Не удалось найти ссылку Авито');
        }
    }

    // даем время виджету загрузиться
    setTimeout(findAndCopyLink, 4000);
})();