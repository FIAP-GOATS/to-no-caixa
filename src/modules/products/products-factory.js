import ProductsRepository from "./products-repository.js";
import ProductsService from "./products-service.js";
import { Logger } from "../../logger.js";

const gProductInstance = ({db, whatsappService, chatService}) => {
    const productsRepository = new ProductsRepository({ db });
    const productService = new ProductsService({
        productsRepository,
        whatsappService,
        chatService
    });

    return {productService}
}

export {gProductInstance}