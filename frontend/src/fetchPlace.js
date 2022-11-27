let YOUR_MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiYWJieTk5IiwiYSI6ImNsNjJodTE0eDI3b3czb3Bkbjk1ZWc0YmkifQ.YTEvPs6gUXP0ihVuHJhiEQ'
export const fetchPlace = async (text) => {

    try {
        const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${YOUR_MAPBOX_ACCESS_TOKEN}`
            // `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=${process.env.REACT_APP_MAP_API_KEY}&cachebuster=1625641871908&autocomplete=true&types=place`
        );
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    } catch (err) {
        return { error: "Unable to retrieve places" };
    }
};