let express = require("express");
let app = express();
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
reloadMagic(app);
app.use("/", express.static("build"));
app.use("/uploads", express.static("uploads"));
app.use("/", express.static("public"));
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-pwkrp.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("Baby-Book");
});

app.post("/login", upload.none(), (req, res) => {
  console.log("login", req.body);
  let name = req.body.username;
  let pwd = req.body.password;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user.password === pwd) {
      let sessionId = "" + Math.floor(Math.random() * 1000000);
      dbo
        .collection("cookies")
        .updateOne({ username: name }, { $set: { sessionId: sessionId } });
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true, friends: userFriends }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
  });
});

app.post("/logout", upload.none(), (req, res) => {
  console.log("I am in the logout enpoint");
  console.log("I am in the logout body", req.body);
  res.clearCookie("sid");
  // we also need to make sure that the cookie is removed form the collection on mongodb
  let sessionId = req.cookies.sid;
  delete sessions[sessionId];
  res.clearCookie("sid");
  res.send(JSON.stringify({ success: true }));
});

app.post("/signup", upload.none(), (req, res) => {
  console.log("signup", req.body);
  let name = req.body.username;
  let pwd = req.body.password;
  let bio = req.body.bio;
  let sessionId = "" + Math.floor(Math.random() * 1000000);
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/signup error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      dbo.collection("users").insertOne({
        username: name,
        password: pwd,
        bio: bio,
        friends: []
      });
      dbo
        .collection("cookies")
        .insertOne({ username: name, sessionId: sessionId });
      res.send(JSON.stringify({ success: true }));
      return;
    } else res.send(JSON.stringify({ success: false }));
  });
});

app.get("/checkForUser", (req, res) => {
  let sid = req.cookies.sid;
  dbo.collection("cookies").findOne({ sessionId: sid }, (err, doc) => {
    if (doc) {
      res.send(JSON.stringify({ success: true, username: doc.username }));
    } else res.send(JSON.stringify({ success: false }));
  });
});

app.get("/allposts", (req, res) => {
  let cookie = req.cookies.sid;
  ///we make a request to the cookies collection and if the cookie does exist we res.send a error object and we leave the function.
  dbo
    .collection("posts")
    .find({})
    .toArray((error, posts) => {
      if (error) {
        console.log("error", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify(posts));
    });
});

app.post("/new-post", upload.single("file"), (req, res) => {
  console.log("request to /new-post. body: ", req.body);
  let description = req.body.description;
  let file = req.file;
  console.log("request to /new-post. body: ", file);
  let frontendPath = undefined;
  let type = "text";
  if (file !== undefined) {
    frontendPath = "/uploads/" + file.filename;
    type = file.mimetype.split("/")[0];
  }
  console.log("UPLOADED FILE:", file);

  dbo.collection("posts").insertOne({
    description: description,
    frontendPath: frontendPath,
    username: req.body.username,
    type: type,
    likes: [],
    comments: []
  });
  res.send(JSON.stringify({ success: true }));
});

app.post("/comments", upload.none(), (req, res) => {
  let newComments = JSON.parse(req.body.newComments);
  let postId = req.body.id;

  dbo.collection("posts").updateOne(
    { _id: ObjectID(postId) },
    {
      $set: {
        comments: newComments
      }
    }
  );
  res.send(JSON.stringify({ success: true }));
});

app.get("/delete", (req, res) => {
  dbo.collection("posts").deleteMany();
  res.send(JSON.stringify({ success: true }));
});

app.post("/editPost", upload.single("file"), (req, res) => {
  let id = req.body.id;
  dbo
    .collection("posts")
    .updateOne(
      { _id: ObjectID(id) },
      { $set: { description: req.body.description } }
    );
  res.send(JSON.stringify({ success: true }));
});

app.post("/deleteOne", upload.none(), (req, res) => {
  let id = req.body.id;
  dbo.collection("posts").deleteOne({ _id: ObjectID(id) });
  res.send(JSON.stringify({ success: true }));
});

app.post("/deleteMoment", upload.none(), (req, res) => {
  //we need to accept an array of moments(it might be a string; HINT: PARSE). we will also receeive the id for the moments
  //we need to find the matching momoents object in the milestones' collection.
  //we will need to update this object with our new filtered moments.

  let newMoments = JSON.parse(req.body.newMoments);
  // let postId = req.body.id;

  let id = req.body.id;

  dbo
    .collection("milestones")
    .updateOne({ _id: ObjectID(id) }, { $set: { moments: newMoments } });
  res.send(JSON.stringify({ success: true }));
});

app.post("/profile", upload.single("img"), (req, res) => {
  console.log("request to upload a profile");
  let objForUpdate = {};
  if (req.body.name) objForUpdate.name = req.body.name;
  if (req.body.username) objForUpdate.username = req.body.username;
  if (req.body.location) objForUpdate.location = req.body.location;
  if (req.body.interests) objForUpdate.interests = req.body.interests;
  if (req.body.likes) objForUpdate.likes = req.body.likes;
  if (req.file) objForUpdate.profilePic = "/uploads/" + req.file.filename;
  if (req.body.bio) objForUpdate.bio = req.body.bio;

  // let sid = req.cookies.sid;
  // let name = req.body.name;
  // let username = req.body.username;
  // let location = req.body.location;
  // let interests = req.body.interests;
  // let likes = req.body.likes;
  // let file = req.file;
  // let bio = req.body.bio;
  // let frontendPath = null;

  dbo.collection("users").update(
    { username: req.body.username },
    {
      $set: {
        ...objForUpdate
      }
    },
    (error, insertedUser) => {
      if (error) {
        console.log("/profile error", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify({ success: true }));
    }
  );
});

app.post("/users", upload.none(), (req, res) => {
  let username = req.body.username;
  console.log("/users endpoint hit");
  dbo
    .collection("users")
    .find({ username: username })
    .toArray((error, user) => {
      if (error) {
        console.log("error", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify(user));
      return;
    });
});

app.post("/firsts", upload.single("file"), (req, res) => {
  let username = req.body.username;
  let firsts = req.body.firsts;
  let file = req.file;
  let date = req.body.date;
  let moment = { firsts, date, frontendPath: "/uploads/" + file.filename };

  dbo.collection("milestones").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log("/firsts error", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    if (user === null) {
      console.log("user DOESNT EXIST");
      dbo
        .collection("milestones")
        .insertOne({ username: username, moments: [moment] });
      (error, insertedUser) => {
        if (error) {
          console.log("/firsts error", error);
          res.send(JSON.stringify({ success: false }));
          return;
        }
        console.log("user added");
        res.send(JSON.stringify({ success: true }));
        return;
      };
      return;
    }
    if (user.username === username) {
      dbo
        .collection("milestones")
        .update({ username: username }, { $push: { moments: moment } });
      res.send(JSON.stringify({ success: true }));
      return;
    }
  });
});

app.post("/milestones", upload.none(), (req, res) => {
  console.log("request to get /milestones");
  let username = req.body.username;
  console.log(username, "********************username");
  dbo
    .collection("milestones")
    .findOne({ username: username }, (error, milestones) => {
      if (error) {
        console.log("error", error);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      if (milestones) res.send(JSON.stringify(milestones));
      else res.send(JSON.stringify([]));
    });
});

app.post("/likes", upload.none(), (req, res) => {
  console.log("POST to /likes:", req.body);
  let postId = req.body.postId;
  let username = req.body.username;
  // dbo.collection("posts").findOne({ _id: ObjectID(postId) }, (error, post) => {
  //   if (error || post === null) {
  //     console.log("ERROR or null post");
  //     return res.json({ success: false });
  // }
  // console.log("POST:", post);
  // let likes = post.likes || [];
  // likes.push(username);
  dbo
    .collection("posts")
    .updateOne(
      { _id: ObjectID(postId) },
      { $push: { likes: username } },
      (error, updatedPost) => {
        if (error) {
          console.log("ERROR updating post");
          return res.json({ success: false });
        }
        console.log("UPDATED POST:", updatedPost);
        res.json({ success: true });
      }
    );
});

app.post("/getProfile", upload.none(), (req, res) => {
  console.log("request to upload a profile pic");
  let name = req.body.name;
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("error!");
      res.send(JSON.stringify({ success: false }));
      return;
    }
    console.log("user", user);
    res.send(JSON.stringify({ success: true, user: user }));
  });
});

app.post("/requests", upload.none(), (req, res) => {
  let from = req.body.from;
  let to = req.body.to;
  dbo.collection("requests").findOne({ from: from, to: to }, (err, doc) => {
    if (doc === null) {
      dbo.collection("requests").insertOne({ from: from, to: to });
      (error, insertedUser) => {
        if (error) {
          console.log("/requests error", error);
          res.send(JSON.stringify({ success: false }));
          return;
        }
        console.log("user added");
        res.send(JSON.stringify({ success: true }));
        return;
      };
    } else res.send(JSON.stringify({ success: false }));
  });
});

app.post("/displayfriendsReq", upload.none(), (req, res) => {
  let username = req.body.username;
  dbo
    .collection("requests")
    .find({ to: username })
    .toArray((err, arr) => {
      res.send(JSON.stringify(arr));
    });
});

app.post("/displayFriends", upload.none(), (req, res) => {
  let username = req.body.username;
  dbo.collection("users").find({ friends: username });
  res.send(JSON.stringify)({ success: true });
});

// displayFriends = async () => {
//   let data = new FormData();
//   console.log("username", this.props.username);
//   data.append("username", this.props.username);
//   let res = await fetch("/displayFriends", { method: "POST", body: data });
//   let body = await res.text();
//   body = JSON.parse(body);
//   this.setState({ friends: body });
// };

app.post("/acceptRequest", upload.none(), (req, res) => {
  let to = req.body.to;
  let from = req.body.from;
  console.log("hit accept endpoint");
  dbo.collection("users").findOne({ username: to }, (err, doc) => {
    console.log("friend request accepted endpoint");
    if (doc !== null) {
      dbo
        .collection("users")
        .updateOne(
          { username: to },
          { $push: { friends: from } },
          (error, insertedUser) => {
            console.log("callback update", insertedUser);
            if (error) {
              console.log("/accept error", error);
              res.send(JSON.stringify({ success: false }));
              return;
            }
            console.log("friend added!");
            dbo
              .collection("users")
              .updateOne({ username: from }, { $push: { friends: to } });
            res.send(JSON.stringify({ success: true }));

            // dbo.collection("requests").deleteOne({ from: from, to: to }, (err, user) => {
            //   if (err) {
            //     res.json({ success: false });
            //     return;
            //   }
            //   res.send(JSON.stringify({ success: true }));
            // });
            return;
          }
        );
    } else {
      res.send(JSON.stringify({ success: false }));
      return;
    }
    // } else res.send(JSON.stringify({ success: false }));
  });
});

//we want to delete the request, same process as the deny request.
//we want to make a fetch request to the users objects in the user collection to add the from as a friend

app.post("/deleteRequest", upload.none(), (req, res) => {
  let to = req.body.to;
  let from = req.body.from;
  console.log(to, from);
  //we want to delete request where the to and the from match thouse of req.body.Hint: both of these must be in the query
  dbo.collection("requests").deleteOne({ from: from, to: to }, (err, user) => {
    if (err) {
      res.json({ success: false });
      return;
    }
    res.send(JSON.stringify({ success: true }));
  });
});

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
