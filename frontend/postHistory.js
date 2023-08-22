let button = document.querySelector('.button')
let startDate = document.querySelector('.startDate')
let endDate = document.querySelector('.endDate')
let search = document.querySelector('.search')
d = new Date()
d.setDate(d.getDate() - 7)
startDate.valueAsDate = d
endDate.valueAsDate = new Date()

async function getLastDate(){
    let response = await fetch("http://127.0.0.1:8000/api/update/", {
        method: "GET",
    })
    let data = await response.json()
}

async function sendData(){ 
    // We should save "now"'s datetime in local storage so that backend only needs to be used to process ML task, search, etc.
    let list = document.querySelector('.list')
    list.innerHTML = ""
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
                body: JSON.stringify({
                    items: historyItems,
                    query: search.value
                }),
            })
            let data = await response.json()
            let filteredItem1 = historyItems.filter(item => item.title.includes(data[0]))[0]
            let filteredItem2 = historyItems.filter(item => item.title.includes(data[1]))[0]
            let filteredItem3 = historyItems.filter(item => item.title.includes(data[2]))[0]
            let list = document.querySelector('.list')
            const newItem1 = document.createElement('li')
            const newItem2 = document.createElement('li')
            const newItem3 = document.createElement('li')
            const linkElement1 = document.createElement('a');
            const linkElement2 = document.createElement('a');
            const linkElement3 = document.createElement('a');
            linkElement1.href = filteredItem1['url']
            linkElement2.href = filteredItem2['url']
            linkElement3.href = filteredItem3['url']
            linkElement1.textContent = filteredItem1['title']
            linkElement2.textContent = filteredItem2['title']
            linkElement3.textContent = filteredItem3['title']
            linkElement1.target = "_blank"
            linkElement2.target = "_blank"
            linkElement3.target = "_blank"
            newItem1.appendChild(linkElement1)
            newItem2.appendChild(linkElement2)
            newItem3.appendChild(linkElement3)
            list.appendChild(newItem1)
            list.appendChild(newItem2)
            list.appendChild(newItem3)
            console.log(filteredItem1)
        }
    );
}

getLastDate()
button.addEventListener("click", sendData)