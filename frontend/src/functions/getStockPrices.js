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

// import axios from "axios";

// export const getStockPrices = (id, days,priceType,setError) => {
//     const prices = axios
//         .get(
//             `https://query1.finance.yahoo.com/v8/finance/chart/${id}?range=${days}d&interval=1d`
//         )
//         .then((response) => {
//             if (response.data?.chart?.result) {
//                 const result = response.data.chart.result[0];

//                 const timestamps = result.timestamp;
//                 const quote = result.indicators.quote[0];

//                 const highPrices = quote.high;
//                 const volumes = quote.volume;


//                 if (priceType === "volume") {
//                     return timestamps
//                         .map((t, i) => [t * 1000, volumes[i]])
//                         .filter((item) => item[1] !== null);
//                 } else {
//                     return timestamps
//                         .map((t, i) => [t * 1000, highPrices[i]])
//                         .filter((item) => item[1] !== null);
//                 }
//             }
//         })
//         .catch((e) => {
//             console.log(e.message);
//             if (setError) setError(true);
//         });

//     return prices;
// };