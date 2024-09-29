export interface Step{
    demand: number,
    quantity: number,
    currenState: number,
    day: number
}

export interface stepsInList{
    id: number,
    quantity: number,
    demand: number,
    currentState: number,
    currentStateInverted: number,
    nextState: number,
    nextStateInverted: number,
    currentValue: number,
    nextValue: number,
    oldNextValue: number,
    price: number,
    weight: number,
    currentDay: number,
    nextDay: number,
    valid: boolean,
    decisionMin: number,
    decisionMax: number
}

export interface StepBack{
    demand: number,
    quantity: number,
    currenState: number,
    nextState: number,
    day: number,
    valueBefore: number,
    zValueBefore: number,
    valid: boolean
}