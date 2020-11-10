let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let info_store = new Schema({
  store_user_id: { type: String },
  store_name: { type: String },
  store_logo_image: { type: String },
  store_image: { type: String },
  store_ceo: { type: String },
  store_ceo_birthday: { type: String },
  store_address: { type: Object },
  store_address_detail: { type: String },
  store_register: { type: String },
  store_register_image: { type: String },
  store_category: { type: String },
  store_info: { type: String },
  store_labor_cost: { type: Array }, //각 배열 원소는 {type:boolean , laborName:String, laborCost1:Number, laborCost2:Number, laborCost:Number}
  store_labor_cost_open: { type: Boolean },
  store_labor_cost_info: { type: String },
  store_operation_time: { type: Array }, //각 배열 원소는 {day:[],ampm1:String, ampm2:String, startTiem:Number}
  store_closed_day: { type: Array }, //각 배열 원소는 {week : number, day : String} 2번으로 날짜 지우기
  store_closed_day_temp: { type: Array }, //각 배열 원소는 {startDay:Date , endDay:Date} 1번으로 날짜 지우기
  store_holiday: { type: Boolean }, //공휴일 판별기준??3번으로 날짜 지우기
});
exports.info_store = mongoose.model("info_store", info_store);
