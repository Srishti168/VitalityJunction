var express=require("express");
var app=express();
var mysql=require("mysql");
var fileuploader=require("express-fileupload");
app.use(fileuploader());
app.listen("2100",function()
{
    console.log("started");
})
app.get("/",function(req,resp)
{
   resp.sendFile(process.cwd()+"/projects/index.html")
});
app.use(express.static("projects"));
app.use(express.urlencoded(true));


// database


var dbConfig=
{
    hostname:"127.0.0.1",
    user:"root",
    password:"root123",
    database:"bce",
    dateStrings:true
    // dateString:true
}
var dbCon=mysql.createConnection(dbConfig);
  dbCon.connect(function(err)
  {
    if(err==null){
        console.log("create connection");
    }
  })
//   



app.get("/sign-btn",function(req,resp)
{
    
  var email=req.query.kemail;
  var pwd=req.query.kpwd;
  var stype=req.query.ktype;

  // resp.send(email+" "+pwd+" "+stype);

  dbCon.query("insert into meds value(?,?,?,?)",[email,pwd,stype,1],function(err,reJSON)
  {
    if(err==null){
        // resp.send("data saved");
        resp.send("saved successfully");

    }
    else{
        resp.send(err);
    }
  })
});



app.get("/chk-btn",function(req,resp)
{
    dbCon.query("select type from meds where email=? and password=? and status =1",[req.query.kemail,req.query.kpwd],
    function(err,respJson)
    {
     if(err==null){
       if(respJson.length==1)
        resp.send(respJson[0].type);
        else
        resp.send("Invalid");
     }
     else{
      resp.send(err);
     }
    })
})



app.post("/profile",function(req,resp)
{
  // alert("hi");
  var fileName="nopics.jpg"
   if(req.files!=null)
   {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/projects/uploads/"+fileName;
      req.files.ppic.mv(path);
   }
   else{
    resp.send("please Select Id Proof Pic");
  return;
   }
//  resp.send(fileName);
   var time1=req.body.from;
   var time2=req.body.to;
   var time=time1+" to "+time2;
  //  resp.send(time);
    
   var email=req.body.txtEmail;
   var name=req.body.txtName;
   var mobile=req.body.txtMobile;
   var address=req.body.txtAdd;
   var id=req.body.txtProof;
   var city=req.body.txtCity;

   dbCon.query("insert into donor values(?,?,?,?,?,?,?,?)",[email,name,mobile,address,id,fileName,city,time],
   function(err)
   {
    if(err==null){
      resp.redirect("dash-donor.html");
    }
    else{
      resp.send(err);
    }
   })


})


app.post("/profile-upd",function(req,resp)
{
  // alert("hi");

  var fileName;
   if(req.files!=null)
   {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/projects/uploads/"+fileName;
      req.files.ppic.mv(path);
   }
   else{
    fileName=req.body.hdn;
   }
   
//  resp.send(fileName);
   var time1=req.body.from;
   var time2=req.body.to;
   var time=time1+" to "+time2;
  //  resp.send(time);
   var email=req.body.txtEmail;
   var name=req.body.txtName;
   var mobile=req.body.txtMobile;
   var address=req.body.txtAdd;
   var id=req.body.txtProof;
   var city=req.body.txtCity;

   dbCon.query("update donor  set name =? , mobile=?,address=?, proof=?, pic=? , city=?, timing=? where email=?",[name,mobile,address,id,fileName,city,time,email],
   function(err)
   {
    if(err==null){
      resp.redirect("dash-donor.html");
    }
   })


})




app.get("/chk-em",function(req,resp)
{
  dbCon.query("select * from donor where email=?",[req.query.kuchemail],function(err,reJSON)
  {
   if(err==null){
    if(reJSON.length==1){
      resp.send(reJSON);
    }
    else{
     resp.send("invalid data");
    }
   }
   else{
    resp.send(err)
   }
  })
})



app.get("/chk-med",function(req,resp)
{
  var em=req.query.email;
  var na=req.query.name;
  var da=req.query.date;
  var pa=req.query.pack;
  var qu=req.query.quant;
  // resp.send("hi");
  // dbCon.query("insert into medAv(email,m_name,date,pack,quant) values(?,?,?,?,?)",[em,na,da,pack,qu],
  // function(err)
  // {
    dbCon.query("select * from medAv where m_name=? and email=? and date=? and pack=?",[na,em,da,pa],
    function(err,respJson)
    {
    if(err==null){
      // resp.send("hii");
      // resp.send(respJson);
      if(respJson.length==1){

            // resp.send("data");
            // resp.send("Data Updated");
             dbCon.query("update medAv set quant=? where email=? and m_name=? and date=? and pack=?",[parseInt(respJson[0].quant)+parseInt(qu),em,na,da,pa],
             function(errs,respSON)
             {
              
              if(errs==null){
                resp.send("Data Updated");
              }
              else{
                resp.send(errs);
              }
             })
      }

      else{
        dbCon.query("insert into medAv(email,m_name,date,pack,quant) values(?,?,?,?,?)",[em,na,da,pa,qu],function(err,respJSON)
        {
          // resp.send("Inserted the Data");
          if(err==null){
            resp.send("Inserted the Data");
          }
          else{
            resp.send(err);
          }

        } )
      }
    }
    else{
      resp.send(err)
    }
  }
    )
})



// app.get("/ch-Pwd",function(req,resp)
// {
//     var email= req.query.chEmail;
//     var old_pwd=req.query.oldPwd;
//     var new_pwd=req.query.newPwd;
//     var ch_pwd=req.query.confPwd;
//     var type="Donor";
   
     
//     dbCon.query("update meds set password=? where email=? and type=? ",[new_pwd,email,type],
//     function(err,reJSON)
//     {
//       if(err==null){
//        if(reJSON.affectedRows==1)
//         resp.send("Updated Successfully");
//         else
//         resp.send("Invalid");
//       }
//       else{
//         resp.send(err);
//       }
//     })

 
// })


app.get("/chk-needy",function(req,resp)
{
  var email=req.query.nemail;
  dbCon.query("select * from needy where email=?",[email],
  function(err,respJson)
  {
    if(err==null){
      if(respJson.length==1){
        resp.send(respJson);
      }
      else{
        resp.send("no");
      }

    }
    else{
      resp.send(err);
    }
  })
})



app.post("/nServer",function(req,resp)
{
  
  var email=req.body.nEmail;
     var name=req.body.nName;
     var mob=req.body.nMobile;
     var dob=req.body.nDob;
     var gen=req.body.nGen;
     var city=req.body.nCity;
     var address=req.body.nAdd;
     var fileName="nopic.png";
    //  resp.send(dob);
     if(req.files!=null)
     {
      fileName=req.files.ppic.name;
      var path=process.cwd()+"/projects/uploads/"+fileName;
      req.files.ppic.mv(path);
     }
     
     dbCon.query("insert into needy values(?,?,?,?,?,?,?,?)",[email,name,mob,dob,gen,city,address,fileName],
     function(err)
     {
      if(err==null){
        resp.redirect("dash-needy.html");
      }
      else{
        resp.send(err);
      }
     })
     
})




app.post("/nUpdate",function(req,resp)
{
  console.log("hiiii");
  var email=req.body.nEmail;
  var name=req.body.nName;
  var mob=req.body.nMobile;
  var dob=req.body.nDob;
  var gen=req.body.nGen;
  var city=req.body.nCity;
  var address=req.body.nAdd;
  var fileName;
   if(req.files!=null)
  {
   fileName=req.files.ppic.name;
   var path=process.cwd()+"/projects/uploads/"+fileName;
   req.files.ppic.mv(path);
  }
  else{
   fileName=req.body.hdn;
  }
  // resp.send("hello");

  dbCon.query("update needy set names=?, mobile=?,dob=?, gen=?, city=?, address=?, picture=?  where email=?",[name,mob,dob,gen,city,address,fileName,email],
  function(err)
  {
   if(err==null){
     resp.redirect("dash-needy.html");
   }
   else{
     console.log(err);
   }
  })


})

app.get("/fetch-data",function(req,resp)
{
  dbCon.query("select * from meds where type<>?",["Admin"],function(err,respJSON)
  {
    if(err==null){
      resp.send(respJSON);
    }
    else{
      resp.send(err);
    }
  })
})


app.get("/block",function(req,resp)
{
  dbCon.query("update meds set status=0 where email=?",[req.query.kuchemail],
  function(err,respJSON)
  {
    if(err==null){
      resp.send("hiiiii");
    }
    else{
      resp.send("noooo");
    }
  })
})

app.get("/resume",function(req,resp)
{
  dbCon.query("update meds set status=1 where email=?",[req.query.kemail],
  function(err,respJSON)
  {
    if(err==null){
      resp.send("hiii");
    }
    else{
      resp.send("noooo");
    }
  })
})





app.get("/fetch-donor",function(req,resp)
{
  // alert("hi");
  // alert(req.query.kemail);
  dbCon.query("select * from medAv where email=? ",[req.query.kemail],
  function(err,respJSON)
  {
    if(err==null){
      // if(respJSON.length==1)
      resp.send(respJSON);
      // else
      // resp.send("No Data Found");
    }
    else{
      resp.send(err);
    }
  })
})

app.get("/unavailable",function(req,resp)
{
  dbCon.query("delete from medAv where sno=?",[req.query.sno],
  function(err,respJSON)
  {
    if(err==null){
      if(respJSON.affectedRows==1){
        resp.send("done");
      }
      else{
        resp.send("nodata");
      }

    }
    else{
      resp.send(err);
    }
  })
})


app.get("/find_city",function(req,resp)
{
  dbCon.query("select distinct city  from donor",function(err,respJSON)
  {
    if(err==null){
      resp.send(respJSON);
    }
    else{
      resp.send(err);
    }
  })
})



app.get("/find_med",function(req,resp)
{
  dbCon.query("select distinct m_name  from medAv",function(err,respJSON)
  {
    if(err==null){
      resp.send(respJSON);
    }
    else{
      resp.send(err);
    }
  })
})



app.get("/dofind_1donor",function(req,resp)
{
  // resp.send(req.query.kuchmed);
  dbCon.query("select * from donor inner join medAv on donor.email=medAv.email where donor.city=? and medAv.m_name=?",[req.query.kuchcity,req.query.kuchmed],
  function(err,reJSON)
  {
    if(err==null){
      resp.send(reJSON);
    }
    else{
      resp.send(err);
    }
  })
})



app.get("/ch_pwd",function(req,resp)
{
  if(req.query.new_pwd==req.query.old_pwd)
    { resp.send("Change New password");
     return;
}
  if(req.query.new_pwd!=req.query.ch_pwd)
    { resp.send("New and Confirm password are not same");
     return;
}

  
    dbCon.query("update meds set password=? where email=? and password=? and type=?",[req.query.new_pwd,req.query.kemail,req.query.old_pwd,"Donor"],
    function(err,reJSON)
    {
      if(err==null){
        if(reJSON.affectedRows==1){
          resp.send("Password Change");
        }
        else{
          resp.send("Invalid Data");
        }
      }
      else{
        resp.send(err);
      }
    })
  
})




app.get("/donors",function(req,resp)
{
  dbCon.query("select * from donor",function(err,reJSON)
  {
    if(err==null){
      resp.send(reJSON);
    }
    else{
      resp.send(err);
    }
  })
})

app.get("/needy",function(req,resp)
{
  dbCon.query("select * from needy",function(err,reJSON)
  {
    if(err==null){
      resp.send(reJSON);
    }
    else{
      resp.send(err);
    }
  })
})



app.get("/del_needy",function(req,resp)
{
  dbCon.query("delete  from needy where email=?",[req.query.kemail],function(err,reJSON)
  {
    if(err==null){
      if(reJSON.affectedRows==1)
      resp.send(reJSON);
      
      
    }
    else{
      resp.send(err);
    }
  })
})

app.get("/del_donor",function(req,resp)
{
  dbCon.query("delete  from donor where email=?",[req.query.kemail],function(err,reJSON)
  {
    if(err==null){
      if(reJSON.affectedRows==1)
      resp.send(reJSON);
      
      
    }
    else{
      resp.send(err);
    }
  })
})
