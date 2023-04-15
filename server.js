const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const MongoClient = require('mongodb').MongoClient;
app.use('/public',express.static('public'));
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

let db;

MongoClient.connect("mongodb+srv://urustin:asdf1234@cluster0.eonroyn.mongodb.net/?retryWrites=true&w=majority", function(err, client){
  if (err) return console.log(err)
  // var session = client.startSession();
  app.listen(8080, function() {
    console.log('listening on 8080')
  });

  //db 연결
  db = client.db("todoApp");
  // db.collection('post').insertOne({name : "AA", date : "today", _id :1100}, function(error,result){
  //   console.log("saved!");
  // });

    app.get('/', function(요청, 응답) { 
    응답.render('index.ejs')
  //   console.log("aa");
  }) 


  app.get("/write", function(req, res){
    res.render("write.ejs");
  });


  app.post('/add', function(req, res){
      res.send("전송완료");
      // console.log(req.body);
      db.collection('count').findOne({ name:"totalPost" }, function(error,result){
        // console.log(result.totalPostNumber);
        let totalPostNumber = result.totalPostNumber;
        db.collection('post').insertOne({title : req.body.title, date : req.body.date, _id :totalPostNumber+1 }, function(error,result){
          // console.log("saved!");
          db.collection('count').updateOne({name:"totalPost"},{$inc:{totalPostNumber:1},function(error,result){
            if(error){return console.log(error)}
          }})
        });
        
      });
      
  });


  app.get("/list", function(req, res){

    db.collection('post').find().toArray(function(err,result){
      // console.log(result)
      res.render('list.ejs', {posts : result});
    })
  });


  
  app.delete("/delete", function(request,response){
    // console.log(request.body);
    request.body._id = parseInt(request.body._id);
    db.collection('post').deleteOne(request.body, function(error,result){
      console.log( request.body._id + "삭제완료");
      response.status(200).send({message: "성공함"});
    })
  })


  app.get("/detail/:id",function(request, response){
    db.collection("post").findOne({_id: parseInt(request.params.id)},function(error,result){
      // console.log(result);
      // response.status(400).send({message : "실패!"})
      result===null ? console.log("noResult"): response.render("detail.ejs", {data : result})
      
    })
    
  })

  ////수정해보기

  app.get('/edit/:id',function(request, response){
    db.collection("post").findOne({_id : parseInt(request.params.id)},function(error,result){
      // console.log(result);
      response.render("edit.ejs",{data: result})
    } )
  })
  
  app.put("/edit",function(request,response){
    db.collection('post').updateOne({_id:parseInt(request.body.id)},
    {$set: {title: request.body.title, date : request.body.date}},
    function(error, result){
      console.log("수정완료");
      response.redirect("/list");
    })
    //update
  })



})




  
// 여기 이하는 쓸데없는 app.get 이런 코드들




// app.get("/pet", function(req, res){
//     res.send("AAAAAAAAAAA");
// });

// app.get("/beauty", function(req, res){
//     res.send("AAAAAAAAAAaaaaaaaaaaaaA");
// });

// app.get("/", function(req, res){
//     res.sendFile(__dirname + "/index.html");
// });









