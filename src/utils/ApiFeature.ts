import { Query } from "mongoose";

export default class ApiFeature<
  T extends Query<any, any, any, any, any>,
  U extends { [key: string]: any },
> {
  constructor(public query: T, private queryObj: U) {}

  filter() {
    let queryObject = { ...this.queryObj };

    const excludeFeild = ["page", "sort", "limit", "fields"];
    excludeFeild.forEach((ele) => delete queryObject[ele]);

    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    let { sort } = this.queryObj;
    if (sort && typeof sort === "string") {
      sort = sort.replaceAll(",", " ");
      this.query.sort(sort);
    } else this.query.sort("-createdAt");

    return this;
  }

  fields() {
    let { fields } = this.queryObj;
    if (fields && typeof fields === "string") {
      fields = fields.replaceAll(",", " ");
      this.query.select(fields);
    } else this.query.select("-__v");

    return this;
  }

  pagination() {
    let { page, limit } = this.queryObj;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;
    this.query.skip(skip).limit(limitNum);

    return this;
  }
}
