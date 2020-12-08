/**
 * @description removes unwanted fields in the given object
 * */
export const filterObject = <T extends object>( // eslint-disable-line
	obj: T,
	fields: string[],
	allowed = false,
) => {
	if (allowed) {
		const newObj: Partial<T> = {};
		Object.keys(obj).forEach((el) => (fields.includes(el) ? (newObj[el] = obj[el]) : null));
		return newObj;
	}

	fields.forEach((field) => (obj[field] = undefined));

	return obj;
};
