const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  published: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

BlogpostSchema.pre('findByIdAndRemove', function(next) {
  this.model('Comment').deleteMany({ blogpost: this._id }, next)
})

module.exports = mongoose.model("Blogpost", BlogpostSchema);
