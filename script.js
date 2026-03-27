(function() {
    'use strict';

    console.log('🚀 Скрипт Авито (observer) запущен!');

    const fieldId = '11136';

    function extractLink() {
        const matches = document.body.innerHTML.match(/https?:\/\/[^\s"]*avito\.ru[^\s"]*/g);

        if (matches && matches.length) {
            const cleanLinks = matches.map(link => link.replace(/&amp;/g, '&'));
            return cleanLinks.find(link => !link.includes('/profile'));
        }

        return null;
    }

    function insertLink(link) {
        const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) || 
                      document.getElementById(`custom_field_${fieldId}`);

        if (!field) {
            console.warn('❌ Поле не найдено');
            return false;
        }

        if (!field.value) {
            field.value = link;
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('🎉 Ссылка вставлена:', link);
        } else {
            console.log('ℹ️ Поле уже заполнено');
        }

        return true;
    }

    function tryProcess() {
        const link = extractLink();

        if (link) {
            console.log('✅ Найдена ссылка:', link);
            if (insertLink(link)) {
                observer.disconnect(); // останавливаем наблюдение
            }
        }
    }

    // 👀 Следим за изменениями DOM
    const observer = new MutationObserver(() => {
        tryProcess();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // первая попытка сразу
    tryProcess();

})();