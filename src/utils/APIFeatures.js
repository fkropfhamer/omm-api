class APIFeatures {
  constructor(query_db, query_req) {
    this.query_db = query_db;
    this.query_req = query_req;
  }
  filter() {
    // 1a) bulid query
    const query_obj = { ...this.query_req };
    const exclude = ["page", "sort", "fields", "limit"];
    exclude.forEach((el) => delete query_obj[el]);
    let query_str = JSON.stringify(query_obj);
    query_str = query_str.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // 1b) excute query
    this.query_db = this.query_db.find(JSON.parse(query_str));

    return this;
  }
  sort() {
    if (this.query_req.sort) {
      const sort = this.query_req.sort.split(",").join(" ");
      this.query_db = this.query_db.sort(sort);
    } else {
      //default
      //this.query_db = this.query_db.sort("-default filed");
    }

    return this;
  }
  select() {
    if (this.query_req.fields) {
      const fields = this.query_req.fields.split(",").join(" ");
      this.query_db = this.query_db.select(fields);
    } else {
      //default
      //this.query_db = this.query_db.select("-default filed");
    }

    return this;
  }
  paginate() {
    // 4a) variables preparation
    const page = this.query_req.page * 1 || 1;
    const limit = this.query_req.limit * 1 || 100;
    const step = (page - 1) * limit;
    // 4b)operation
    this.query_db = this.query_db.skip(step).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
