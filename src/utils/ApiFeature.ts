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
}
