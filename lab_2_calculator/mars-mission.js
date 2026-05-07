window.onload = function(){
    // Переменные для хранения чисел и операций
    let a = '';           // Первое число
    let b = '';           // Второе число
    let expressionResult = '';  // Результат вычисления
    let selectedOperation = null;  // Выбранная операция
    let justCalculated = false; // Флаг: только что было вычисление

    // Получаем доступ к экрану калькулятора в поле вывода
    const outputElement = document.getElementById("result");

    // Получаем все кнопки с цифрами (их id начинаются с "btn_digit_")
    const digitButtons = document.querySelectorAll('[id^="btn_digit_"]');

    function onDigitButtonClicked(digit) {
        // Если только что было вычисление или отображается результат миссии
        if (justCalculated || outputElement.innerHTML.includes('МИССИЯ') ||
            outputElement.innerHTML.includes('Груз:') || outputElement.innerHTML.includes('Ошибка')) {
            // Очищаем всё и начинаем ввод нового числа
            a = '';
            b = '';
            selectedOperation = null;
            justCalculated = false;
        }

        // Если операция не выбрана, работаем с первым числом (a)
        if (!selectedOperation) {
            // проверяем, чтобы не было двух точек в числе
            if ((digit !== '.') || (digit === '.' && !a.includes('.'))) {
                a += digit;
            }
            outputElement.innerHTML = a;
            outputElement.style.fontSize = '1.3rem';
            outputElement.style.whiteSpace = 'pre-wrap';
        }
        // Если операция выбрана, работаем со вторым числом (b)
        else {
            if ((digit !== '.') || (digit === '.' && !b.includes('.'))) {
                b += digit;
                outputElement.innerHTML = b;
                outputElement.style.fontSize = '1.3rem';
                outputElement.style.whiteSpace = 'pre-wrap';
            }
        }
    }

    // Настраиваем обработчики для цифровых кнопок
    digitButtons.forEach(button => {
        button.onclick = function() {
            const digitValue = button.innerHTML;
            onDigitButtonClicked(digitValue);
        };
    });

    // Настраиваем обработчики для кнопок операций
    document.getElementById("btn_op_mult").onclick = function() {
        if (a === '') return;
        selectedOperation = 'x';
        justCalculated = false;
    };

    document.getElementById("btn_op_plus").onclick = function() {
        if (a === '') return;
        selectedOperation = '+';
        justCalculated = false;
    };

    document.getElementById("btn_op_minus").onclick = function() {
        if (a === '') return;
        selectedOperation = '-';
        justCalculated = false;
    };

    document.getElementById("btn_op_div").onclick = function() {
        if (a === '') return;
        selectedOperation = '/';
        justCalculated = false;
    };

    // Вычисляем результат при нажатии на =
    document.getElementById("btn_op_equal").onclick = function() {
        if (a === '' || b === '' || !selectedOperation)
            return;

        switch(selectedOperation) {
            case 'x':
                expressionResult = (+a) * (+b);
                break;
            case '+':
                expressionResult = (+a) + (+b);
                break;
            case '-':
                expressionResult = (+a) - (+b);
                break;
            case '/':
                if (+b === 0) {
                    outputElement.innerHTML = "Ошибка";
                    justCalculated = true;
                    return;
                }
                expressionResult = (+a) / (+b);
                break;
            default:
                break;
        }

        a = expressionResult.toString();
        b = '';
        selectedOperation = null;
        outputElement.innerHTML = a;
        justCalculated = true; // помечаем что было вычисление
        // сбрасываем стили дисплея на обычные
        outputElement.style.fontSize = '1.3rem';
        outputElement.style.whiteSpace = 'pre-wrap';
    };

    // Кнопка очистки
    document.getElementById("btn_op_clear").onclick = function() {
        a = '';
        b = '';
        selectedOperation = null;
        expressionResult = '';
        justCalculated = false;
        outputElement.innerHTML = '0';
        outputElement.style.fontSize = '1.3rem';
        outputElement.style.whiteSpace = 'pre-wrap';
    };

    // Кнопка смены знака
    document.getElementById("btn_op_sign").onclick = function() {
        if (!selectedOperation) {
            if (a !== '' && a !== '0') {
                if (a.startsWith('-')) {
                    a = a.substring(1);
                } else {
                    a = '-' + a;
                }
                outputElement.innerHTML = a;
            }
        } else {
            if (b !== '' && b !== '0') {
                if (b.startsWith('-')) {
                    b = b.substring(1);
                } else {
                    b = '-' + b;
                }
                outputElement.innerHTML = b;
            }
        }
    };

    // Кнопка процента
    document.getElementById("btn_op_percent").onclick = function() {
        if (!selectedOperation) {
            if (a !== '') {
                a = (+a / 100).toString();
                outputElement.innerHTML = a;
            }
        } else {
            if (b !== '') {
                b = (+b / 100).toString();
                outputElement.innerHTML = b;
            }
        }
    };

    // УНИКАЛЬНАЯ ФУНКЦИЯ: Расчет параметров доставки на Марс
    document.getElementById("btn_op_mars").onclick = function() {
        if (a === '') {
            outputElement.innerHTML = "Введите массу (тонн)";
            justCalculated = true;
            return;
        }

        const cargoMass = parseFloat(a);

        // Параметры миссии
        const distanceToMars = 225000000; // км (среднее расстояние)
        const starshipSpeed = 28000; // км/ч (орбитальная скорость)
        const fuelPerTon = 3.5; // тонны топлива на тонну груза
        const costPerTon = 10000000; // $10 млн за тонну
        const flightTimeHours = distanceToMars / starshipSpeed;
        const flightTimeDays = flightTimeHours / 24;

        // Расчет параметров
        const requiredFuel = cargoMass * fuelPerTon;
        const totalCost = cargoMass * costPerTon;
        const co2Saved = cargoMass * 2.5; // тонны CO2 (сравнение с авиацией)

        // Окно запуска (каждые 26 месяцев)
        const nextWindow = "Май 2026";

        // Формируем текст результата
        let result = `  МИССИЯ НА МАРС\n\n`;
        result += `Груз: ${cargoMass.toFixed(2)} тонн\n`;
        result += `Время: ${flightTimeDays.toFixed(1)} дней\n`;
        result += `Топливо: ${requiredFuel.toFixed(2)} т\n`;
        result += `Цена: $${(totalCost / 1000000).toFixed(1)} млн`;

        outputElement.style.fontSize = '14px';
        outputElement.style.lineHeight = '1.5';
        outputElement.style.whiteSpace = 'pre-wrap'; // разрешаем перенос строк
        outputElement.innerHTML = result;

        justCalculated = true; // помечаем что было специальное вычисление

        // Сброс для следующего расчета
        a = '';
        b = '';
        selectedOperation = null;
    };
};
