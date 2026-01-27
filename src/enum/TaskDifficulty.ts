enum Difficulty {
    Undefined = 'Undefined',
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

const difficultyMap = {
    0: Difficulty.Undefined,
    1: Difficulty.Easy,
    2: Difficulty.Medium,
    3: Difficulty.Hard
}

export { Difficulty, difficultyMap }