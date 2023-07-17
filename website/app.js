// Personal API Key for OpenWeatherMap API
const apiKey = 'bf7defb2e0fef9dc6dff22b035ea7725&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';

/* Global Variables */
const form = document.querySelector('.form');
const button = document.getElementById('generate');

const zip = document.getElementById('zip');
const content = document.getElementById('content');
const date = document.getElementById('date');
const temp = document.getElementById('temp');

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


//Event listeners

button.addEventListener('click', (event)=>{
  event.preventDefault();
  // Get input values
  const newZip = zip.value;
  const feelings = document.getElementById('feelings').value;

  getWeatherInfo(newZip)
    .then(function (apiData) {
      // post the data 
      postData('/add', { date: newDate, temp: apiData.main.temp, feelings });
    }).then(function (newData) {
      // update UI based on new data received
      updateUI();
    })
  // reset form
  form.reset();
});

// GET weather data (current) using zip from open weather API
const getWeatherInfo = async (zip) => {
    const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}`);
    try {
        //apiData  result of the fetch function
        const apiData = await res.json();
        console.log(apiData);
        return apiData;
    }
    catch (error) {
        console.log("error", error);
    }
};

//Post route : client side to send data using Promise chaining
const postData = async ( url = '', data = {})=>{
    console.log(data);
      const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: data.date,
        temp: data.temp,
        content: data.feelings
      }),
    });
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;
    }
    catch(error) {
        console.log("error", error);
    }
};

//dynamically updaet UI
const updateUI = async () => {
    const request = await fetch('/data');
    try {
      const allData = await request.json()
      
      date.innerHTML = allData.date;
      temp.innerHTML = Math.round(allData.temp)+ ' degrees';
      content.innerHTML = allData.content;
    }
    catch (error) {
      console.log("error", error);
    }
};