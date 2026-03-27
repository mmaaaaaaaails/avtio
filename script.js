(function() {
    'use strict';

    console.log('🚀 Скрипт поиска ссылки Авито (v2) запущен!');

    function findAndCopyLink() {
        const fieldId = '11136';
        let foundLink = null;

        // 1. Пытаемся найти ссылку во всех фреймах на странице
        const frames = document.querySelectorAll('iframe');
        
        frames.forEach((frame) => {
            try {
                // Заглядываем внутрь фрейма (если позволяет безопасность)
                const frameDoc = frame.contentDocument || frame.contentWindow.document;
                const linkInFrame = frameDoc.querySelector('a[href*="avito.ru"]');
                if (linkInFrame) {
                    foundLink = linkInFrame.href;
                }
            } catch (e) {
                // Если фрейм с другого домена (CORS), мы не сможем прочитать его DOM напрямую
            }
        });

        // 2. Если во фреймах не нашли, ищем по всей странице (на случай если это не фрейм)
        if (!foundLink) {
            const linkOnPage = document.querySelector('a[href*="avito.ru"]');
            if (linkOnPage) foundLink = linkOnPage.href;
        }

        if (foundLink) {
            console.log('✅ Ссылка Авито найдена:', foundLink);
            
            // 3. Ищем поле в Омнидеске
            const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) || 
                          document.getElementById(`custom_field_${fieldId}`);

            if (field) {
                if (!field.value) {
                    field.value = foundLink;
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('🎉 Ссылка вставлена в поле 11136!');
                } else {
                    console.log('ℹ️ Поле уже заполнено.');
                }
            } else {
                console.error('❌ Не нашли поле 11136, проверьте, открыт ли тикет.');
            }
        } else {
            console.warn('⚠️ Ссылка Авито пока не появилась. Проверяю еще раз через 3 сек...');
            setTimeout(findAndCopyLink, 3000); // Рекурсивный поиск
        }
    }

    // Запуск через 4 секунды (даем виджету время на загрузку)
    setTimeout(findAndCopyLink, 4000);
})();
