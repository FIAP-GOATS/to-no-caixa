
import UserService from "./user-service.js"
import { Logger } from '../../logger.js';
import UserRepository from "./user-repository.js";

const gUserInstance = ({
	db,
	authService
}) => {
    const userRepository = new UserRepository({ db })
	const userService = new UserService({ userRepository, authService })
	return { userService }
}

export {
	gUserInstance
}

