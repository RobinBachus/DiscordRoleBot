function log(message: String) {
    console.log(`INFO: ${getTime()}: ${message}`);
}

function error(message: String, error?: Error) {
    console.error(`ERROR: ${getTime()}: ${message}`);
    if (error) {
        console.error(error);
        console.error(error.stack);
    }
}

function warn(message: String) {
    console.log(`WARN: ${getTime()}: ${message}`);
}

function getTime() {
    let date = new Date();
    let today = date.toLocaleDateString("en-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    let now = date.toLocaleTimeString("en-BE", {
        timeZone: "Europe/Brussels",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return `${today} ${now}`;
}

export { log, error, warn };
