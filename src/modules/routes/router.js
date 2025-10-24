import userRoutes from "./user-routes.js"

export default class Router {
    constructor({ app, services }) {
        this.app = app,
        this.services = services
    }

    startup() {
        this.app.use("/users", userRoutes(this.services.userService))

        //this.app.use("/sales", salesRoutes(salesService))
    }
}''