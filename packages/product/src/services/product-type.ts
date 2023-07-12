import { ProductType } from "@models"
import { Context, CreateProductTypeDTO, DAL } from "@medusajs/types"
import { InjectEntityManager, MedusaContext } from "@medusajs/utils"
import { shouldForceTransaction } from "../utils"
import { ProductTypeRepository } from "@repositories"

type InjectedDependencies = {
  productTypeRepository: DAL.RepositoryService
}

export default class ProductTypeService<
  TEntity extends ProductType = ProductType
> {
  protected readonly productTypeRepository_: DAL.RepositoryService

  constructor({ productTypeRepository }: InjectedDependencies) {
    this.productTypeRepository_ = productTypeRepository
  }

  @InjectEntityManager(shouldForceTransaction, "productTypeRepository_")
  async upsert(
    types: CreateProductTypeDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<TEntity[]> {
    return (await (this.productTypeRepository_ as ProductTypeRepository)
      .upsert!(types, sharedContext)) as TEntity[]
  }
}