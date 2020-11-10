let mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection(
  "mongodb+srv://motory:motoryshop123@cluster0.igckl.mongodb.net/motory?retryWrites=true&w=majority"
);
autoIncrement.initialize(connection);
let Schema = mongoose.Schema;

let info_brand = new Schema({
  brand: { type: String, default: null },
  brand_id: { type: String, default: null },
  brand_type: { type: Number, default: null }, //1국산 2수입 3기타
  view_type: { type: Number, default: 2 }, //1보여짐 2안보여짐
  view_sort: { type: Number, default: null }, // 보여질 순서 정하기
  brand_image: { type: String, default: null }, //브랜드 이미지넣기 해야함
});
exports.info_brand = mongoose.model("info_brand", info_brand);

let info_car = new Schema({
  info_car_id: { type: String, default: null },
  brand: { type: String, default: null },
  brand_id: { type: String, default: null },
  model: { type: String, default: null },
  model_id: { type: String, default: null },
  model_detail: { type: String, default: null },
  model_detail_id: { type: String, default: null },
  grade: { type: String, default: null },
  grade_id: { type: String, default: null },
  grade_detail: { type: String, default: null },
  grade_detail_id: { type: String, default: null },
  car_count: { type: Number },
  view_type: { type: Number, default: 1 }, //1보여짐 2안보여짐
});
info_car.plugin(autoIncrement.plugin, {
  model: "info_car",
  field: "car_count",
  startAt: 1,
  increment: 1,
}); //시작값 증가값 설정

exports.info_car = mongoose.model("info_car", info_car);
