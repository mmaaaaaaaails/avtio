/**
 * Скрипт для автоматического заполнения кастомного поля Омнидеска ссылкой на объявление Авито.
 */
(function() {
    'use strict';

    const fieldId = '11136';
    console.log(`[Avito-Linker] Скрипт инициализирован. ID поля: ${fieldId}`);

    function processAvitoLink() {
        // 1. Ищем ссылку
        const matches = document.body.innerHTML.match(/https?:\/\/(www\.)?avito\.ru\/[^\s"']+/g);
        const link = matches ? matches.find(l => !l.includes('/profile')) : null;

        if (!link) return false; 

        // 2. Ищем поле
        const field = document.getElementById(`field_${fieldId}`) || 
                      document.querySelector(`[name="field_${fieldId}"]`) ||
                      document.querySelector(`[name="fields[${fieldId}]"]`);

        if (!field) return false;

        // 3. Вставляем
        if (!field.value) {
            field.value = link;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('%c[Avito-Linker] ✅ Ссылка успешно вставлена!', 'color: #2ecc71; font-weight: bold;');
            return true; 
        } else {
            console.log('[Avito-Linker] ℹ️ Поле уже заполнено.');
            return true; 
        }
    }

    // Функция запуска наблюдателя
    function startObserving() {
        console.log('[Avito-Linker] Начинаю слежку за DOM...');
        const observer = new MutationObserver((mutations, obs) => {
            if (processAvitoLink()) {
                obs.disconnect();
                console.log('[Avito-Linker] Задача выполнена, наблюдатель отключен.');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Сразу проверяем, вдруг всё уже загрузилось
        processAvitoLink();
    }

    // Ждем полной загрузки документа, чтобы document.body точно существовал
    if (document.body) {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }
})();
