;(function (document) {
    const calendarYear = document.getElementById('year');
    const calendarMonth = document.getElementById('month');
    const calendarDaysTb = document.getElementsByClassName('daysTb');
    const calendarWeekdaysTb = document.getElementsByClassName('weekDaysTb')[0];
    const prevYearButton = document.getElementsByClassName('prevYear')[0];
    const nextYearButton = document.getElementsByClassName('nextYear')[0];
    const prevMonthButton = document.getElementsByClassName('prevMonth')[0];
    const nextMonthButton = document.getElementsByClassName('nextMonth')[0];
    const eventsTable = document.getElementById('eventsTable');

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
                    tdAppendedNode.appendChild(textNodes);
                    tdAppendedNode.addEventListener('click', function(e){
                        onCreateEvent(e);
                    });
                    day++;
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

    function onCreateEvent(onEvent, day, dayNumber) {
        let newEventObject;
        let newEventArray;
        let eventNode = document.createElement('SPAN');
        let tableRowNode = document.createElement('TR');
        let tableCellNode = document.createElement('TD');
        let id = (new Date()).getTime();
        let eventTitle = prompt('Event Title');
        let eventBody = prompt('Event Body');
        let date = new Date(curTime.getFullYear(), curTime.getMonth(), (dayNumber || parseInt(onEvent.target.innerText)));

        //Checks data validity and makes objects/arrays
        if (id && eventTitle && eventBody && date) {
            newEventObject = {id, eventTitle, eventBody, date};
            newEventArray = [id, eventTitle, eventBody, date];
        } else {
            alert('Please enter valid data.');
            return;
        }

        //Creating events table DOM
        eventNode.id = id;
        eventNode.innerHTML = eventTitle;
        localStorage.setItem(id, JSON.stringify(newEventObject));

        if (day) {
            day.classList.add("withEvent");
            day.appendChild(eventNode);
        } else {
            onEvent.target.classList.add("withEvent");
            onEvent.target.appendChild(eventNode);
        }

        for (let i = 0; i < 5; i++) {
            if (i < 4) {
                tableCellNode.innerHTML = newEventArray[i];
            } else {
                tableCellNode.innerHTML = '<button type="button" id="up' + id + '">Update</button><button type="button" id="del' + id + '">Delete</button>';
            }
            tableRowNode.appendChild(tableCellNode.cloneNode(true));
        }
        eventsTable.appendChild(tableRowNode);

        //Adding event listeners for buttons
        document.getElementById('up' + id).addEventListener('click', function(e) {
            onUpdateEvent(e);
        }); 
        document.getElementById('del' + id).addEventListener('click', function(e) {
            onDeleteEvent(e);
        }); 
    }

    function onDeleteEvent(onEvent, givenId) {
        let id = givenId || parseInt(onEvent.target.parentNode.parentNode.childNodes[0].innerHTML);
        let eventParentNode = onEvent.target.parentNode.parentNode;

        eventParentNode.remove();
        document.getElementById(id).parentNode.classList = '';
        document.getElementById(id).remove();
        localStorage.removeItem(id);
    }

    function onUpdateEvent(onEvent) {
        let id = parseInt(onEvent.target.id.split('up')[1]);
        let day = document.getElementById(id).parentNode;
        let dayNumber = parseInt(document.getElementById(id).parentNode.childNodes[0].nodeValue);
        
        onDeleteEvent(onEvent, id);
        onCreateEvent(undefined, day, dayNumber);
    }


    //Adding event listeners
    prevYearButton.addEventListener('click', prevYear);
    nextYearButton.addEventListener('click', nextYear);
    prevMonthButton.addEventListener('click', prevMonth);
    nextMonthButton.addEventListener('click', nextMonth);

    initCalendar();
})(document);