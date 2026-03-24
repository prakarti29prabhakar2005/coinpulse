export const STOCK_SYMBOLS = [
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","AVGO","TSM",
  "AMD","INTC","CSCO","ORCL","SAP","IBM"
];

export const API_KEYS = [
  "W0pcdCVHLu5JgcyyNDdK6Fsn4dvqfl4o",
  "Ae9mqFS7nAQYiS6Se2b7wDyoUHGWf20X",
  "lc7tWuWjTVa47wfsE2HRpnzlD1zKl4ZX",
  "VpI09GkHvcr0momQDpLAWnGeZYmdmnib",
  "kW1Bs47fasynMU3n8DfiJAQkM06nPVRL",
  "tE0f0RF54I0E8m1yqphUhzAoWDjkFvQ2",
  "Cw7VthpqNCu2lnHO54RVpBATGB56y8Cq",
  "9SxoWBH8sX76vSM6Ne5gFMF2XLDv0JOR",
  "zU0rKQm5gXw16Wos3agiuiHtBgJojwKy",
  "YCdImKuuzsuroFx3yRr9NhaYIcwf45kd",
  "TAK4XYNhNL0sx2sNas2KyGL1hPXQ69s5",
  "K9t69kYCJ4sjlwaZTIm0MofC2oZLmzne",
  "JciUXYleJ2MPDNVDHkphDVrjVSf7SYq4",
  "5sZ4fCRyKcrkiNDdtaTDiQuQVwzyodJU",
  "hox907x5TwhmjujTmERMvk9aAvd8G400",
  "5WEh6Us26Bi4y8JEFSS44bbFJkse9yu0",
  "WIdl3Slfjmu08Y53htNTi3YuYTOmBHKV",
  "VpfVvoC4z8DrGX5NYJ1vyZQHS349YItj",
  "CYAyaMqxiD9ceNwjPPSXh0rRFfPaSN6E",
  "6jLCGpMb56wiyTQpSsr6Uvecc71TgHve",
  "2wuDLBOvnnctlznQnJ45eFNQvu5XVssP",
  "jU0KvWlWeHrudmoVDpCqaCuSNQyR7z0T",
  "O8tG87cF9Xj8V8kF6kaoj3QyGgvnNOVZ",
  "UFUTM4wZP0zYcNDKgl5aBMXMKXOcQUNH",
  "WiTJfkHpZTJeFcjtyRo14HnovmQlk2IQ",
  "pNESTHfzeqUl13gjvjwe0hp2kBSLZFFY",
  "ihFMLVRznExFlIaoh6upkx4JPWIyapb0",
  "5qTgKazsPIig6BAnnkEqpJ2bVrLqoMpH",
  "VaW1zuSu1om6JwW5BanCPLFPZmy8hmDs",
  "k9IaE0QtFlN5EGsqVR042RcGcdc5ENRw",
  "Xm41aKIbFMHRn5FVliwbdLdw51M7TDAR",
  "ZgmnkZQIDnifaIkeOnqQ4L3cNHxgGxk5",
  "n95i4SzjiAHdboIoFIFBVux5IC8oUa14",
  "IUOBFIhPXjFbcr3hf8WXaKA29joRLg3R",
  "4qvZNwmVHLUqfTB5CzTzWMstrKYHCWud",
  "kzcpdp7MFIRA6aBCR5JhnbekaO6CziTd",
  "1SDS42QWVWu3Mpd2gny4Z2y2Dg8u8SRJ",
  "OhyWOfOtS0Ojp1uRT0sNtiXBFjln9kN1",
  "jFXPkUC4wBwSK9QL0mClavp3sQVIEoP9",
  "XC8iS8t0Fq3sdWgeCtgkQEbRpaYZUbmz",
  "tJHRLR3BVsFfIfaZsVvCbxK16O4spwtu",
  "hjEs4hrPDfJyXFBbmeA6DChInp22inot",
  "psKKDtb4jDZ6orPkvEw9pM9jz5sshuVW",
  "n0cnXklTOq7rmo9czvyp8R6cusO9AqNX",
  "9XqyZkrX20WT6yadMFDxr4CzZ8S2E45q",
  "k2TzGIDk9iy1kDySAUPS6d3g0zTjiF58",
  "RXrCWqystPzRZCru7tMMhlj26S46cFJc",
  "z7DcAPP9j35uXT9BoOMVJTbG4RnDoY9O",
  "9ghITe63qBidiYwTOuWTCtlHc5OFxlsR",
  "snJ0IOCxKvjWfyK8weL5fnV9za9BIPSb",
  "HI7nwJJYpLwhjoM82DCJPmXqLDWs9qXK"
];

let keyIndex = Number(localStorage.getItem("stock_api_index")) || 0;

export const getApiKey = () => {
  return API_KEYS[keyIndex];
};

export const switchApiKey = () => {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  localStorage.setItem("stock_api_index", keyIndex);
};

export const getKeyIndex = () => keyIndex;