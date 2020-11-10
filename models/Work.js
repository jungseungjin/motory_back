let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let info_work = new Schema({
  //작업종류
  work_type: Number,
  work_type_name: String,
  work_sub_type_name: String,
  work_sub_type_id: String,
  work_name: String,
  work_name_id: String,
  work_memo: String,
  info_work_id: { type: String },
});
exports.info_work = mongoose.model("info_work", info_work);

let store_work = new Schema({
  store_id: { type: mongoose.Types.ObjectId }, //info_store의 _id값
  store_user_id: { type: String },
  store_thumbnail: { type: Array }, //썸네일사진 uri
  store_work_name: { type: String }, //작업명
  store_info_work_type: { type: String }, //작업종류 대분류
  store_info_work: { type: Array }, //작업종류 info_work의 _id값
  store_info_car: { type: Array }, //작업 차량 info_car의 _id값
  store_work_time: { type: String }, //작업시간
  store_work_need_day: { type: Number }, //최소예약날짜
  store_work_total_cost: { type: Number }, //작업 총 가격
  store_work_labor_cost: { type: Number }, //작업 총 가격중 공임가격
  store_work_cost_open: { type: Boolean }, //true ->공임가격 공개 false -> 총가격만 표시
  store_work_info: { type: String }, //작업 설명
  store_work_stop: { type: Boolean }, //일시정지여부
  store_work_stopdate: { type: Date }, //일시정지시간
  store_work_del: { type: Boolean }, //삭제
  store_work_deldate: { type: Date }, //삭제
  store_work_tag: { type: Array },
  store_work_regdate: { type: Date }, //등록시간
  store_work_revisedate: { type: Date }, //등록시간
});
exports.store_work = mongoose.model("store_work", store_work);
