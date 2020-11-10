module.exports = (app, passport) => {
  const async = require("async");
  const moment = require("moment");
  const mongoose = require("mongoose");
  const crypto = require("crypto");
  const Key = require("../config/Key");
  const User = require("../models/User.js");
  const Util = require("../models/Util.js");
  const Send_message = "올바른 경로가 아닙니다.";

  app.all("*", async (req, res, next) => {
    try {
      next();
    } catch (err) {
      console.log(err);
      res.send(
        '<script>alert("고객센터로 연락주세요");location.href="/"</script>'
      );
    }
  });

  app.post("/chk_id", async (req, res) => {
    try {
      if (req.query.user_id && req.query.key) {
        req.query.user_id = req.query.user_id.replace(/ /gi, "");
        req.query.user_id = req.query.user_id.toLowerCase();
        if (req.query.key == Key.key) {
          let chk_id = await User.info_user.findOne({
            iu_id: req.query.user_id,
          });
          if (chk_id) {
            return res.json({
              type: 0,
              message: "이미 사용중인 아이디 입니다.",
            });
          } else {
            return res.json({
              type: 1,
              message: "사용 가능한 아이디 입니다.",
            });
          }
        } else {
          return res.json({
            type: 0,
            message: Send_message,
          });
        }
      } else {
        return res.json({
          type: 0,
          message: Send_message,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  app.post("/join", async (req, res) => {
    try {
      if (req.query.key == Key.key) {
        if (req.query.user_id) {
          req.query.user_id = req.query.user_id.replace(/ /gi, "");
          req.query.user_id = req.query.user_id.toLowerCase();
          if (req.query.user_password) {
            if (req.query.user_name) {
              if (req.query.user_phone) {
                if (req.query.user_mail) {
                  let chk_id = await User.info_user.findOne({
                    iu_id: req.query.user_id,
                  });
                  if (chk_id) {
                    return res.json({
                      type: 0,
                      message: "이미 사용중인 아이디 입니다.",
                    });
                  } else {
                    let chk_mail = await User.info_user.findOne({
                      iu_mail: req.query.user_mail,
                    });
                    if (chk_mail) {
                      return res.json({
                        type: 0,
                        message: "이미 사용중인 이메일 입니다.",
                      });
                    } else {
                      let chk_phone = await User.info_user.findOne({
                        iu_phone: req.query.user_phone,
                      });
                      if (chk_phone) {
                        return res.json({
                          type: 0,
                          message: "이미 사용중인 휴대폰번호 입니다.",
                        });
                      } else {
                        let salt =
                          Math.round(new Date().valueOf() * Math.random()) + "";
                        let hashPassword = crypto
                          .createHash("sha512")
                          .update(req.query.user_password + salt)
                          .digest("hex");

                        await User.info_user({
                          iu_id: req.query.user_id,
                          iu_password: hashPassword,
                          iu_salt: salt,
                          iu_mail: req.query.user_mail,
                          iu_phone: req.query.user_phone,
                          iu_type: 1,
                          //iu_code: { type: String, required: true },
                          iu_status: 1,
                          iu_regDate: moment(),
                          //iu_birthDate: { type: String },
                          //iu_car: { type: Array },
                          iu_name: req.query.user_name,
                          //iu_nickname: { type: String, required: true, unique: true },
                          //iu_loginCount: { type: Number },
                          //iu_lastLoginTime: { type: Date },
                          //iu_CRN: { type: String, unique: true },
                          iu_agree1: req.query.agree1,
                          iu_agree2: req.query.agree2,
                          iu_agree3: req.query.agree3,
                          iu_agree4: req.query.agree4,
                          iu_agree5: req.query.agree5,
                          //iu_remark: { type: String, default: null },
                          //iu_memo: { type: String, default: null },
                        }).save();
                        return res.json({
                          type: 1,
                          message: "회원가입 완료",
                        });
                      }
                    }
                  }
                } else {
                  return res.json({
                    type: 0,
                    message: "이메일을 입력해주세요.",
                  });
                }
              } else {
                return res.json({
                  type: 0,
                  message: "휴대폰번호를 입력해주세요.",
                });
              }
            } else {
              return res.json({
                type: 0,
                message: "이름를 입력해주세요.",
              });
            }
          } else {
            return res.json({
              type: 0,
              message: "비밀번호를 입력해주세요.",
            });
          }
        } else {
          return res.json({
            type: 0,
            message: "아이디를 입력해주세요.",
          });
        }
      } else {
        return res.json({
          type: 0,
          message: Send_message,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        type: 0,
        message: Send_message,
      });
    }
  });

  app.post(
    "/login/:type",
    passport.authenticate("login", {
      failureRedirect: "/login_false",
      failureFlash: true,
    }),
    async (req, res) => {
      try {
        if (req.body.key == Key.key) {
          let loginUpdate = await User.info_user.findOneAndUpdate(
            { iu_id: req.body.user_id },
            {
              iu_lastLoginTime: moment(),
              $inc: { iu_loginCount: 1 },
            }
          );
          //로그인 ok 쏴주기
          console.log(await Util.log_session.findOne({}));
          return res.json({
            type: 1,
            message: "ok",
            _id: loginUpdate._id,
            iu_id: loginUpdate.iu_id,
            iu_name: loginUpdate.iu_name,
          });
        } else {
          return res.json({
            type: 0,
            message: Send_message,
          });
        }
      } catch (err) {
        console.log(err);
        return res.send({
          type: 0,
          message: Send_message,
        });
      }
    }
  );

  app.get("/login_false", async (req, res) => {
    //넘어오는 값 구분해서 로그인 실패 json 쏴주기
    try {
      console.log(req);
      return res.json({
        type: 0,
        message: "아이디 및 비밀번호를 확인해주세요.",
      });
    } catch (err) {
      console.log(err);
      return res.json({ type: 0, message: Send_message });
    }
  });
  app.get("/logout", async (req, res) => {
    try {
      let req_ip = req.headers["x-forwarded-for"].split(",");
      await setting.set_socket.findOneAndUpdate(null, {
        $inc: { loginCountChk: 1 },
      });
      let logout = await user.info_user.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(req.user._id) },
        {
          last_date: moment(),
          last_ip: req_ip[0],
          last_site: req.headers.referer,
        }
      );
      req.logout();
      req.flash("loginMessage", "로그아웃되었습니다.");
      res.redirect("/");
    } catch (err) {
      console.log(err);
      res.send(
        '<script>alert("고객센터로 연락주세요");location.href="/"</script>'
      );
    }
  });

  //GET으로
  app.post("/find_id/:type", async (req, res) => {
    try {
      let result_data;
      if (req.params.type == 1) {
        if (req.body.key == Key.key && req.body.user_phone) {
          result_data = await User.info_user.find({
            iu_type: 1, //사장님
            iu_status: 1, //정상
            iu_phone: req.body.user_phone,
            //iu_name : //이름 나중에 추가
          });
          if (result_data.length > 0) {
            let result_id = [];
            let result_regdate = [];
            for (var a = 0; a < result_data.length; a++) {
              result_id.push({
                _id: result_data[a]._id,
                iu_id: result_data[a].iu_id,
                iu_regdate: result_data[a].iu_regDate,
              });
            }
            res.json({
              type: 1,
              message: "ok",
              result: result_id,
            });
          } else {
            res.json({
              type: 0,
              message: "가입된 이력이 없습니다.",
            });
          }
        } else {
          res.json({
            type: 0,
            message: Send_message,
          });
        }
      } //나중에 type == 2추가해야함
      else {
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

  //GET으로
  app.post("/find_password/:type", async (req, res) => {
    try {
      let result_data;
      if (req.params.type == 1) {
        if (
          req.body.key == Key.key &&
          req.body.user_phone &&
          req.body.user_id
        ) {
          result_data = await User.info_user.find({
            iu_type: 1, //사장님
            iu_status: 1, //정상
            iu_phone: req.body.user_phone,
            iu_id: req.body.user_id,
            //iu_name : //이름 나중에 추가
          });
          if (result_data.length > 0) {
            let result_id = [];
            let result_regdate = [];
            for (var a = 0; a < result_data.length; a++) {
              result_id.push({
                _id: result_data[a]._id,
                iu_id: result_data[a].iu_id,
                iu_regdate: result_data[a].iu_regDate,
              });
            }
            res.json({
              type: 1,
              message: "ok",
              result: result_id,
            });
          } else {
            res.json({
              type: 0,
              message: "가입된 이력이 없습니다.",
            });
          }
        } else {
          res.json({
            type: 0,
            message: Send_message,
          });
        }
      } //나중에 type == 2추가해야함
      else {
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

  //PATCH로 변경
  app.post("/change_password/:type", async (req, res) => {
    try {
      let result_data;
      console.log(req.body);
      if (req.params.type == 1) {
        if (
          req.body.key == Key.key &&
          req.body.user_id &&
          req.body.user_password
        ) {
          let find_id = await User.info_user.findOne({
            iu_id: req.body.user_id,
          });
          if (find_id) {
            let salt = find_id.iu_salt;
            let hashPassword = crypto
              .createHash("sha512")
              .update(req.body.user_password + salt)
              .digest("hex");
            await User.info_user.findOneAndUpdate(
              { _id: find_id._id },
              { $set: { iu_password: hashPassword } }
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
        } else {
          res.json({
            type: 0,
            message: Send_message,
          });
        }
      } else {
        //나중에 type == 2추가해야함
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
};
