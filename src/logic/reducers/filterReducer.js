import {GENRES as genres, YEARS as years} from '../staticData/staticData'

const initialState = {
    filters: [genres, years],
    activeGenre: 'Не выбран',
    activeYear: 'Не выбран',
}

const filters = (state = initialState, action) => {
    switch (action.type) {
        case 'ACTIVE_GENRE_CHANGED':
            return {
                ...state,
                activeGenre: action.payload
            }
        case 'ACTIVE_YEAR_CHANGED':
            return {
                ...state,
                activeYear: action.payload
            }
        default: return state
    }
}

export default filters;