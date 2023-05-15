let calendar = document.querySelector('.calendar')
var current_color = "#1dd1a1";


function changeColor(color) {
    current_color = color;
    // console.log(current_color)
    document.querySelectorAll("#colrs").forEach(function(item) {
        item.classList.remove("active")
    })
    event.target.classList.add("active")
}
const month_names = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 ===0)
}

getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

generateCalendar = (month, year) => {

    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_header_year = calendar.querySelector('#year')

    let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    calendar_days.innerHTML = ''

    let currDate = new Date()
    if (!month) month = currDate.getMonth()
    if (!year) year = currDate.getFullYear()

    let curr_month = `${month_names[month]}`
    month_picker.innerHTML = curr_month
    calendar_header_year.innerHTML = year

    // get first day of month
    
    let first_day = new Date(year, month, 1)

    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement('div')
        if (i >= first_day.getDay()) {
            day.classList.add('calendar-day-hover')
            day.innerHTML = i - first_day.getDay() + 1
            day.innerHTML += `<span class = "circle"></span>
                            <span class = "circle"></span>
                            <span class = "circle"></span>
                            <span class = "circle"></span>`
            if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                day.classList.add('curr-date')
                day.classList.add(`cls${i - first_day.getDay() + 1}`)
            }
            else {
                day.classList.add(`cls${i - first_day.getDay() + 1}`)
            }
        }
        calendar_days.appendChild(day)
    }
    for(let i = 1; i <= 31; i ++ ){
        const circles = document.querySelectorAll(`.cls${i}`);
        // console.log("A")
        circles.forEach((circle) => {
            circle.addEventListener("click", () => {
                
                // console.log("AA")
                // console.log(circle.style.backgroundColor)

                if(circle.style.backgroundColor == "rgb(29, 209, 161)" && current_color == "#1dd1a1" ){
                    circle.style.backgroundColor = document.querySelector(".calendar-body").style.backgroundColor
                    console.log(document.querySelector(".calendar-body"))
                }
                else if (circle.style.backgroundColor == "rgb(255, 107, 107)" && current_color == "#ff6b6b") {
                    circle.style.backgroundColor = document.querySelector(".calendar-body").style.backgroundColor
                }
                else if (circle.style.backgroundColor == "rgb(46, 134, 222)" && current_color == "#2e86de") {
                    circle.style.backgroundColor = document.querySelector(".calendar-body").style.backgroundColor
                }
                else if (circle.style.backgroundColor == "rgb(243, 104, 224)" && current_color == "#f368e0") {
                    circle.style.backgroundColor = document.querySelector(".calendar-body").style.backgroundColor
                }
                else if (circle.style.backgroundColor == "rgb(128, 128, 128)" && current_color == "#808080") {
                    circle.style.backgroundColor = document.querySelector(".calendar-body").style.backgroundColor
                }
                else{
                    circle.style.backgroundColor = current_color;
                }
                
            });
        });
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        curr_month.value = index
        generateCalendar(index, curr_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}

let currDate = new Date()

let curr_month = {value: currDate.getMonth()}
let curr_year = {value: currDate.getFullYear()}

generateCalendar(curr_month.value, curr_year.value)

document.querySelector('#prev-year').onclick = () => {
    --curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}






// document.querySelector('.calendar-days').onclick = () => {
//     console.log("Click")
//     // circle.style.backgroundColor = activeColor;

// }

document.querySelector('#next-year').onclick = () => {
    ++curr_year.value
    generateCalendar(curr_month.value, curr_year.value)
}

let dark_mode_toggle = document.querySelector('.dark-mode-switch')

dark_mode_toggle.onclick = () => {
    document.querySelector('body').classList.toggle('light')
    document.querySelector('body').classList.toggle('dark')
}