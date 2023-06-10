class BaseModel<TId> {
  private _id: TId;

  public constructor(id: TId) {
    this._id = id;
  }

  public get id() {
    return this._id;
  }

  public set id(value: TId) {
    this._id = value;
  }

  public toJSON() {
    return { id: this._id };
  }
}

export { BaseModel };
