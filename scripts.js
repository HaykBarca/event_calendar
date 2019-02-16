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
                    tdAppendedNode.id = monthArray[curMonth] + '_' + (day + 1);
                    day++;
                }
                dayController++;
            }
        }
    }

    //Getting all the days in the month 
    function getDaysInMonth(month, year) {
        var date = new Date(year, month, 1);
        var days = [];
        while (date.getMonth() === month) {
           days.push(new Date(date));
           date.setDate(date.getDate() + 1);
        }
        return days;
    }

    //Deleting table rows and cells for creating new one
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

    //Changing year and recreating calendar and events
    function prevYear() {
        removeInit();
        curTime = new Date(curTime.setFullYear(curYear - 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
        initEvents(true);
    }

    //Changing year and recreating calendar and events
    function nextYear() {
        removeInit();
        curTime = new Date(curTime.setFullYear(curYear + 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
        initEvents(true);
    }

    //Changing month and recreating calendar and events
    function prevMonth() {
        removeInit();
        curTime = new Date(curTime.setMonth(curMonth - 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
        initEvents(true);
    }

    //Changing month and recreating calendar and events
    function nextMonth() {
        removeInit();
        curTime = new Date(curTime.setMonth(curMonth + 1));
        curYear = curTime.getFullYear();
        curMonth = curTime.getMonth();
        initCalendar();
        initEvents(true);
    }

    //For creating events
    function onCreateEvent(onEvent, day, dayNumber, givenTitle, givenBody, givenId, notCreateList, notCrateOnCalendar, givenDate) {
        let newEventObject;
        let newEventArray;
        let eventNode = document.createElement('SPAN');
        let tableRowNode = document.createElement('TR');
        let tableCellNode = document.createElement('TD');
        let id = givenId || (new Date()).getTime();
        let eventTitle = givenTitle || prompt('Event Title');
        let eventBody = givenBody || prompt('Event Body');
        let date = givenDate || new Date(curTime.getFullYear(), curTime.getMonth(), (dayNumber || parseInt(onEvent.target.innerText)));

        //Checks data validity and makes objects/arrays
        if (id && eventTitle && eventBody && date) {
            newEventObject = {id, eventTitle, eventBody, date};
            newEventArray = [id, eventTitle, eventBody, date];
        } else {
            alert('Please enter valid data.');
            return;
        }

        localStorage.setItem(id, JSON.stringify(newEventObject));

        if (!notCrateOnCalendar) { //If needs to not create event on calendar, but create on table
            //Creating events table DOM
            eventNode.id = id;
            eventNode.innerHTML = eventTitle;

            if (day) {
                day.classList.add("withEvent");
                day.appendChild(eventNode);
            } else {
                onEvent.target.classList.add("withEvent");
                onEvent.target.appendChild(eventNode);
            }
        }

        if (!notCreateList) { //If needs to not create event on table, but create on calendar
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
    }

    //Removing event from local storage and tables
    function onDeleteEvent(onEvent, givenId) {
        let id = givenId || parseInt(onEvent.target.parentNode.parentNode.childNodes[0].innerHTML);
        let eventParentNode = onEvent.target.parentNode.parentNode;
        let eventObjectDate = new Date(JSON.parse(localStorage.getItem(id)).date);

        
        if (curYear === eventObjectDate.getFullYear() && curMonth === eventObjectDate.getMonth()) {
            document.getElementById(id).parentNode.classList = '';
            document.getElementById(id).remove();
        }
        eventParentNode.remove();
        localStorage.removeItem(id);
    }

    //Updating event with same id and diff body/title 
    function onUpdateEvent(onEvent) {
        let id = parseInt(onEvent.target.id.split('up')[1]);
        let eventObjectDate = new Date(JSON.parse(localStorage.getItem(id)).date);

        if (curYear === eventObjectDate.getFullYear() && curMonth === eventObjectDate.getMonth()) {
            let day = document.getElementById(id).parentNode;
            let dayNumber = parseInt(document.getElementById(id).parentNode.childNodes[0].nodeValue);

            onDeleteEvent(onEvent, id);
            onCreateEvent(undefined, day, dayNumber);
        } else {

            onDeleteEvent(onEvent, id);
            onCreateEvent(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true, eventObjectDate)
        }
    }

    //For recreating and keeping events
    function initEvents(changeYearMonth) {
        for (let i = 0; i < localStorage.length; i++) {
            let eachEvent = JSON.parse(localStorage.getItem(localStorage.key(i)));
            let eventDate = new Date(eachEvent.date);

            if (curYear === eventDate.getFullYear() && curMonth === eventDate.getMonth() && !changeYearMonth) {
                let day = document.getElementById(monthArray[curMonth] + '_' + eventDate.getDate());
                let dayNumber = eventDate.getDate();
                
                onCreateEvent(undefined, day, dayNumber, eachEvent.eventTitle, eachEvent.eventBody, eachEvent.id);
            } else if (curYear === eventDate.getFullYear() && curMonth === eventDate.getMonth() && changeYearMonth) {
                let day = document.getElementById(monthArray[curMonth] + '_' + eventDate.getDate());
                let dayNumber = eventDate.getDate();
                
                onCreateEvent(undefined, day, dayNumber, eachEvent.eventTitle, eachEvent.eventBody, eachEvent.id, true);
            }
        }    
    }

    //Adding event listeners
    prevYearButton.addEventListener('click', prevYear);
    nextYearButton.addEventListener('click', nextYear);
    prevMonthButton.addEventListener('click', prevMonth);
    nextMonthButton.addEventListener('click', nextMonth);

    initCalendar();
    initEvents();
})(document);