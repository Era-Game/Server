const getCurrentTime = () => {
    let dt = new Date(Date.now());
    return dt.getFullYear() + "-" + dt.getMonth() + "-" + dt.getDate()+ " " +
        dt.getHours() + ":" + dt.getMinutes() + ":" +dt.getSeconds()
}

module.exports = {
    getCurrentTime
}
