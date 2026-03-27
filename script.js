console.log('avito')

(function() {
    'use strict';

    console.log('🚀 Скрипт для Авито (поле 11136) запущен!');

    function processAvitoLink() {
        const fieldId = '11136';
        
        // 1. Ищем ссылку Авито
        const avitoLinkElement = document.querySelector('a[href*="avito.ru"]');
        
        if (!avitoLinkElement) {
            console.warn('⚠️ Виджет Авито со ссылкой пока не найден на странице.');
            return;
        }

        const link = avitoLinkElement.href;
        console.log('✅ Ссылка Авито найдена:', link);

        // 2. Ищем кастомное поле в Омнидеске
        // Омнидеск часто использует ID вида "custom_field_11136" или имя "custom_fields[field_11136]"
        const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) || 
                      document.getElementById(`custom_field_${fieldId}`);

        if (field) {
            console.log('🔍 Кастомное поле 11136 обнаружено.');
            
            if (!field.value) {
                field.value = link;
                // Уведомляем систему об изменении, чтобы кнопка "Сохранить" стала активной
                field.dispatchEvent(new Event('change', { bubbles: true }));
                field.dispatchEvent(new Event('input', { bubbles: true }));
                
                console.log('🎉 Ссылка успешно вставлена в поле!');
            } else {
                console.log('ℹ️ В поле уже есть значение, перезапись не требуется.');
            }
        } else {
            console.error(`❌ Ошибка: Не удалось найти поле с ID ${fieldId} в интерфейсе.`);
        }
    }

    // Запускаем проверку через 3 секунды, чтобы интерфейс Омнидеска и виджеты успели прогрузиться
    console.log('⏳ Ожидание загрузки интерфейса...');
    setTimeout(processAvitoLink, 3000);
})();
