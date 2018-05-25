var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Gallery     = require("./models/gallery"),
    Review      = require("./models/review"),
    multer      = require("multer"),
    fs          = require("fs"),
    serveStatic = require("serve-static")


var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function(req, file, callback) {
        //console.log(file);
        //callback(null, file.filename + "-" + Date.now() + path.extname(file.originalname));
        callback(null, Date.now() + "-" + file.originalname);
    }
});

var upload = multer({storage: storage}).single("file");

//connecting the database to the developing (C9) environment and deployed (Heroku) environment
var url = process.env.DATABASEURL || "mongodb://localhost/vietnam";
mongoose.connect(url); //in console: export DATABASEURL=mongodb://localhost/vietnam

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public")); //lets us use main.css in public dir
app.use(serveStatic("uploads/"));


// -- ROUTES: WILL REFACTOR INTO DIFFERENT FILES -- //

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/about-us", function(req, res) {
    res.render("about");
});

//INDEX GALLERY PAGE
app.get("/gallery", function(req, res) {
    //get all images from DB
    Gallery.find({}, function(err, allImages) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("gallery/index", {images: allImages});
        }
    });
});

//ADD NEW IMAGE
app.get("/gallery/new", function(req, res) {
    res.render("gallery/new");
});

//POST THE IMAGE
app.post("/gallery", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.end("Problem uploading file");
        }
        var image = req.file.filename; //req.file.originalname
        var desc = req.body.description;
        var newImage = {image: image , description: desc};
        
        //create the new image and save
        Gallery.create(newImage, function(err, newlyCreated) {
            if (err) {
                console.log(err);
            }
            else {
                //redirect to gallery page
                res.redirect("/gallery");
            }
        });
    });
});

// ========================= //
//     MENU ITEMS ROUTES     //
// ========================= //

app.get("/menu/appetizers", function(req, res) {
    res.render("menu/appetizer");
});

app.get("/menu/noodle-soup", function(req, res) {
    res.render("menu/noodleSoup");
});

app.get("/menu/chow", function(req, res) {
    res.render("menu/chow");
});

app.get("/menu/rice-dishes", function(req, res) {
    res.render("menu/riceDish");
});

app.get("/menu/veggie", function(req, res) {
    res.render("menu/vegetarian");
});


//CONTACT PAGE
app.get("/contact", function(req, res) {
    res.render("contact");
});

// ============================ //
//      REVIEWS ROUTES         //
// =========================== //

//INDEX REVIEWS PAGE
app.get("/reviews", function(req, res) {
    //get all reviews from DB
    Review.find({}, function(err, allReviews) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("reviews/index", {reviews: allReviews});
        }
    });
});

//ADD NEW REVIEW
app.get("/reviews/new", function(req, res) {
    res.render("reviews/new");
});

//POST REVIEW
app.post("/reviews", function(req, res) {
    var text = req.body.text;
    var author = req.body.author;
    var newReview = {text: text, author: author};
    
    Review.create(newReview, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/reviews");
        }
    });
});



// ------------------------------------------------------- //

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started...");
});
