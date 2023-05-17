import { DeepPartial, DeleteResult, EntityManager, EntityTarget, In, Repository, UpdateResult } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';

export class BaseService<T> {
  protected entity: EntityTarget<T>;
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, repository: Repository<T>) {
    this.entity = entity;
    this.repository = repository;
  }

  public async create(data: DeepPartial<T>, entityManager?: EntityManager): Promise<T> {
    const repository = this.getRepository(entityManager);
    return repository.save(data);
  }

  public async findOne(filters: Partial<T>, entityManager?: EntityManager): Promise<T> {
    const repository = this.getRepository(entityManager);
    return repository.findOne(filters);
  }

  public async find(filters: FindConditions<T>, entityManager?: EntityManager): Promise<T[]> {
    const repository = this.getRepository(entityManager);
    return repository.find({ where: filters });
  }

  public async findManyByIds(ids: Array<string>, entityManager?: EntityManager): Promise<T[]> {
    const repository = this.getRepository(entityManager);
    return repository.find({
      where: {
        id: In(ids),
      },
    });
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public async update(
    id: string | string[] | FindConditions<T>,
    data: DeepPartial<any>,
    entityManager?: EntityManager
  ): Promise<UpdateResult> {
    const repository = this.getRepository(entityManager);
    return repository.update(id, data);
  }

  public async remove(id: string, entityManager?: EntityManager): Promise<DeleteResult> {
    const repository = this.getRepository(entityManager);
    return repository.delete(id);
  }

  public async findOneByAirtableRecordId(recordId: string, entityManager?: EntityManager): Promise<T> {
    return this.getRepository(entityManager)
      .createQueryBuilder()
      .where('"airtableIds" ? :recordId', { recordId })
      .getOne();
  }

  protected getRepository(entityManager?: EntityManager): Repository<T> {
    return entityManager ? entityManager.getRepository(this.entity) : this.repository;
  }
}
