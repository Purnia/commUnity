const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../../models");
const Op = db.Sequelize.Op;
const Chatkit = require('@pusher/chatkit-server');

router.route("/").post(function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const state = req.body.state;
  const city = req.body.city;
  const email = req.body.email;
  const username = req.body.username;
  const password = hashedPW;
  const userType = req.body.userType;

  console.log(username, userType);
  var hashedPW = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
  db.User.findOne({
    where: {
      [Op.or]: [
        {
          username: req.body.username
        },
        {
          email: req.body.email
        }
      ]
    }
  }).then(function (user) {
    if (user) {
      res.redirect("/")
    }

    db.User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      state: req.body.state,
      city: req.body.city,
      email: req.body.email,
      username: req.body.username,
      password: hashedPW,
      userType: req.body.userType
    })
      .then(() => {
        const chatkit = new Chatkit.default({
          instanceLocator: process.env.REACT_APP_INSTANCE_LOCATOR,
          key: process.env.REACT_APP_SECRET_KEY,
        });

        const name = firstname + " " + lastname;
        chatkit.createUser({
          id: username,
          name,
          customData: {
            userType
          }
        })
          .then((response) => {
            console.log('User created successfully\n', response);
            // result.json(response)
          })
          .then(() => {
            if (userType === 'volunteer') {
              chatkit.createRoom({
                creatorId: username,
                name: username,
              })
                .then((results) => {
                  console.log('Room created successfully');
                  db.User.update({
                    roomId: results.id
                  },
                    {
                      where: {
                        username
                      }
                    })
                }).catch((err) => {
                  console.log("Room creation error!!!!!!!!!!!!!!!!\n", err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });



      })
      .then(() => res.redirect("/"))
  }
  )
});

module.exports = router;