let api_key =  'AIzaSyAsaKDM1E9cv45rSvphS8hv1X7eKtovbBg';

module.exports = {
		apiKey: api_key,
		listUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?',
		placeUrl: 'https://maps.googleapis.com/maps/api/place/details/json?',
		params: {
			'key': api_key,
			'types': 'restaurant',
			'rankby': 'distance',
			'opennow': ''
		}
}