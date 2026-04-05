import axios from "axios";

export const getStockPrices = async (id, days, priceType, setError) => {
    try {
        const response = await axios.get(
            `http://localhost:5000/api/stocks/chart/${id}?range=${days}&interval=1d`
        );

        if (priceType === "volume") {
            return response.data.volumes;
        } else {
            return response.data.prices;
        }
    } catch (error) {
        console.log(error.message);
        if (setError) setError(true);
    }
};

