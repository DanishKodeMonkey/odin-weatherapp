import '@fontsource-variable/josefin-sans'
import '@fontsource-variable/noto-serif'
import './style.css'
const submitBtn = document.getElementById('submit-button')
const weatherDOM = document.getElementById('weather')

submitBtn.addEventListener('click', async () => {
	const isHidden = weatherDOM.classList.contains('hidden')
	if (!isHidden) {
		toggleWeatherDOM()
	}
	await getWeather()
	toggleWeatherDOM()
})
// Function handles rendering the weather in DOM
async function getWeather() {
	try {
		const location = document.querySelector('#country').value
		const weatherObj = await processWeatherData(location)
		renderWeatherDOM(weatherObj)
	} catch (err) {
		console.log('ERROR getLocatioNWeather', err)
	}
}
function renderWeatherDOM(weatherObj) {
	// Fetch relevant DOM elements to append
	// Weather Location -
	const locationCountry = document.getElementById('country-data')
	const locationRegion = document.getElementById('region-data')
	const locationCity = document.getElementById('city-data')

	// Weather current -
	const currentLastUpdated = document.getElementById('last-updated-data')
	const currentTemperature = document.getElementById('temperature-data')

	// Weather condition -
	const conditionContainer = document.getElementById(
		'condition-image-container'
	)
	const condition = document.getElementById('condition-data')

	// assign data from weatherObj to relevant elements.
	locationCountry.textContent = weatherObj.location.country
	locationRegion.textContent = weatherObj.location.region
	locationCity.textContent = weatherObj.location.name

	currentLastUpdated.textContent = weatherObj.current.last_updated
	currentTemperature.textContent =
		weatherObj.current.temp_c + String.fromCharCode(176) + 'C'

	condition.textContent = weatherObj.condition.text
	const conditionImgCont = document.getElementById('condition-image-container')
	conditionImgCont.textContent = ''
	const conditionImg = document.createElement('img')
	conditionImg.src = weatherObj.condition.icon
	conditionContainer.appendChild(conditionImg)
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
		return weatherObj
	} catch (err) {
		console.log('ERROR: ', err)
		switch (true) {
			case err.message.includes('400'):
				alert(`The country ${location} was not found.`)
				break
			case err.message.includes('403'):
				alert(
					`The monthly API call quote has been reached. Please try again next month.`
				)
				break
			default:
				alert('The operation failed, please try again later.')
				break
		}
	}
}

function toggleWeatherDOM() {
	weatherDOM.classList.toggle('hidden')
	weatherDOM.classList.toggle('shown')
}
