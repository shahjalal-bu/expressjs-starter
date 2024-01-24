import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const q = this?.query?.q;
    if (q) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: q, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = [
      "q",
      "sort",
      "limit",
      "page",
      "sortOrder",
      "minPrice",
      "maxPrice",
      "tags",
      "startDate",
      "endDate",
      "level",
    ];

    excludeFields.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }
  //sort

  sort() {
    const sort = this?.query?.sort as string;
    //default small to big
    let sortOrder = "";
    if ((this?.query?.sortOrder as string) === "dsc") {
      sortOrder = "-";
    }

    const fieldsToSort = [
      "title",
      "price",
      "startDate",
      "endDate",
      "language",
      "durationInWeeks",
    ];
    if (fieldsToSort.includes(sort)) {
      this.modelQuery = this.modelQuery.sort((sortOrder + sort) as string);
      return this;
    } else {
      this.modelQuery = this.modelQuery.sort();
      return this;
    }
  }
  //find range by price
  range() {
    const $gte =
      this?.query.minPrice && parseFloat(this?.query.minPrice as string);
    const $lte =
      this?.query.maxPrice && parseFloat(this?.query.maxPrice as string);

    if ($gte !== undefined && $lte !== undefined) {
      this.modelQuery.find({
        price: {
          $gte,
          $lte,
        },
      });
      return this;
    }
    return this;
  }
  //filter by tags
  filterByTag() {
    if (this.query.tags) {
      this.modelQuery = this.modelQuery.find({ "tags.name": this.query.tags });
      return this;
    }
    return this;
  }
  //filter by date
  dateRange() {
    const { startDate, endDate } = this.query;
    if (!startDate && !endDate) return this;
    this.modelQuery = this.modelQuery.find({
      startDate: { $gte: startDate },
      endDate: { $lte: endDate },
    });
    return this;
  }
  //filter by level
  filterByLevel() {
    if (this.query.level) {
      this.modelQuery = this.modelQuery.find({
        "details.level": "Intermediate",
      });
      return this;
    }
    return this;
  }
  //paginate
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }
}

export default QueryBuilder;
