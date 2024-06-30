export const activeYearChanged = (filter) => {
	return {
		type: "ACTIVE_YEAR_CHANGED",
		payload: filter,
	};
};

export const activeGenreChanged = (filter) => {
	return {
		type: "ACTIVE_GENRE_CHANGED",
		payload: filter,
	};
};