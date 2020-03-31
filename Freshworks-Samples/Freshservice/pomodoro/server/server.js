
exports = {
  events: [{event: "onAppInstall", callback: "onAppInstallCallback"},
           {event: "onScheduledEvent", callback: "onScheduledEventHandler"}],
  onAppInstallCallback: function(){
    $db.set("end",{"i":0})
    $db.set("schedule",{"scheduled_at":"0",id:"-1",count:"0"})
    $db.set("time",{"work":0,"break":0,"timer":0})
    renderData()  
  },
  createSchedule:async function(args){
    await $db.set("time",{"work":0,"break":0,"timer":1})
    data=await $db.get(`${args.id}`)
    count=data.count;
    await $db.set("schedule",{"scheduled_at":args.schedule_at,"id":args.id,"count":count})
    await $schedule.create({
      name :args.schedule_at,
      data: {},
      schedule_at:args.schedule_at,
    })
    renderData(null,"success");
  },
  onScheduledEventHandler:async function(){
    data=await $db.get("time")
      if(data.timer===1){
      await $db.set("time",{"work":1,"break":0,"timer":0})
      data=await $db.get("schedule")
      id=data.id;
      await $db.update(`${id}`,"increment",{count:1})
      data=await $db.get(`${id}`)
      if((data.count)%4===0){
        const date = new Date();
        date.setMinutes(date.getMinutes()+Number(15));
        $db.set("schedule",{"scheduled_at":date.toISOString(),"id":data.index});
        $schedule.create({
          name: date.toISOString(),
          data: {},
          schedule_at: date.toISOString()
        })           
        } 
      else{
        const date = new Date();
        date.setMinutes(date.getMinutes()+Number(6));
        $db.set("schedule",{"scheduled_at":date.toISOString(),"id":data.index});
        $schedule.create({
          name: date.toISOString(),
          data: {},
          schedule_at:date.toISOString()
        })
      }
    }
    if(data.work===1){
      $db.set("time",{"work":0,"break":1,"timer":0})
      $db.set("schedule",{"scheduled_at":"0",id:"-1"});
    }
  }
}


