export const API_KEYS = [
    "CG-36LTv7AoNbH5EFnv8Xfjqwvq",
    "CG-WJ27RfzFTHiHohEm8h1kJ4j7",
    "CG-wVAadpMvSynVFkjtbw9yVkSN",
    "CG-jJfHdxkzeaDw1UwxJxXpPQLx",
    "CG-ZDZpaWbkr4E3TNoCwL8XhejX",
    "CG-BVqvczpUtRcarCPRxmam9Ezw",
    "CG-LkMbNxw9yoHh4NBkJxuSk6Db",
    "CG-Z98unBAYSL7T4Yfgi5GdBpfg",
    "CG-zU9RVzDYQx7UhsQMMeh7TGqN",
    "CG-PLERJDtXTdES6u2WaGFbvHTB"
];

let keyIndex = Number(localStorage.getItem("coin_api_index")) || 0;

export const getApiKey = () => {
  return API_KEYS[keyIndex];
};

export const switchApiKey = () => {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
  localStorage.setItem("coin_api_index", keyIndex);
};

export const getKeyIndex = () => keyIndex;