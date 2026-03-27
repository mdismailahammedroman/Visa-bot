/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type QueryParams = {
  search?: string;
  page?: string;
  limit?: string;
  sort?: string;
  fields?: string;
  [key: string]: unknown;
};

export class QueryBuilder<T> {
  private query: any;
  private params: QueryParams;
  private page = 1;
  private limit = 10;

  constructor(query: any, params: QueryParams) {
    this.query = query;
    this.params = params;
  }

  search(searchableFields: string[]) {
    if (this.params.search) {
      const regex = new RegExp(String(this.params.search), "i");
      this.query = this.query.find({
        $or: searchableFields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }
// Add this method inside QueryBuilder class
searchEnum(enumFields: string[], searchValue: string) {
  if (searchValue) {
    const regex = new RegExp(searchValue, "i"); // case-insensitive
    const orConditions = enumFields.map((field) => ({ [field]: regex }));

    if (this.query.getQuery().$or) {
      this.query = this.query.find({ $or: [...this.query.getQuery().$or, ...orConditions] });
    } else {
      this.query = this.query.find({ $or: orConditions });
    }
  }
  return this;
}
  filter() {
    const filters = { ...this.params };
    const exclude = ["search", "page", "limit", "sort", "fields"];
    exclude.forEach((key) => delete filters[key]);

    let filterString = JSON.stringify(filters);
    filterString = filterString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const mongoFilter = JSON.parse(filterString);
    this.query = this.query.find(mongoFilter);
    return this;
  }

  sort() {
    if (this.params.sort) {
      const sortBy = String(this.params.sort).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    this.page = Number(this.params.page) || 1;
    this.limit = Number(this.params.limit) || 10;
    const skip = (this.page - 1) * this.limit;
    this.query = this.query.skip(skip).limit(this.limit);
    return this;
  }

  fields() {
    if (this.params.fields) {
      const fields = String(this.params.fields).split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  // 🔹 নতুন method: buildWithMeta
  async build() {
    const total = await this.query.model.countDocuments(this.query.getQuery());
    const data = await this.query;
    const totalPage = Math.ceil(total / this.limit);

    return {
      data,
      meta: {
        page: this.page,
        limit: this.limit,
        total,
        totalPage,
      },
    };
  }
}
