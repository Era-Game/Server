const joinTeamError = (err) => {
    // check the error type
    if (err.toString().search("ER_DUP_ENTRY") !== -1){ // mysql error: duplicate field
        return "This user has already in this team"
    } else {
        return "An error occurred while executing sql."
    }
}

const leaveTeamError = (err) => {
    // check the error type
    if (err.toString().search("ER_DUP_ENTRY") !== -1){ // mysql error: duplicate field
        return "This user isn't in this team."
    } else {
        return "An error occurred while executing sql."
    }
}

module.exports = {
    joinTeamError,
    leaveTeamError
}
