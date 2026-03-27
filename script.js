(function() {
    'use strict';

    const fieldId = '11136';

    // 🔥 Функция для поиска и вставки ссылки
    function insertAvitoLink() {
        const matches = document.body.innerHTML.match(/https?:\/\/[^\s"]*avito\.ru[^\s"]*/g);

        if (matches && matches.length) {
            const cleanLinks = matches.map(link => link.replace(/&amp;/g, '&'));
            const adLink = cleanLinks.find(link => !link.includes('/profile'));
            if (adLink) {
                const field = document.querySelector(`[name="custom_fields[field_${fieldId}]"]`) ||
                              document.getElementById(`custom_field_${fieldId}`);
                if (field && !field.value) {
                    field.value = adLink;
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('🎉 Ссылка Авито вставлена:', adLink);
                    return true;
                }
            }
        }
        return false;
    }

    // 🔹 Патчим LazyLoadAvito, если есть
    if (window.LazyLoadAvito) {
        const original = window.LazyLoadAvito;
        window.LazyLoadAvito = function(...args) {
            const result = original.apply(this, args);
            setTimeout(() => insertAvitoLink(), 500); // даём время вставить данные
            return result;
        };
        console.log('✅ LazyLoadAvito патчен — ждём подгрузки данных...');
    }

    // 🔹 Патчим xajax_LoadAvitoInfo, если есть
    if (window.xajax_LoadAvitoInfo) {
        const original = window.xajax_LoadAvitoInfo;
        window.xajax_LoadAvitoInfo = function(...args) {
            const result = original.apply(this, args);
            setTimeout(() => insertAvitoLink(), 500);
            return result;
        };
        console.log('✅ xajax_LoadAvitoInfo патчен — ждём подгрузки данных...');
    }

    // 🔹 Первая попытка сразу (на случай, если данные уже есть)
    setTimeout(() => {
        if (!insertAvitoLink()) {
            console.log('⏳ Ссылка пока не найдена, ждём подгрузки виджета...');
        }
    }, 1000);

})();