import crypto from 'crypto';

let generateId = () => {
	if (crypto.randomUUID)
		return crypto.randomUUID();
	return crypto.randomBytes(4).toString("hex");


}


export {generateId};
