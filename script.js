/**
 * Скрипт для автоматического заполнения кастомного поля Омнидеска ссылкой на объявление Авито.
 */
(function() {
    'use strict';

    const fieldId = '11136';
    console.log(`[Avito-Linker] Скрипт запущен. Ожидаем появления данных... (ID поля: ${fieldId})`);

    function processAvitoLink() {
        // 1. Пытаемся извлечь ссылку из всего HTML страницы
        const matches = document.body.innerHTML.match(/https?:\/\/(www\.)?avito\.ru\/[^\s"']+/g);
        const link = matches ? matches.find(l => !l.includes('/profile')) : null;

        if (!link) {
            // Не пишем лог на каждую итерацию, чтобы не спамить консоль
            return false; 
        }

        console.log('[Avito-Linker] Найдена подходящая ссылка:', link);

        // 2. Ищем поле ввода
        const field = document.getElementById(`field_${fieldId}`) || 
                      document.querySelector(`[name="field_${fieldId}"]`) ||
                      document.querySelector(`[name="fields[${fieldId}]"]`);

        if (!field) {
            console.warn(`[Avito-Linker] ⚠️ Ссылка есть, но поле field_${fieldId} еще не отрисовано в DOM.`);
            return false;
        }

        // 3. Проверяем значение и вставляем
        if (!field.value) {
            field.value = link;
            // Триггерим события, чтобы система поняла, что данные изменились
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
            
            console.log('%c[Avito-Linker] ✅ УСПЕХ: Ссылка вставлена в поле!', 'color: #2ecc71; font-weight: bold;');
            return true; // Можно отключать наблюдение
        } else {
            console.log('[Avito-Linker] ℹ️ Поле уже заполнено значением:', field.value);
            return true; // Считаем задачу выполненной
        }
    }

    // Используем MutationObserver для динамических страниц (SPA)
    const observer = new MutationObserver(() => {
        if (processAvitoLink()) {
            console.log('[Avito-Linker] Работа завершена, отключаю наблюдатель.');
            observer.disconnect();
        }
    });

    // Запускаем слежку за изменениями в DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // На всякий случай запускаем проверку один раз сразу
    processAvitoLink();
})();
