class ServiceFuture {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  paginating() {
    let page = this.queryString.page * 1 || 1;
    page < 0 ? (page = 1) : "";
    let limit = 12;
    let skip = (page - 1) * limit;
    this.page = page;
    this.mongooseQuery.skip(skip).limit(limit);
    return this;
    // http://localhost:3000/subCategory?page=9
  }

  filter() {
    let queryString = { ...this.queryString };
    let exCludedQuery = ["page", "sort", "fields", "keyword"];
    exCludedQuery.forEach((elm) => {
      delete queryString[elm];
    });
    queryString = JSON.parse(
      JSON.stringify(queryString).replace(
        /\b(gte|gt|lt|lte)\b/g,
        (match) => `$${match}`
      )
    );
    this.mongooseQuery.find(queryString);
    return this;
    //  http://localhost:3000/product?price[gte]=500&?price[lte]=500
  }
  sorting() {
    this.queryString.sort
      ? this.mongooseQuery.sort(this.queryString.sort.split(",").join(" ")) 
      : "";
    // http://localhost:3000/product?sort=price
    return this;
  }
  searching() {
    this.queryString.keyword
      ? this.mongooseQuery.find({
        $or: [
          { name: { $regex: this.queryString.keyword, $options: "i" } },
          {
            description: { $regex: this.queryString.keyword, $options: "i" },
          },
        ],
      })
      : "";
    return this;
    //  http://localhost:3000/product?keyword=name EX(iphone), description( good and goode)
  }
  fielding() {
    this.queryString.fields
      ? this.mongooseQuery.select(this.queryString.fields.split(",").join(" "))
      : "";
    return this;
    //  http://localhost:3000/product?fields=name,price,-_id
  }
}
export { ServiceFuture };
