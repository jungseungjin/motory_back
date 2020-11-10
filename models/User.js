let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let info_user = new Schema({
  //아이디 닉네임을 제외하고는 중복데이터 허용
  iu_id: { type: String, required: true, unique: true },
  iu_password: { type: String, required: true },
  iu_salt: { type: String, required: true },
  iu_mail: { type: String, required: true },
  iu_phone: { type: String, required: true },
  iu_type: { type: Number, required: true }, //1 사장님 2 유저
  iu_code: { type: String }, //카카오톡 로그인, 네이버 로그인, 네이티브 로그인 구분해야될까?
  iu_status: { type: Number, required: true }, //1 정상 2 정지 3 삭제
  iu_regDate: { type: Date, required: true },
  iu_birthDate: { type: String },
  iu_car: { type: Array },
  iu_name: { type: String, required: true },
  iu_nickname: { type: String }, //, required: true, unique: true
  iu_loginCount: { type: Number, default: 0 },
  iu_lastLoginTime: { type: Date },
  iu_CRN: { type: String }, //, unique: true
  iu_agree1: { type: String, default: null },
  iu_agree2: { type: String, default: null },
  iu_agree3: { type: String, default: null },
  iu_agree4: { type: String, default: null },
  iu_agree5: { type: String, default: null },
  iu_remark: { type: String, default: null },
  iu_memo: { type: String, default: null },
});
exports.info_user = mongoose.model("info_user", info_user);
