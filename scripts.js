;(function (document) {
    const calendarYear = document.getElementById('year');
    const calendarMonth = document.getElementById('month');
    const calendarDaysTb = document.getElementsByClassName('daysTb');
    const calendarWeekdaysTb = document.getElementsByClassName('weekDaysTb')[0];
    const prevYearButton = document.getElementsByClassName('prevYear')[0];
    const nextYearButton = document.getElementsByClassName('nextYear')[0];
    const prevMonthButton = document.getElementsByClassName('prevMonth')[0];
    const nextMonthButton = document.getElementsByClassName('nextMonth')[0];

    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const weekdayArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let curTime = new Date();
    let curYear = curTime.getFullYear();
    let curMonth = curTime.getMonth();
    // let curDay = new Date().getUTCDay();

    function initCalendar() {
        //Adding the current year and month
        calendarYear.innerText = curYear;
        calendarMonth.innerText = monthArray[curMonth];

        //Feeling the weekdays on calendar
        for (let i = 0; i < weekdayArray.length; i++) {
            let thNodes = document.createElement('TH');
            let textNodes = document.createTextNode(weekdayArray[i]);
            thNodes.appendChild(textNodes);
            calendarWeekdaysTb.appendChild(thNodes);
        }

        //Feeling all days in calendar
        let currentMonthsDaysArray = getDaysInMonth(curMonth, curYear);
        let startsFrom = currentMonthsDaysArray[0].getDay() - 1;
        let endsOn = currentMonthsDaysArray[currentMonthsDaysArray.length - 1].getUTCDate() + 1;
        let dayController = 0;
        let day = 0;

        for (let i = 0; i < calendarDaysTb.length; i++) {
            for (let j = 0; j < 7; j++) {
                let tdNodes = document.createElement('TD');
                let tdAppendedNode = calendarDaysTb[i].appendChild(tdNodes);

                if  (dayController >= startsFrom && day < endsOn) {
                    let textNodes = document.createTextNode(day + 1);
                    day++;
                    tdAppendedNode.appendChild(textNodes);
                }
                dayController++;
            }
        }
    }

    function getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
           days.push(new Date(date));
           date.setDate(date.getDate() + 1);
        }
        return days;
    }

    function removeInit() {
        while (calendarWeekdaysTb.firstChild) {
            calendarWeekdaysTb.removeChild(calendarWeekdaysTb.firstChild);
        }

        for (let i = 0; i < calendarDaysTb.length; i++) {
            while (calendarDaysTb[i].firstChild) {
                calendarDaysTb[i].removeChild(calendarDaysTb[i].firstChild);
            }
        }
    }

    function prevYear() {
        removeInit();
        curTime = new Date(curTime.setFullYear(curYear - 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
    }

    function nextYear() {
        removeInit();
        curTime = new Date(curTime.setFullYear(curYear + 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
    }

    function prevMonth() {
        removeInit();
        curTime = new Date(curTime.setMonth(curMonth - 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
    }

    function nextMonth() {
        removeInit();
        curTime = new Date(curTime.setMonth(curMonth + 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
    }


    //Adding event listeners
    prevYearButton.addEventListener('click', prevYear);
    nextYearButton.addEventListener('click', nextYear);
    prevMonthButton.addEventListener('click', prevMonth);
    nextMonthButton.addEventListener('click', nextMonth);

    initCalendar();
})(document);