enum Status {
    Pending = 'Pending',
    InProgress = 'In Progress',
    Finished = 'Finished'
}


const stateMap = {
    0: Status.Pending,
    1: Status.InProgress,
    2: Status.Finished
}

export { Status, stateMap }
