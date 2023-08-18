let button = document.querySelector('.button')
let lastDate = document.querySelector('.lastDate')
let startDate = document.querySelector('.startDate')
let endDate = document.querySelector('.endDate')
d = new Date()
d.setDate(d.getDate() - 7)
startDate.valueAsDate = d
endDate.valueAsDate = new Date()

async function getLastDate(){
    let response = await fetch("http://127.0.0.1:8000/api/update/", {
        method: "GET",
    })
    let data = await response.json()
    lastDate.textContent = data
}

async function sendData(){ 
    // We should save "now"'s datetime in local storage so that backend only needs to be used to process ML task, search, etc.
    chrome.history.search(
        {
            text: '', // Return every history item....
            startTime: startDate.valueAsDate.getTime(), // that was accessed less than one week ago.
            endTime: endDate.valueAsDate.getTime(),
            maxResults: 500,
        },
        async function (historyItems) {
            // For each history item, get details on all visits.
            let response = await fetch("http://127.0.0.1:8000/api/update/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(historyItems),
            })
            let data = await response.json()
            print(data)
        }
    );
}

getLastDate()
button.addEventListener("click", sendData)