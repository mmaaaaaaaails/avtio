(function() {
    'use strict';

    const fieldId = '11136'; // ID кастомного поля OmniDesk
    const checkInterval = 1500; // миллисекунды между проверками
    const maxAttempts = 40; // сколько раз проверять перед остановкой (~1 мин)
    let attempts = 0;

    // функция поиска ссылки Авито в DOM
    function extractAvitoLink() {
        const matches = document.body.innerHTML.match(/https?:\/\/[^\s"]*avito\.ru[^\s"]*/g);
        if (!matches) return null;

        const cleanLinks = matches.map(link => link.replace(/&amp;/g, '&'));
        return cleanLinks.find(link => !link.includes('/profile'));
    }

    // функция вставки ссылки в кастомное поле
    function insertLink(link) {
        const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) ||
                      document.getElementById(`custom_field_${fieldId}`);
        if (!field) return false;

        if (!field.value) {
            field.value = link;
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('🎉 Ссылка Авито вставлена:', link);
        } else {
            console.log('ℹ️ Поле уже заполнено');
        }
        return true;
    }

    // основной цикл проверки
    const intervalId = setInterval(() => {
        attempts++;
        const link = extractAvitoLink();
        if (link) {
            insertLink(link);
            clearInterval(intervalId);
            console.log('✅ Авто-подстановка завершена');
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            console.warn('❌ Ссылка Авито не найдена после ожидания');
        } else {
            console.log(`⏳ Попытка ${attempts}: ссылка ещё не появилась, ждем...`);
        }
    }, checkInterval);

})();