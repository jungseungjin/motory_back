let mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.createConnection(
  "mongodb+srv://motory:motoryshop123@cluster0.igckl.mongodb.net/motory?retryWrites=true&w=majority"
);
autoIncrement.initialize(connection);
let Schema = mongoose.Schema;

let info_free_board = new Schema({
  title: { type: String, default: null },
  writer: { type: String, default: "admin" }, //작성자
  writer_type: { type: Number, defalut: 0 }, //작성자가 0 관리자 1 사장님 2 유저
  reply: { type: Array, default: null }, //댓글 _id값 배열로 가지고 있자
  contents: { type: String, default: null }, //글 내용
  contentsPicture: { type: Array, default: null }, //글 안에 사진 링크??
  number: { type: Number }, //글 번호
  count: { type: Number }, //조회수
  regDate: { type: Date }, //생성일
  regIp: { type: String }, //작성 아이피
  status: { type: Number, default: 1 }, //상태 1정상 2삭제 3숨김 ---
  like: { type: Number }, //좋아요

  //그 외는 하면서 더 추가
});
info_free_board.plugin(autoIncrement.plugin, {
  model: "info_free_board",
  field: "number",
  startAt: 1,
  increment: 1,
}); //시작값 증가값 설정

exports.info_free_board = mongoose.model("info_free_board", info_free_board);

let info_Notice_board = new Schema({
  title: { type: String, default: null },
  reply: { type: Array, default: null }, //댓글 _id값 배열로 가지고 있자
  view_type: { type: Number, defalut: 0 }, //1이면 사장님들에게 보여지고 2면 유저들에게 보여짐
  contents: { type: String, default: null }, //글 내용
  contentsPicture: { type: Array, default: null }, //글 안에 사진 링크??
  number: { type: Number }, //글 번호
  count: { type: Number }, //조회수
  regDate: { type: Date }, //생성일
  regIp: { type: String }, //작성 아이피
  status: { type: Number, default: 1 }, //상태 1정상 2삭제 3숨김 ---
  like: { type: Number }, //좋아요
  //그 외는 하면서 더 추가
});
info_Notice_board.plugin(autoIncrement.plugin, {
  model: "info_Notice_board",
  field: "number",
  startAt: 1,
  increment: 1,
}); //시작값 증가값 설정

exports.info_Notice_board = mongoose.model(
  "info_Notice_board",
  info_Notice_board
);

let info_question = new Schema({
  writer: { type: String, default: null }, //작성자 아이디
  writer_name: { type: String, default: null }, //작성자 이름
  title: { type: String, default: null }, //제목
  contents: { type: String, default: null }, //내용
  number: { type: Number }, //글 번호
  status: { type: Number, default: 1 }, //상태 1정상 2삭제 3숨김 ---
  regDate: { type: Date }, //생성일
  regIp: { type: String }, //작성 아이피
  reply: { type: Array, default: null }, //댓글 _id값 배열로 가지고 있자
  view_type: { type: Number, defalut: 0 }, //1이면 사장님들문의  2면 유저들문의
  revise_Date: { type: Date }, //수정시간
});
info_question.plugin(autoIncrement.plugin, {
  model: "info_question",
  field: "number",
  startAt: 1,
  increment: 1,
}); //시작값 증가값 설정

exports.info_question = mongoose.model("info_question", info_question);

let info_question_reply = new Schema({
  iq_id: { type: mongoose.Schema.ObjectId },
  contents: { type: String, default: null }, //내용
  writer: { type: String, default: "admin" }, //작성자 아이디
  regDate: { type: Date }, //생성일
});
exports.info_question_reply = mongoose.model(
  "info_question_reply",
  info_question_reply
);

let info_feedback = new Schema({
  writer: { type: String, default: null }, //작성자 아이디
  writer_name: { type: String, default: null }, //작성자 이름
  title: { type: String, default: null }, //제목
  contents: { type: String, default: null }, //내용
  number: { type: Number }, //글 번호
  status: { type: Number, default: 1 }, //상태 1정상 2삭제 3숨김 ---
  regDate: { type: Date }, //생성일
  regIp: { type: String }, //작성 아이피
  view_type: { type: Number, defalut: 0 }, //1이면 사장님들이 피드백  2면 유저들이 피드뱍
});
info_feedback.plugin(autoIncrement.plugin, {
  model: "info_feedback",
  field: "number",
  startAt: 1,
  increment: 1,
}); //시작값 증가값 설정

exports.info_feedback = mongoose.model("info_feedback", info_feedback);
