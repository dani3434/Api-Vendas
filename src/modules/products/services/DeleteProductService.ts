import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepositories';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    const redisCache = new RedisCache();

    if (!product) {
      throw new AppError('Product Not Found.');
    }

    await redisCache.deleteCache('api-vendas-PRODUCTS_LIST');

    await productsRepository.remove(product);
  }
}

export default DeleteProductService;
