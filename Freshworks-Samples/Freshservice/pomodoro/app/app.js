$(document).ready(function () {
app.initialized()
  .then(function (client){
    window.client = client;
    client.events.on("app.activated",
      function (){
        client.instance.resize({ height: "300px" })
          .then(function (){ 
            logged_In();
          })
          .catch(function(err){
            displayError(err);
          })
      },function(){
        displayError("ActivationError");
      });
  })
  .catch(function(){
    displayError("InitialisationError");
  })
});


function logged_In() {
  client.data.get('loggedInUser')
    .then(function (data){
      $('#doneBy').text("Todo list created by " + data.loggedInUser.user.name);
    })
    .catch(function (error){
      displayError(error);
    })
}


function clear1() {
  document.getElementById("list_summary").style.visibility = "hidden";
  client.db.get("end")
    .then(function(data){
      deleteEntireTodoList(data.i);
    })
    .then(function () {
      Notify("Cleared","success");
      client.db.set("end", { i: 0 })
    })
    .then(function(){
      summary();
    })
    .catch(function(error){
      displayError(error);
    })
}

function deleteEntireTodoList(end){
  return new Promise(function(resolve){
    let prom=[];
    for (j of Array(end).keys()) 
    {
    prom[j] = client.db.delete(`${j}`);
    }
    Promise.all(prom).then(function(){
      resolve();
    })
  })
}


function Add_Item() {
  let to_do = document.getElementById("search").value;
  document.getElementById("search").value = "";
  if (to_do) {
    client.db.get("end")
      .then(function(data){
        client.db.set(`${data.i}`, { "to_do": to_do, "count": 0, "index": data.i })
      }).then(function(){
        Notify("Saved Successfully","success");
        client.db.update("end", "increment", { i: 1 })
      }).then(function(){
        summary();
      }).catch(function(error){
        displayError(error);
      })
  }
  else
    Notify("Type Something","warning");
}

function Notify(msg,type){
  client.interface.trigger("showNotify", {
    type: type,
    message: msg
  })
}


function show_all() {
  client.interface.trigger("showModal", {
    title: "To_do List",
    template: "next.html"
  });
}


function getEntireTodoList(end){
  return new Promise(function(resolve){
    let prom=[];
    for (j of Array(end).keys()) 
    {
      prom[j] = client.db.get(`${j}`)
    }
    Promise.all(prom).then(function(data){
      let datum={
        data:data,
        end:end
      };
      resolve(datum);
    })
  })
}

function summary(){
  document.getElementById("list_summary").style.visibility = "visible";
  client.db.get("end")
    .then(function(data){
      return new Promise(function(resolve,reject){
        if(data.i!=0)
        resolve(data.i);
        else
        reject(new Error("end:0"))
      })
    }).then(function(end){ 
      return getEntireTodoList(end)
    }).then(function(data){ 
      displaySummary(data.end,data.data)
    }).catch(function(error){
      if(error.message==="end:0")
      document.getElementById("list_summary").innerHTML ="No List Available"
      else
      displayError(error)
    })
}

function displaySummary(end,data){
  document.getElementById("list_summary").innerHTML =" "
  for (i of Array(end).keys()) 
    document.getElementById("list_summary").innerHTML += `<tr><td>${data[i].to_do}</td><td>${data[i].count} times</td><td>${data[i].count * 25}mins</td>`;
}

function displayError(error){
  client.interface.trigger("showNotify", {
    type: "error",
    message: error
  });
}