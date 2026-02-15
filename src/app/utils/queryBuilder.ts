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

  constructor(query: any, params: QueryParams) {
    this.query = query;
    this.params = params;
  }

  search(searchableFields: string[]) {
    if (this.params.search) {
      const regex = new RegExp(String(this.params.search), "i");

      this.query = this.query.find({
        $or: searchableFields.map((field) => ({
          [field]: regex,
        })),
      });
    }
    return this;
  }

  filter() {
    const filters = { ...this.params };
    const exclude = ["search", "page", "limit", "sort", "fields"];
    exclude.forEach((key) => delete filters[key]);

    // advanced filter (gte, lte etc.)
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
    const page = Number(this.params.page) || 1;
    const limit = Number(this.params.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
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

  build() {
    return this.query;
  }
}
