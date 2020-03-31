$(document).ready(function() {
  app.initialized()
    .then(function(client){
      window.client = client;
    }).then(function(){
      show_all();
    }).then(function(){
      onRefresh();
    }).catch(function(error){
      Notify(error,"error")
    })
})

function Notify(msg,type){
  client.interface.trigger("showNotify",{
    type: type,
    message:msg
  })
}
  
function onRefresh(){
  document.getElementById("timing").style.visibility = "hidden";
  document.getElementById("timing1").style.visibility = "hidden";
  client.db.get("schedule")
  .then(function(data){
    return new Promise(function(resolve,reject){
      if(data.scheduled_at!=0){
      resolve(data);
      }
      else{
      reject(new Error("No Current Task"))
      }
    })
  }).then(function(data){
    return calculateTimeLeft(data);
  }).then(function(TimeLeft){
    if(TimeLeft.status===1){
      Interval(0,0,TimeLeft.min,TimeLeft.sec);
    }
    else{
      if((TimeLeft.count+1)%4===0){
        Interval(TimeLeft.min,TimeLeft.sec,"15",0);
      }
      else{
        Interval(TimeLeft.min,TimeLeft.sec,"6",0);
      }
    }
  }).catch(function(error){
    if(error.message!="No Current Task")
    Notify(error,"error")
  })
}  


function calculateTimeLeft(data){
  return new Promise (function(resolve){
  let date =new Date();
  let date1=new Date(data.scheduled_at);
  let diff=date1-date;
  client.db.get("time")
    .then(function(time){
      const TimeLeft = {
        min:(Math.floor(diff/60000)),
        sec:(Math.floor(diff/1000)%60),
        count:data.count,
        status:time.work
      };
      resolve(TimeLeft);
    })
    .catch(function(error){
      Notify(error,"error");
    })
  })
}

function show_all(){
  client.db.get("end")
    .then(function(data){
      return new Promise(function(resolve,reject){
        if(data.i===0){
        reject(new Error("End:0"));
        }
        else{
        resolve(data.i);
        }
      });
    }).then(function(end){
      return getEntireTodoList(end);
    }).then(function(data){
      displayList(data.length,data)
    }).catch(function(error){
      if(error.message==="End:0")
      document.getElementById("list").innerHTML="No List Available!!"
      else
      Notify(error,"error");
    })
}

function displayList(end,data){
  for(i of Array(end).keys())
    document.getElementById("list").innerHTML+=`<tr><th style="width:30%;">${i+1}:</th><th> ${data[i].to_do}</th></tr>`
}

function delete_item(){
  let value= document.getElementById("delete1").value
  document.getElementById("delete1").value="";
  if(value)
  {
    client.db.get("end")
      .then(function(data){
        return getEntireTodoList(data.i)
      }).then(function(data){
          return get_matchedId(data.length,data,value);
      }).then(function(data){
          return new Promise(function(resolve,reject){
            if(data.matched_id===undefined){
            reject(new Error("Not in the List"));
            }
            else{
            resolve(data);
            }
          });
      }).then(function(data){
          return shiftList(data.list,data.end,data.matched_id)
      }).then(function(end){
          return deleteLastElement(end);
      }).then(function(end){
          return updateListId(end)
      }).then(function(){
          Notify("Deleted!!","success");
      }).catch(function(error){
          if(error.message="Not in the List")
            Notify(error.message,"error")
          else
          Notify(error,"error");
      })     
  }
  else
    Notify("Type Something","warning");
}


function getEntireTodoList(end){
  let prom=[];
  return new Promise(function(resolve,reject){
    for (j of Array(end).keys()) 
      prom[j] = client.db.get(`${j}`)
    Promise.all(prom).then(function(data){
      resolve(data);
    })
    .catch(function(error){
      reject(error);
    });
  })
}

function get_matchedId(end,data,value){
  let matched_id
  return new Promise(function(resolve){
    for(j of Array(end).keys())
      if(data[j].to_do===value){
        matched_id=j
        break;
      }
      data={
        list:data,
        end:end,
        matched_id:matched_id
      }
      resolve(data);
  })
}

function shiftList(data,end,matched_id){
  let prom=[]
  return new Promise(function(resolve,reject){
    for(let i=matched_id;i<end-1;i++)
    {
      prom[i]=client.db.set(i,{"to_do":data[i+1].to_do,"count":data[i+1].count,"index":i});
    }
    Promise.all(prom).then(function(){
      resolve(end);
    })
    .catch(function(error){
      reject(error);
    })
  })
}

function deleteLastElement(end){
  return new Promise(function(resolve){
    client.db.delete(end-1)
    resolve(end);
  })
}

function updateListId(end){
  id=end-1;
  return new Promise(function(resolve,reject){
    client.db.set("end",{"i":id})
      .then(function(){
        document.getElementById("list").innerHTML="";
        show_all();
      }).then(function(){
        resolve(end);
      })
      .catch(function(error){
        reject(error);
      })
  })
}


function set_pomodoro(){
  const taskmin=25,tasksec=0,breaksec=0;
  let value=document.getElementById("pomodoro").value;
  document.getElementById("pomodoro").value=""
  if(value){
    client.db.get("schedule")
      .then(function(data){
        return new Promise(function(resolve,reject){
          if(data.scheduled_at==="0")
          resolve();
          else
          reject(new Error("Task is on going!!"));
        })
      }).then(function(){
        return client.db.get("end")
      }).then(function(data){
          return getEntireTodoList(data.i)
      }).then(function(data){
          x=get_breaktime(data.length,data,value);
          breakmin=x.breakTime
          matched_id=x.id;
          if(matched_id===undefined)
            Notify("Not in the list","warning");
          else{
            InvokeSchedule(matched_id).then(function(){
              Notify("25 Minutes Timer has Started!","info")
              Interval(taskmin,tasksec,breakmin,breaksec);
            },function(){
              Notify(error,"error");
            })
          }
      }).catch(function(error){
            if(error.message="Task is on going!!")
            Notify(error.message,"warning");
            else
            Notify(error,"error");
        })
  }
  else{
    Notify("Type Something!!","warning")
  }
}


function InvokeSchedule(){
  return new Promise(function(resolve){
    client.request.invoke("createSchedule", getScheduleData(matched_id)).then(function(){
      resolve();
    }).catch(function(error){
      Notify(error,"error");
    }) 
  })
}

function get_breaktime(end,elements,value){
  let min,matched_id;
  for(j of Array(end).keys())
    {
    if(elements[j].to_do===value){
      matched_id=j;
      count=(elements[j].count)+1;
      if(count%4==0)
        min=15;
      else
        min=6;
    break;
    }
    }
    const data = {
      breakTime: min,
      id: matched_id
    };
  return data;
}

function getScheduleData(matched_id) {
  const date = new Date();
  date.setMinutes(date.getMinutes()+Number(25));
  const scheduleData = {
    schedule_at: date.toISOString(),
    id: matched_id
    };
  return scheduleData;
}

function Interval(m,s,m1,s1){
  const Repeat=1000;
  interval=setInterval(function(){
    client.db.get("time").then(function(data){
        if(data.work===1){
          document.getElementById("timing").style.visibility = "visible";
          document.getElementById("timing1").innerHTML=`Break....`;
          document.getElementById("timing1").style.visibility = "visible";
          if(m1>=0){
            document.getElementById("timing").innerHTML=`${m1}min:${s1}sec`;
          }
          s1--;
          if(s1<0)
          {
              s1=59;
              m1--;
          }
          }
        if(data.break===1){
          document.getElementById("timing").style.visibility = "hidden";
          document.getElementById("timing1").style.visibility = "hidden";
          Notify("break completed","info");
          clearInterval(interval);
        }
        if(data.timer===1){
          document.getElementById("timing").style.visibility = "visible";
          document.getElementById("timing1").innerHTML="Time is running....."
          document.getElementById("timing1").style.visibility ="visible";
          if(m>=0){
            document.getElementById("timing").innerHTML=`${m}min:${s}sec`;
          }
          else
          {
            document.getElementById("timing").style.visibility ="hidden";
            document.getElementById("timing1").style.visibility ="hidden";
          }
          s--;
          if(s<0){
            s=59;
            m--;
          }
        }
      }).catch(function(error){
        Notify(error,"error");
      })
  },Repeat);
}


