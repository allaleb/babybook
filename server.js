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
    }
    if (user.password === pwd) {
      let sessionId = "" + Math.floor(Math.random() * 1000000);
      dbo
        .collection("cookies")
        .updateOne({ username: name }, { $set: { sessionId: sessionId } });
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));
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
        bio: bio
      });
      dbo
        .collection("cookies")
        .insertOne({ username: name, sessionId: sessionId });
      res.send(JSON.stringify({ success: true }));
      return;
    }
    res.send(JSON.stringify({ success: false }));
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
  console.log("request to get /posts");
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
    type: type
  });
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

app.post("/profile", upload.single("img"), (req, res) => {
  console.log("request to upload a profile");
  let name = req.body.name;
  let location = req.body.location;
  let interests = req.body.interests;
  let file = req.file;
  let frontendPath = null;
  if (file !== undefined) frontendPath = "/uploads/" + file.filename;
  dbo.collection("users").insertOne(
    {
      name: name,
      frontendPath: frontendPath,
      location: location,
      interests: interests
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

// app.post("/update"),
//   upload.none(),
//   (req, res) => {
//     console.log("request to /update");
//     let id = req.body.id.toString();
//     let desc = req.body.description;
//     console.log("send from client", desc, id);
//     dbo
//       .collection("posts")
//       .updateOne({ _id: ObjectID(id) }, { $set: { description: desc } });
//     res.send(JSON.stringify({ success: true }));
//   };

app.all("/*", (req, res, next) => {
  res.sendFile(__dirname + "/build/index.html");
});
app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
