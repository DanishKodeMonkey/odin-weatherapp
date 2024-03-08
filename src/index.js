import '@fontsource-variable/josefin-sans'
import '@fontsource-variable/noto-serif'
import './style.css'
const submitBtn = document.getElementById('submit-button')

submitBtn.addEventListener('click', () => getWeather())
// Function handles rendering the weather in DOM
async function getWeather() {
	try {
		const location = document.querySelector('#country').value
		const weatherObj = await processWeatherData(location)
		renderDOM(weatherObj)
		/* const weatherObj = await processWeatherData(location) */
	} catch (err) {
		console.log('ERROR getLocatioNWeather', err)
	}
}
function renderDOM(weatherObj) {
	// Location elements
	const weatherLocationCont = document.createElement('div')
	const weatherLocationTitle = document.createElement('p')
	weatherLocationTitle.textContent = 'Location'
}

async function fetchWeatherData(location) {
	const response = await fetch(
		`http://api.weatherapi.com/v1/current.json?key=639acad64e624798847135255240703&q=${location}`,
		{ mode: 'cors' }
	)
	if (!response.ok) {
		throw new Error(`Weather API request failed: ${response.status}`)
	}
	return response.json()
}

async function processWeatherData(location) {
	try {
		const responseData = await fetchWeatherData(location)
		const weatherObj = {
			location: {
				name: responseData.location.name,
				region: responseData.location.region,
				country: responseData.location.country,
			},

			current: {
				last_updated: responseData.current.last_updated,
				temp_c: responseData.current.temp_c,
			},

			condition: {
				text: responseData.current.condition.text,
				icon: responseData.current.condition.icon,
			},
		}
		console.log(weatherObj)
		return weatherObj
	} catch (err) {
		console.log('ERROR: ', err)
	}
}
