const { Store } = require("express-session");

module.exports = (app) => {
  const mongoose = require("mongoose");
  const Work = require("../models/Work.js");
  const Store = require("../models/Store");
  const User = require("../models/User");
  const Car = require("../models/Car");
  const Board = require("../models/Board");
  const moment = require("moment");
  const multiparty = require("multiparty");
  const xlsx = require("xlsx");
  const Key = require("../config/Key");
  const Send_message = "올바른 경로가 아닙니다.";

  app.get("/work_excel", function (req, res) {
    try {
      let contents = "";
      contents += "<html><body>";
      contents +=
        '   <form action="/work_excel" method="POST" enctype="multipart/form-data">';
      contents += '       <input type="file" name="xlsx" />';
      contents += '       <input type="submit" />';
      contents += "   </form>";
      contents += "</body></html>";

      res.send(contents);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

  app.post("/work_excel", async function (req, res) {
    const resData = {};

    const form = new multiparty.Form({
      autoFiles: true,
    });

    form.on("file", (name, file) => {
      const workbook = xlsx.readFile(file.path);
      const sheetnames = Object.keys(workbook.Sheets);

      let i = sheetnames.length;

      while (i--) {
        const sheetname = sheetnames[i];
        resData[sheetname] = xlsx.utils.sheet_to_json(
          workbook.Sheets[sheetname]
        );
      }
    });

    form.on("close", async () => {
      for (var a = 0; a < resData.Sheet1.length; a++) {
        try {
          let type1, type2, type3;
          if (resData.Sheet1[a].대분류 == "드레스업") {
            type1 = 1;
          } else if (resData.Sheet1[a].대분류 == "퍼포먼스") {
            type1 = 2;
          } else if (resData.Sheet1[a].대분류 == "편의장치") {
            type1 = 3;
          } else if (resData.Sheet1[a].대분류 == "캠핑카") {
            type1 = 4;
          }

          type2 = type1.toString();
          for (var b = 0; b < resData.Sheet1[a].중분류.length; b++) {
            let type2_num = resData.Sheet1[a].중분류.charCodeAt(b);
            type2 += "-" + type2_num;
          }

          type3 = type1.toString();
          for (var c = 0; c < resData.Sheet1[a].소분류.length; c++) {
            let type3_num = resData.Sheet1[a].소분류.charCodeAt(c);
            type3 += "-" + type3_num;
          }
          //String.fromCharCode(아스키코드값) -> 아이스키코드값을 원래 글자로 변경
          let chk_data = await Work.info_work.findOne({
            work_type: type1,
            work_sub_type_name: resData.Sheet1[a].중분류,
            work_name: resData.Sheet1[a].소분류,
          });
          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
          }
          let random_number = getRandomInt(1, 1000000);
          if (chk_data) {
          } else {
            console.log("저장");
            await Work.info_work({
              work_type: type1,
              work_type_name: resData.Sheet1[a].대분류,
              work_sub_type_name: resData.Sheet1[a].중분류,
              work_sub_type_id: type2,
              work_name: resData.Sheet1[a].소분류,
              work_name_id: type3,
            }).save();
          }
        } catch (err) {
          console.log(err);
        }
      }
    });

    res.send(resData);
    form.parse(req);
  });

  app.get("/work_delete", async function (req, res) {
    try {
      await Work.info_work.deleteMany({});
      let chk_data = await Work.info_work.find({});
      console.log(chk_data.length);
      res.send(chk_data);
    } catch (Err) {
      console.log(Err);
    }
  });

  app.get("/work_findAll", async function (req, res) {
    try {
      let find_query = {};
      let chk_data;
      if (req.query.work_type) {
        find_query = {
          work_type: req.query.work_type,
        };
        chk_data = await Work.info_work
          .find(find_query)
          .select(
            "work_type work_type_name work_sub_type_id work_sub_type_name"
          );
        let chk_data2 = chk_data.reduce((prev, now) => {
          if (
            !prev.some((obj) => obj.work_sub_type_id === now.work_sub_type_id)
          ) {
            prev.push(now);
          }
          return prev;
        }, []);
        chk_data = chk_data2;
      }
      if (req.query.work_sub_type_name) {
        find_query = {
          work_sub_type_name: req.query.work_sub_type_name,
        };
        chk_data = await Work.info_work.find(find_query);
      }
      res.send(chk_data);
    } catch (Err) {
      console.log(Err);
      return res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  app.get("/car_excel", function (req, res) {
    try {
      let contents = "";
      contents += "<html><body>";
      contents +=
        '   <form action="/car_excel" method="POST" enctype="multipart/form-data">';
      contents += '       <input type="file" name="xlsx" />';
      contents += '       <input type="submit" />';
      contents += "   </form>";
      contents += "</body></html>";
      res.send(contents);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

  app.post("/car_excel", async function (req, res) {
    const resData = {};

    const form = new multiparty.Form({
      autoFiles: true,
    });

    form.on("file", (name, file) => {
      const workbook = xlsx.readFile(file.path);
      const sheetnames = Object.keys(workbook.Sheets);

      let i = sheetnames.length;

      while (i--) {
        const sheetname = sheetnames[i];
        resData[sheetname] = xlsx.utils.sheet_to_json(
          workbook.Sheets[sheetname]
        );
      }
    });

    form.on("close", async () => {
      for (var a = 0; a < resData.Sheet1.length; a++) {
        try {
          let brand = resData.Sheet1[a].제조사;
          let brand_id = resData.Sheet1[a].제조사;
          let brand_id_ascii;
          for (var b = 0; b < brand_id.length++; b++) {
            let brand_id_ascii_char = brand_id.charCodeAt(b);
            if (b == 0) {
              brand_id_ascii = brand_id_ascii_char;
            } else {
              brand_id_ascii += "-" + brand_id_ascii_char;
            }
          }
          let model = resData.Sheet1[a].모델;
          let model_id = resData.Sheet1[a].모델;
          let model_id_ascii;
          if (model_id) {
            for (var c = 0; c < model_id.length++; c++) {
              let model_id_ascii_char = model_id.charCodeAt(c);
              if (c == 0) {
                model_id_ascii = model_id_ascii_char;
              } else {
                model_id_ascii += "-" + model_id_ascii_char;
              }
            }
          }

          let model_detail = resData.Sheet1[a].세부모델;
          let model_detail_id = resData.Sheet1[a].세부모델;
          let model_detail_id_ascii;
          if (model_detail_id) {
            for (var d = 0; d < model_detail_id.length++; d++) {
              let model_detail_id_ascii_char = model_detail_id.charCodeAt(d);
              if (d == 0) {
                model_detail_id_ascii = model_detail_id_ascii_char;
              } else {
                model_detail_id_ascii += "-" + model_detail_id_ascii_char;
              }
            }
          }

          let grade = resData.Sheet1[a].등급;
          let grade_id = resData.Sheet1[a].등급;
          let grade_id_ascii;
          if (grade_id) {
            for (var e = 0; e < grade_id.length++; e++) {
              let grade_id_ascii_char = grade_id.charCodeAt(e);
              if (e == 0) {
                grade_id_ascii = grade_id_ascii_char;
              } else {
                grade_id_ascii += "-" + grade_id_ascii_char;
              }
            }
          }

          let grade_detail = resData.Sheet1[a].세부등급;
          let grade_detail_id = resData.Sheet1[a].세부등급;
          let grade_detail_id_ascii;
          if (grade_detail_id) {
            for (var f = 0; f < grade_detail_id.length++; f++) {
              let grade_detail_id_ascii_char = grade_detail_id.charCodeAt(f);
              if (f == 0) {
                grade_detail_id_ascii = grade_detail_id_ascii_char;
              } else {
                grade_detail_id_ascii += "-" + grade_detail_id_ascii_char;
              }
            }
          }

          //String.fromCharCode(아스키코드값) -> 아이스키코드값을 원래 글자로 변경
          let chk_data = await Car.info_car.findOne({
            brand: resData.Sheet1[a].제조사,
            model: resData.Sheet1[a].모델,
            model_detail: resData.Sheet1[a].세부모델,
            grade: resData.Sheet1[a].등급,
            grade_detail: resData.Sheet1[a].세부등급,
          });
          console.log(resData.Sheet1.length);
          console.log(a);
          if (chk_data) {
            let view_type = 1;
            if (resData.Sheet1[a].X == 1) {
              view_type = 2;
            }
            await Car.info_car.findOneAndUpdate(
              { _id: chk_data._id },
              { $set: { view_type: view_type } }
            );
          } else {
            console.log("저장");
            let view_type = 1;
            if (resData.Sheet1[a].X == 1) {
              view_type = 2;
            }
            let data_save = await Car.info_car({
              brand: resData.Sheet1[a].제조사,
              brand_id: brand_id_ascii,
              model: resData.Sheet1[a].모델,
              model_id: model_id_ascii,
              model_detail: resData.Sheet1[a].세부모델,
              model_detail_id: model_detail_id_ascii,
              grade: resData.Sheet1[a].등급,
              grade_id: grade_id,
              grade_detail: resData.Sheet1[a].세부등급,
              grade_detail_id: grade_detail_id,
              view_type: view_type,
            }).save();
            await Car.info_car.findOneAndUpdate(
              { _id: data_save._id },
              { $set: { info_car_id: data_save._id } }
            );
            console.log(data_save);
          }
        } catch (err) {
          console.log(err);
        }
      }
    });

    res.send(resData);
    form.parse(req);
  });

  app.get("/car_findAll", async function (req, res) {
    try {
      let find_query = {};
      let chk_data;
      if (req.query.key == Key.key) {
      } else {
        if (req.query.brand) {
          chk_data = await Car.info_car.find({
            brand: req.query.brand,
            view_type: 1,
          });
          console.log(chk_data.length);
          res.send(chk_data);
        }
      }
    } catch (err) {
      console.log(err);
      res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  app.get("/notice_register", async function (req, res) {
    try {
      if (req.query.title && req.query.contents) {
        let save_Notice = await Board.info_Notice_board({
          title: req.query.title,
          //reply: { type: Array, default: null }, //댓글 _id값 배열로 가지고 있자
          contents: req.query.contents, //글 내용
          //contentsPicture: { type: Array, default: null }, //글 안에 사진 링크??
          //number: { type: Number }, //글 번호
          //count: { type: Number }, //조회수
          regDate: moment(), //생성일
          //regIp: { type: String }, //작성 아이피
          //status: { type: Number, default: 1 }, //상태 1정상 2삭제 3숨김 ---
          //like: { type: Number }, //좋아요
        }).save();
        res.send(save_Notice);
      } else {
        res.send("쿼리값 확인");
      }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

  //메인화면에서 공지사항 최신것 하나와 알림 가져오기 get으로 변경필요
  app.get("/home/:type", async function (req, res) {
    try {
      if (req.params.type == 1) {
        if (req.query.key == Key.key) {
          let Notice = await Board.info_Notice_board
            .find({})
            .sort({ _id: -1 })
            .limit(1);
          res.json(Notice);
        } else {
          res.json([
            {
              type: 0,
              message: Send_message,
            },
          ]);
        }
      } else {
        res.json([
          {
            type: 0,
            message: Send_message,
          },
        ]);
      }
    } catch (err) {
      console.log(err);
      res.json([
        {
          type: 0,
          message: Send_message,
        },
      ]);
    }
  });

  //공지사항 리스트
  app.get("/notice_list/:type", async function (req, res) {
    try {
      let data;
      if (req.params.type == 1) {
        if (req.query.key == Key.key) {
          data = await Board.info_Notice_board
            .find({
              view_type: 1,
              status: 1,
            })
            .sort({ _id: -1 });
        }
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([
        {
          type: 0,
          message: Send_message,
        },
      ]);
    }
  });

  //1대1문의 작성
  app.post("/question_register/:type", async function (req, res) {
    try {
      if (req.params.type == 1) {
        if (req.body.key == Key.key) {
          await Board.info_question({
            writer: req.body.writer, //작성자 아이디
            writer_name: req.body.writer_name, //작성자 이름
            title: req.body.title, //제목
            contents: req.body.contents, //내용
            //number: { type: Number }, //글 번호
            status: 1, //상태 1정상 2삭제 3숨김 ---
            regDate: moment(), //생성일
            //regIp: { type: String }, //작성 아이피
            //reply: { type: Array, default: null }, //댓글 _id값 배열로 가지고 있자
            view_type: 1, //1이면 사장님들문의  2면 유저들문의
          }).save();
          res.json({
            type: 1,
            message: "ok",
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  //1대1문의 리스트
  app.get("/question_list/:type", async function (req, res) {
    try {
      let data;
      if (req.params.type == 1) {
        if (req.query.key == Key.key && req.query.user_id) {
          data = await Board.info_question
            .find({
              writer: req.query.user_id, //작성자 아이디
              status: 1,
              view_type: 1,
            })
            .sort({ _id: -1 });
        }
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([
        {
          type: 0,
          message: Send_message,
        },
      ]);
    }
  });

  //1대1문의 답변 작성 -> 의미없음 나중에 다시만들어야함
  app.get("/question_reply_register", async function (req, res) {
    try {
      let data = await Board.info_question.find({
        reply: [],
      }); //답변이 안달린것을 찾아서
      for (var a = 0; a < data.length; a++) {
        let create_reply = await Board.info_question_reply({
          iq_id: data[a]._id,
          contents: "a는 1234  " + a, //내용
          //writer: { type: String, default: "admin" }, //작성자 아이디
          regDate: moment(), //생성일
        }).save();
        await Board.info_question.findOneAndUpdate(
          {
            _id: data[a]._id,
          },
          { $push: { reply: create_reply._id } }
        );
      } //답변달고 info_question에 답변의 아이디값 넣어주기
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //1대1문의 답변 가져오기
  app.get("/question_reply", async function (req, res) {
    try {
      let data;
      if (req.query.key == Key.key && req.query.iq_id) {
        data = await Board.info_question_reply.find({
          iq_id: mongoose.Types.ObjectId(req.query.iq_id),
        });
        res.json(data);
      } else {
        //키값 다르면 && req.query.iq_id이 없으면 탈락
        res.json([{ type: 0, message: Send_message }]);
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //1대1문의 수정
  app.patch("/question_revise", async function (req, res) {
    try {
      console.log(req.body);
      if (req.body.key == Key.key && req.body.iq_id) {
        let chk_revise = await Board.info_question.findOne({
          _id: mongoose.Types.ObjectId(req.body.iq_id),
        });
        if (chk_revise) {
          if (chk_revise.reply.length > 0) {
            res.json({
              type: 1,
              message: "답변이 완료된 글은 수정이 불가능합니다.",
            });
          }
        }
        let revise_data = await Board.info_question.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.iq_id) },
          {
            $set: {
              title: req.body.title,
              contents: req.body.contents,
              revise_Date: moment(),
            },
          }
        );
        res.json({
          type: 1,
          message: "ok",
        });
      } else {
        res.json({
          type: 0,
          message: Send_message,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  //1대1문의 삭제
  app.patch("/question_delete", async function (req, res) {
    try {
      if (req.body.key == Key.key && req.body.iq_id) {
        await Board.info_question.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.iq_id) },
          { $set: { status: 2 } }
        );
        res.json({ type: 1, message: "ok" });
      } else {
        res.json({ type: 0, message: Send_message });
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  //피드백주기
  app.post("/feedback_register/:type", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        if (req.body.title && req.body.contents) {
          await Board.info_feedback({
            writer: req.body.writer, //작성자 아이디
            writer_name: req.body.writer_name, //작성자 이름
            title: req.body.title, //제목
            contents: req.body.contents, //내용
            //number: { type: Number }, //글 번호
            status: 1, //상태 1정상 2삭제 3숨김 ---
            regDate: moment(), //생성일
            //regIp: { type: String }, //작성 아이피
            view_type: req.params.type, //1이면 사장님들이 피드백  2면 유저들이 피드뱍
          }).save();
          res.json({
            type: 1,
            message: "ok",
          });
        } else {
          res.json({
            type: 0,
            message: "제목과 내용을 입력해주세요.",
          });
        }
      } else {
        res.json({
          type: 0,
          message: Send_message,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  app.get("/brand_data", async function (req, res) {
    try {
      let data = await Car.info_car.find({ view_type: 1 });

      let chk_data2 = data.reduce((prev, now) => {
        if (!prev.some((obj) => obj.brand_id === now.brand_id)) {
          prev.push(now);
        }
        return prev;
      }, []);
      data = chk_data2;
      let type1 = [
        "현대",
        "제네시스",
        "기아",
        "쉐보레/대우",
        "르노삼성",
        "쌍용",
        "어울림모터스",
        "기타국산차",
      ];
      for (var a = 0; a < data.length; a++) {
        let type;
        if (type1.indexOf(data[a].brand) != -1) {
          type = 1;
        } else {
          type = 2;
        }
        await Car.info_brand({
          brand: data[a].brand,
          brand_id: data[a].brand_id,
          brand_type: type, //1국산 2수입 3기타
        }).save();
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });

  //전체 브랜드 보기
  app.get("/show_brand", async function (req, res) {
    try {
      let data = await Car.info_brand.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
    }
  });

  //브랜드 국산 수입 불러오기
  app.get("/brand_list/:type", async function (req, res) {
    try {
      let data;
      if (req.params.type == 1) {
        //국산차
        data = await Car.info_brand
          .find({ brand_type: 1, view_type: 1 })
          .sort({ view_sort: 1 });
      } else if (req.params.type == 2) {
        //수입차
        data = await Car.info_brand
          .find({ brand_type: 2, view_type: 1 })
          .sort({ view_sort: 1 });
      } else {
        data = {};
      }
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([
        {
          type: 0,
          message: Send_message,
        },
      ]);
    }
  });

  //처음에 비활성화 상태. 초기화누르면 모두 비활성화

  //브랜드에 따른 차종 가져오기
  app.get("/model_list/:brand", async function (req, res) {
    try {
      let data;
      if (req.params.brand) {
        console.log(req.params.brand);
        data = await Car.info_car.find({
          brand: req.params.brand,
          view_type: 1,
        });
        let chk_data2 = data.reduce((prev, now) => {
          if (!prev.some((obj) => obj.model_id === now.model_id)) {
            prev.push(now);
          }
          return prev;
        }, []);
        data = chk_data2;
      }
      console.log(data);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //차종에 세부모델들 가져오기
  app.get("/model_detail_list/:brand/:model", async function (req, res) {
    try {
      let data;
      if (req.params.brand && req.params.model) {
        data = await Car.info_car.find({
          brand: req.params.brand,
          model: req.params.model,
          view_type: 1,
        });
        let chk_data2 = data.reduce((prev, now) => {
          if (
            !prev.some((obj) => obj.model_detail_id === now.model_detail_id)
          ) {
            prev.push(now);
          }
          return prev;
        }, []);
        data = chk_data2;
      }
      console.log(data.length);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  app.get("/get_store", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query._id) {
          //유저아이디의 _id
          let chk_user = await User.info_user.findOne({
            _id: mongoose.Types.ObjectId(req.query._id),
          });
          if (chk_user) {
            let chk_data = await Store.info_store.findOne({
              store_user_id: chk_user.iu_id,
            });
            if (chk_data) {
              return res.json([chk_data]);
            } else {
              return res.json([{ type: 2 }]); //아직
            }
          } else {
            return res.json([{ type: 0, message: Send_message }]);
          }
        } else {
          return res.json([{ type: 0, message: Send_message }]);
        }
      } else {
        return res.json([{ type: 0, message: Send_message }]);
      }
    } catch (err) {
      console.log(err);
      return res.json([{ type: 0, message: Send_message }]);
    }
  });

  //매장운영 저장하기
  app.post("/store_register", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        if (req.body._id == "new") {
          await Store.info_store({
            store_user_id: req.body.route.user_id,
            store_name: req.body.storeName,
            store_logo_image: req.body.logoUri,
            store_image: req.body.storeUri,
            store_ceo: req.body.storeCeo,
            store_ceo_birthday: req.body.birthday,
            store_address: req.body.address,
            store_address_detail: req.body.addressDetail,
            store_register: req.body.storeRegister,
            store_register_image: req.body.registerUri,
            store_category: req.body.category,
            store_info: req.body.storeInfo,
            store_labor_cost: req.body.count.LaborCost, //각 배열 원소는 {type:boolean , laborName:String, laborCost1:Number, laborCost2:Number, laborCost:Number}
            store_labor_cost_open: req.body.laborCostOpen,
            store_labor_cost_info: req.body.laborInfo,
            store_operation_time: req.body.count.OperationTime, //각 배열 원소는 {day:[],ampm1:String, ampm2:String, startTiem:Number}
            store_closed_day: req.body.count.ClosedDay, //각 배열 원소는 {week : number, day : String} 2번으로 날짜 지우기
            store_closed_day_temp: req.body.count.ClosedDayTemporary, //각 배열 원소는 {startDay:Date , endDay:Date} 1번으로 날짜 지우기
            store_holiday: req.body.holiday, //공휴일 판별기준??3번으로 날짜 지우기
            store_number: req.body.storeNumber,
          }).save();
          res.json({ type: 1, message: "ok" });
        } else {
          let chk_data = await Store.info_store.findOne({
            _id: mongoose.Types.ObjectId(req.body._id),
          });
          if (chk_data) {
            await Store.info_store.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(req.body._id) },
              {
                $set: {
                  store_user_id: req.body.route.user_id,
                  store_name: req.body.storeName,
                  store_logo_image: req.body.logoUri,
                  store_image: req.body.storeUri,
                  store_ceo: req.body.storeCeo,
                  store_ceo_birthday: req.body.birthday,
                  store_address: req.body.address,
                  store_address_detail: req.body.addressDetail,
                  store_register: req.body.storeRegister,
                  store_register_image: req.body.registerUri,
                  store_category: req.body.category,
                  store_info: req.body.storeInfo,
                  store_labor_cost: req.body.count.LaborCost, //각 배열 원소는 {type:boolean , laborName:String, laborCost1:Number, laborCost2:Number, laborCost:Number}
                  store_labor_cost_open: req.body.laborCostOpen,
                  store_labor_cost_info: req.body.laborInfo,
                  store_operation_time: req.body.count.OperationTime, //각 배열 원소는 {day:[],ampm1:String, ampm2:String, startTiem:Number}
                  store_closed_day: req.body.count.ClosedDay, //각 배열 원소는 {week : number, day : String} 2번으로 날짜 지우기
                  store_closed_day_temp: req.body.count.ClosedDayTemporary, //각 배열 원소는 {startDay:Date , endDay:Date} 1번으로 날짜 지우기
                  store_holiday: req.body.holiday, //공휴일 판별기준??3번으로 날짜 지우기
                },
              }
            );
            res.json({ type: 1, message: "ok" });
          } else {
            res.json({ type: 0, message: Send_message });
          }
        }
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  //작업등록 및 수정
  app.post("/work_register", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        let find_store = await Store.info_store.findOne({
          store_user_id: req.body.route.user_id,
        });
        if (find_store) {
          //매장운영 등록 먼저
          let work_type = "";
          for (var a = 0; a < req.body.work_list_select.length; a++) {
            //선택한 작업종류에 따라 대분류
            let chk = await Work.info_work.findOne({
              _id: mongoose.Types.ObjectId(req.body.work_list_select[a]),
            });
            if (chk) {
              work_type = work_type + chk.work_type;
            }
          }
          let new_work_type = "";
          if (work_type.indexOf(1) != -1) {
            new_work_type = new_work_type + "1";
          }
          if (work_type.indexOf(2) != -1) {
            new_work_type = new_work_type + "2";
          }
          if (work_type.indexOf(3) != -1) {
            new_work_type = new_work_type + "3";
          }
          if (work_type.indexOf(4) != -1) {
            new_work_type = new_work_type + "4";
          }

          await Work.store_work({
            store_id: find_store._id, //info_store의 _id값
            store_user_id: req.body.route.user_id,
            store_thumbnail: req.body.thumbnail, //썸네일사진 uri
            store_work_name: req.body.work_name, //작업명
            store_info_work_type: new_work_type, //작업종류 대분류
            store_info_work: req.body.work_list_select, //작업종류 info_work의 _id값
            store_info_car: req.body.car_list_select, //작업 차량 info_car의 _id값
            store_work_time: req.body.labor_time, //작업시간
            store_work_need_day: req.body.need_day, //최소예약날짜
            store_work_total_cost: req.body.total_cost, //작업 총 가격
            store_work_labor_cost: req.body.labor_cost, //작업 총 가격중 공임가격
            store_work_cost_open: req.body.costOpen, //true ->공임가격 공개 false -> 총가격만 표시
            store_work_info: req.body.work_info, //작업 설명
            store_work_stop: false, //일시정지여부
            store_work_del: false, //삭제
            store_work_tag: req.body.tag, //해쉬태그
            store_work_regdate: moment(), //등록시간
          }).save();
          return res.json({ type: 1, message: "ok" });
        } else {
          return res.json({
            type: 0,
            message: "매장운영을 먼저 작성해주세요.",
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  app.get("/work_list", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id) {
          let car_id = {};
          let new_car_id = {};
          let work_id = {};
          let new_work_id = {};
          if (req.query.car_id) {
            let car_arr = [];
            if (req.query.car_id.indexOf(",") != -1) {
              let car_data = req.query.car_id.split(",");
              for (var a = 0; a < car_data.length; a++) {
                car_arr.push(car_data[a]);
              }
              car_arr.push("all");
              car_id = {
                $in: car_arr,
              };
            } else {
              car_id = {
                $in: [req.query.car_id, "all"],
              };
            }
            new_car_id = { store_info_car: car_id };
          }
          if (req.query.car_id == "all") {
            new_car_id = {};
          }
          if (req.query.work_id) {
            let work_arr = [];
            if (req.query.work_id.indexOf(",") != -1) {
              let work_data = req.query.work_id.split(",");
              for (var a = 0; a < work_data.length; a++) {
                work_arr.push(work_data[a]);
              }
              work_id = {
                $in: work_arr,
              };
            } else {
              work_id = {
                $in: [req.query.work_id],
              };
            }
            new_work_id = { store_info_work: work_id };
          }
          let data = await Work.store_work.aggregate([
            {
              $match: {
                store_user_id: req.query.user_id,
                store_work_del: false,
              },
            },
            { $match: new_work_id },
            { $match: new_car_id },
            //store_info_car 의 배열안에 원소들이 String이어서 _id로 조회가 되지 않음
            //info_car데이터에 _id 값을 String으로 갖는 info_car_id값 추가/
            {
              $lookup: {
                from: "info_cars",
                localField: "store_info_car",
                foreignField: "info_car_id",
                as: "cars",
              },
            },
            {
              $lookup: {
                from: "info_works",
                localField: "store_info_work",
                foreignField: "info_work_id",
                as: "works",
              },
            },
          ]);
          if (data.length == 0) {
            data = [{ type: 3 }];
          }
          res.json(data);
        }
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //info_car데이터에 _id 값을 String으로 갖는 info_car_id값 추가/
  app.get("/info_work", async function (req, res) {
    try {
      let data = await Work.info_work.find();
      for (var a = 0; a < data.length; a++) {
        await Work.info_work.findOneAndUpdate(
          { _id: data[a]._id },
          { $set: { info_work_id: data[a]._id } }
        );
        console.log(data.length);
        console.log(a);
      }
      res.json("gd");
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });

  app.patch("/work_list/:type", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        if (req.params.type == "revise") {
          if (
            req.body.route.route.params.user_id ==
            req.body.route.item.store_user_id
          ) {
            let work_type = "";
            for (var a = 0; a < req.body.work_list_select.length; a++) {
              //선택한 작업종류에 따라 대분류
              let chk = await Work.info_work.findOne({
                _id: mongoose.Types.ObjectId(req.body.work_list_select[a]),
              });
              if (chk) {
                work_type = work_type + chk.work_type;
              }
            }
            let new_work_type = "";
            if (work_type.indexOf(1) != -1) {
              new_work_type = new_work_type + "1";
            }
            if (work_type.indexOf(2) != -1) {
              new_work_type = new_work_type + "2";
            }
            if (work_type.indexOf(3) != -1) {
              new_work_type = new_work_type + "3";
            }
            if (work_type.indexOf(4) != -1) {
              new_work_type = new_work_type + "4";
            }
            await Work.store_work.findOneAndUpdate(
              { _id: mongoose.Types.ObjectId(req.body.route.item._id) },
              {
                $set: {
                  store_thumbnail: req.body.thumbnail,
                  store_work_name: req.body.work_name,
                  store_info_work_type: new_work_type,
                  store_info_work: req.body.work_list_select,
                  store_info_car: req.body.car_list_select,
                  store_work_time: req.body.labor_time,
                  store_work_need_day: req.body.need_day,
                  store_work_total_cost: req.body.total_cost,
                  store_work_labor_cost: req.body.labor_cost,
                  store_work_cost_open: req.body.costOpen,
                  store_work_info: req.body.work_info,
                  store_work_tag: req.body.tag,
                  store_work_revisedate: moment(),
                },
              }
            );
          } else {
            res.json({ type: 0, message: Send_message });
          }
        } else {
          if (req.body.route.user_id == req.body.item.store_user_id) {
            //로그인한 아이디랑 가게 주인 아이디랑 같아야함
            if (req.params.type == "delete") {
              await Work.store_work.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(req.body.item._id) },
                { $set: { store_work_del: true, store_work_deldate: moment() } }
              );
            } else if (req.params.type == "pause") {
              await Work.store_work.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(req.body.item._id) },
                {
                  $set: {
                    store_work_stop: true,
                    store_work_stopdate: moment(),
                  },
                }
              );
            } else if (req.params.type == "open") {
              await Work.store_work.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(req.body.item._id) },
                { $set: { store_work_stop: false } }
              );
            }
          } else {
            res.json({ type: 0, message: Send_message });
          }
        }
      } else {
        res.json({ type: 0, message: Send_message });
      }
      res.json({ type: 1, message: "ok" });
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  app.get("/review_list", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id) {
          let car_id = {};
          let new_car_id = {};
          let work_id = {};
          let new_work_id = {};
          if (req.query.car_id) {
            let car_arr = [];
            if (req.query.car_id.indexOf(",") != -1) {
              let car_data = req.query.car_id.split(",");
              for (var a = 0; a < car_data.length; a++) {
                car_arr.push(car_data[a]);
              }
              car_arr.push("all");
              car_id = {
                $in: car_arr,
              };
            } else {
              car_id = {
                $in: [req.query.car_id, "all"],
              };
            }
            new_car_id = { store_info_car: car_id };
          }
          if (req.query.car_id == "all") {
            new_car_id = {};
          }
          if (req.query.work_id) {
            let work_arr = [];
            if (req.query.work_id.indexOf(",") != -1) {
              let work_data = req.query.work_id.split(",");
              for (var a = 0; a < work_data.length; a++) {
                work_arr.push(work_data[a]);
              }
              work_id = {
                $in: work_arr,
              };
            } else {
              work_id = {
                $in: [req.query.work_id],
              };
            }
            new_work_id = { store_info_work: work_id };
          }
          let data = await Work.store_work.aggregate([
            {
              $match: {
                store_user_id: req.query.user_id,
                store_work_del: false,
              },
            },
            { $match: new_work_id },
            { $match: new_car_id },
            {
              $lookup: {
                from: "info_cars",
                localField: "store_info_car",
                foreignField: "info_car_id",
                as: "cars",
              },
            },
            {
              $lookup: {
                from: "info_works",
                localField: "store_info_work",
                foreignField: "info_work_id",
                as: "works",
              },
            },
            {
              $lookup: {
                from: "review_works",
                localField: "_id",
                foreignField: "review_store_work_id",
                as: "reviews",
              },
            },
            {
              $lookup: {
                from: "info_users",
                localField: "reviews.review_user_id",
                foreignField: "iu_id",
                as: "review_users",
              },
            },
          ]);
          for (var a = 0; a < data.length; a++) {
            let reply_count = await Work.review_work.countDocuments({
              review_store_work_id: data[a]._id,
              review_owner_reply: 1,
            });
            data[a].owner_reply_count = reply_count;
          }

          if (data.length == 0) {
            data = [{ type: 3 }];
          }
          res.json(data);
        }
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //사장님의 댓글달기
  app.patch("/review_owner_reply", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        let chk_data = await Work.review_work.findOneAndUpdate(
          { _id: req.body.data._id },
          {
            $set: {
              review_owner_reply: 1,
              review_owner_reply_contents: req.body.reply_contents,
              review_owner_reply_regdate: moment(),
            },
          }
        );
      }
      res.json({ type: 1, message: "ok" });
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });
  //예약데이터 디비에 직접 집어넣기. 작업완료 후 삭제
  app.get("/reservation_data_push", async function (req, res) {
    try {
      let chk_data = await Work.store_work.findOne({ store_user_id: "ywack3" });
      let time = "0900";
      for (var a = 0; a < 1; a++) {
        await Work.reservation_work({
          reservation_store_work_id: chk_data._id, //작업의 _id값
          reservation_user_id: "ywack3", //예약한 유저 아이디
          reservation_store_user_id: "ywack3", //사장님 아이디
          reservation_user_car: mongoose.Types.ObjectId(
            "5f8f01ded5f8c2056178a7a1"
          ), //예약한 유저의 자동차_id값
          reservation_user_car_number: "25너2551", //예약한 유저의 자동차 번호
          reservation_date: moment().format("YYYY-MM-DD"), //예약날짜
          reservation_start_time: "1600", //작업 예약시간
          reservation_type: 0, //0 예약대기 1예약완료 2작업중 3작업완료
          //reservation_cancel_contents: { type: String }, //취소사유
          reservation_contents: a + "gdgdgeb1fbebe", //작업 요청사항
          reservation_payment: 0, //작업 결제방식
          reservation_regdate: moment(), //예약한 시간
        }).save();
      }
      res.json("gd");
      /**
       * 
       * let reservation_work = new Schema({
  //작업 예약
  reservation_store_work_id: { type: mongoose.Types.ObjectId }, //작업의 _id값
  reservation_user_id: { type: String }, //예약한 유저 아이디
  reservation_store_user_id: { type: String }, //사장님 아이디
  reservation_date: { type: Date }, //예약날짜
  reservation_start_time: { type: String }, //작업 예약시간
  reservation_type: { type: Number }, //0 예약대기 1예약완료 2작업중 3작업완료
  reservation_cancel_contents: { type: String }, //취소사유
  reservation_contents: { type: String }, //작업 요청사항
  reservation_payment: { type: Number }, //작업 결제방식
  reservation_regdate: { type: Date }, //예약한 시간
});
       */
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });
  //예약일정 가져오기 - 날짜
  app.get("/reservation_date", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id && req.query.date) {
          let data = await Work.reservation_work.aggregate([
            {
              $match: {
                reservation_store_user_id: req.query.user_id,
                $or: [{ reservation_type: 1 }, { reservation_type: 0 }],
                reservation_date: new Date(
                  moment(req.query.date).format("YYYY-MM-DD")
                ),
              },
            },
            {
              $lookup: {
                from: "store_works",
                localField: "reservation_store_work_id",
                foreignField: "_id",
                as: "works",
              },
            },
            {
              $lookup: {
                from: "info_stores",
                localField: "works.store_id",
                foreignField: "_id",
                as: "stores",
              },
            },
            {
              $lookup: {
                from: "info_users",
                localField: "reservation_store_user_id",
                foreignField: "iu_id",
                as: "users",
              },
            },
            {
              $lookup: {
                from: "info_cars",
                localField: "reservation_user_car",
                foreignField: "_id",
                as: "cars",
              },
            },
            {
              $sort: {
                reservation_start_time: 1,
              },
            },
          ]);
          if (data.length == 0) {
            data = [{ type: 1, message: "ok", _id: "null" }];
          }
          console.log(data);
          res.json(data);
        } else {
          res.json([{ type: 0, message: Send_message }]);
        }
      } else {
        res.json([{ type: 0, message: Send_message }]);
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });
  //예약불가시간 - 날짜
  app.get("/lock_time_date", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id && req.query.date) {
          let data = await Store.info_store_lock_time.aggregate([
            {
              $match: {
                store_user_id: req.query.user_id,
                lock_time_date: new Date(
                  moment(req.query.date).format("YYYY-MM-DD")
                ),
              },
            },
          ]);
          if (data.length == 0) {
            data = [{ type: 1, message: "ok", _id: "null" }];
          }
          console.log(data);
          res.json(data);
        } else {
          res.json([{ type: 0, message: Send_message }]);
        }
      } else {
        res.json([{ type: 0, message: Send_message }]);
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });
  //예약불가시간 저장
  app.post("/lock_time_date", async function (req, res) {
    try {
      console.log(req.body);
      if (req.body.key == Key.key) {
        if (req.body.user_id && req.body.date && req.body.lock_time) {
          let chk_data = await Store.info_store_lock_time.findOne({
            store_user_id: req.body.user_id,
            lock_time_date: new Date(
              moment(req.body.date).format("YYYY-MM-DD")
            ),
          });
          if (chk_data) {
            await Store.info_store_lock_time.findOneAndUpdate(
              {
                store_user_id: req.body.user_id,
                lock_time_date: new Date(
                  moment(req.body.date).format("YYYY-MM-DD")
                ),
              },
              { $set: { lock_time: req.body.lock_time } }
            );
          } else {
            let chk_store = await Store.info_store.findOne({
              store_user_id: req.body.user_id,
            });
            if (chk_store) {
              await Store.info_store_lock_time({
                store_user_id: req.body.user_id,
                store_id: mongoose.Types.ObjectId(chk_store._id),
                store_id_string: chk_store._id.toString(),
                lock_time_date: new Date(
                  moment(req.body.date).format("YYYY-MM-DD")
                ),
                lock_time: req.body.lock_time,
              }).save();
            } else {
              res.json({ type: 0, message: Send_message + 1 });
            }
          }
          res.json({ type: 1, message: "ok" });
        } else {
          res.json({ type: 0, message: Send_message + 2 });
        }
      } else {
        res.json({ type: 0, message: Send_message + 3 });
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message + 4 });
    }
  });
  //예약이 있는지 여부 가져오기 - 달 + 임시휴무일 공휴일 운영시간이 없는요일 체크해서 넘겨야함 {disabled: true},
  app.get("/reservation_month", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id && req.query.date) {
          let month_data = {};
          let data = await Work.reservation_work.aggregate([
            {
              $match: {
                reservation_store_user_id: req.query.user_id,
                $or: [{ reservation_type: 1 }, { reservation_type: 0 }],
                reservation_date: {
                  $gte: new Date(
                    moment(req.query.date, "YYYY-MM")
                      .startOf("month")
                      .format("YYYY-MM-DD")
                  ),
                  $lte: new Date(
                    moment(req.query.date, "YYYY-MM")
                      .endOf("month")
                      .format("YYYY-MM-DD")
                  ),
                },
              },
            },
            { $sort: { reservation_date: 1 } },
          ]); //기간으로
          for (var a = 0; a < data.length; a++) {
            let string_date = moment(data[a].reservation_date)
              .format("YYYY-MM-DD")
              .toString();
            month_data[string_date] = { marked: true };
          }
          res.json([month_data]);
        }
      }
    } catch (err) {
      console.log(err);
      res.json([{ type: 0, message: Send_message }]);
    }
  });

  //매장의 운영시간에 따른 기본 데이터값 가져오기
  app.get("/reservation_get_store", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        if (req.query._id) {
          //유저아이디의 _id
          let chk_user = await User.info_user.findOne({
            _id: mongoose.Types.ObjectId(req.query._id),
          });
          if (chk_user) {
            let chk_data = await Store.info_store.findOne({
              store_user_id: chk_user.iu_id,
            });
            if (chk_data) {
              let operation_time = [];
              for (var a = 0; a < chk_data.store_operation_time.length; a++) {
                if (chk_data.store_operation_time[a].mon == true) {
                  operation_time.push({
                    id: 1,
                    day: "mon",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].tue == true) {
                  operation_time.push({
                    id: 2,
                    day: "tue",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].wen == true) {
                  operation_time.push({
                    id: 3,
                    day: "wen",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].thu == true) {
                  operation_time.push({
                    id: 4,
                    day: "thu",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].fri == true) {
                  operation_time.push({
                    id: 5,
                    day: "fri",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].sat == true) {
                  operation_time.push({
                    id: 6,
                    day: "sat",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
                if (chk_data.store_operation_time[a].sun == true) {
                  operation_time.push({
                    id: 7,
                    day: "sun",
                    ampm1: chk_data.store_operation_time[a].ampm1,
                    startTime: chk_data.store_operation_time[a].startTime,
                    ampm2: chk_data.store_operation_time[a].ampm2,
                    endTime: chk_data.store_operation_time[a].endTime,
                  });
                }
              }
              operation_time.sort(function (a, b) {
                return a.id - b.id;
              });
              let operation_time_data = [];
              for (var b = 0; b < operation_time.length; b++) {
                let new_array = [];
                let time_diff = moment(
                  moment(
                    operation_time[b].ampm2 + operation_time[b].endTime,
                    "aHH:mm"
                  )
                ).diff(
                  moment(
                    moment(
                      operation_time[b].ampm1 + operation_time[b].startTime,
                      "aHH:mm"
                    )
                  ),
                  "m"
                );
                let time_space = parseInt(time_diff / 30);
                for (var c = 0; c <= time_space; c++) {
                  if (c == 0) {
                    new_array.push(operation_time[b].day);
                  }
                  new_array.push(
                    moment(
                      moment(
                        operation_time[b].ampm1 + operation_time[b].startTime,
                        "aHH:mm"
                      ).add(30 * c, "m")
                    ).format("HHmm")
                  );
                }
                operation_time_data.push(new_array);
              }
              return res.json(operation_time_data);
            } else {
              return res.json([{ type: 2 }]); //아직
            }
          } else {
            return res.json([{ type: 0, message: Send_message }]);
          }
        } else {
          return res.json([{ type: 0, message: Send_message }]);
        }
      } else {
        return res.json([{ type: 0, message: Send_message }]);
      }
    } catch (err) {
      console.log(err);
      return res.json([{ type: 0, message: Send_message }]);
    }
  });

  //예약세부일정 사장님이 취소
  app.patch("/reservation_cancel", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        let chk_data = await Work.reservation_work.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.data._id) },
          {
            $set: {
              reservation_type: 2,
              reservation_cancel_contents: req.body.contents,
              reservation_cancel_date: moment(),
            },
          }
        );
        res.json({ type: 1, message: "ok" });
      } else {
        res.json({ type: 0, message: Send_message });
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  app.get("/reservation_list", async function (req, res) {
    try {
      if (req.query.key == Key.key) {
        let data = await Work.reservation_work.aggregate([
          {
            $match: {
              reservation_store_user_id: req.query.user_id,
              $or: [{ reservation_type: 1 }, { reservation_type: 5 }],
            },
          },
          {
            $lookup: {
              from: "store_works",
              localField: "reservation_store_work_id",
              foreignField: "_id",
              as: "works",
            },
          },
          {
            $lookup: {
              from: "info_stores",
              localField: "works.store_id",
              foreignField: "_id",
              as: "stores",
            },
          },
          {
            $lookup: {
              from: "info_users",
              localField: "reservation_store_user_id",
              foreignField: "iu_id",
              as: "users",
            },
          },
          {
            $lookup: {
              from: "info_cars",
              localField: "reservation_user_car",
              foreignField: "_id",
              as: "cars",
            },
          },
          {
            $sort: {
              reservation_date: 1,
              reservation_start_time: 1,
            },
          },
        ]);
        if (data.length == 0) {
          data = [{ type: 1, message: "ok", _id: "null" }];
        }
        res.json(data);
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });

  //유저 알림 설정변경
  app.post("/user_alarm", async function (req, res) {
    try {
      if (req.body.key == Key.key) {
        if (req.body.type == "notice") {
          await User.info_user.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(req.body.user_id) },
            { $set: { alarm_notice: req.body.num } }
          );
        } else if (req.body.type == "review") {
          await User.info_user.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(req.body.user_id) },
            { $set: { alarm_review: req.body.num } }
          );
        }
        res.json({ type: 1, message: "ok" });
      } else {
        res.json({ type: 0, message: Send_message });
      }
    } catch (err) {
      console.log(err);
      res.json({ type: 0, message: Send_message });
    }
  });
};
