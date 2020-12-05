//let leadMapping =  {"name":"Name","email":"Email","mobile_number":"Phone","job_title":"Title","company":"Name & organization"}
let leadmapping = {"Name":"last_name","Email":"email","Phone":"mobile_number","Title":"job_title","Name & organization":"name"}
let maxTime  = ''
let moment = require("moment")
exports = {

  events: [
    { event: 'onAppInstall', callback: 'onAppInstallHandler' },
    { event: 'onScheduledEvent', callback: 'onScheduledEventHandler' }
  ],

  // args is a JSON block containing the payload information.
  // args['iparam'] will contain the installation parameter values.
  onAppInstallHandler: function(args) {
    var cur = new Date()
        cur.setMinutes(cur.getMinutes()+6)
    $schedule.create({
      name: "sync_leads",
      data: {},
      schedule_at: cur.toISOString(),
      repeat: {
        time_unit: "hours",
        frequency: 12
      }
    })
    let dbtime = moment("20111031", "YYYYMMDD")
    dbtime = dbtime.format("yyyy-MM-DDTHH:mm:ss.000")
    console.log(dbtime)
    $db.set("Time",{"T":dbtime}) 
    renderData()
  },
  onScheduledEventHandler: function (args) {
    fetchrecords(args.iparams)

  }
  
};
async function fetchrecords(iparams){
   let url = `https://api.airtable.com/v0/<%= iparam.baseId %>/Contacts`
   let options = {
    headers:
   { 
       Authorization: `Bearer <%= iparam.apiKey %>`
    }
}
let storeTime = null
try{
  storeTime = await $db.get("Time")
  storeTime = storeTime.T
  maxTime = storeTime
}
catch(err){
    console.log(err)
}
$request.get(url,options).then (function(data){
  let response = JSON.parse(data.response)
  let payload = retrievePayload(response,storeTime)
})
}

function sendDataTofreshsales(payloadData){
  let headers = {
      "Authorization":"Token token=<%= iparam.freshsalesapikey %>",
      "Content-Type":"application/json",
  }
  let options = {
    headers,body:JSON.stringify(payloadData)
  }
  let url = "https://<%= iparam.freshsalesdomain %>.freshsales.io/api/leads"
  $request.post(url,options).then(function(data){console.log(data)},function(err){console.log(err)})
}
function retrievePayload(response,storetime)
{
  for(let data in response.records)
  {
    let freshsaledata = constructPayload(response.records[data],storetime)
    sendDataTofreshsales(freshsaledata)
  }
  $db.set("Time",{"T":maxTime}).then(function(data){console.log(data)},function(err){console.log(err)})
}
function constructPayload(payload,time)
{
  let createdTime = payload["createdTime"]
   let payloadData = {}
   payloadData["company"] = {}
   for(let data in payload.fields)
   { 
     if(data in leadmapping)
     {
       if(data === "Name & organization")
       {
        payloadData["company"][leadmapping[data]] = (payload.fields[data]).split(",")[1]
       }
       else
       {
        payloadData[leadmapping[data]] = payload.fields[data]
       }

     }   
   }
   return checkTime(createdTime) === true ?  payloadData : null
}
function checkTime(createdTime)
{
  if(moment(maxTime,"yyyy-MM-DDTHH:mm:ss.000").isBefore(moment(createdTime,"yyyy-MM-DDTHH:mm:ss.000")))
   {
     moment(maxTime,"yyyy-MM-DDTHH:mm:ss.000").isBefore(moment(createdTime,"yyyy-MM-DDTHH:mm:ss.000")) === true ? maxTime = createdTime : maxTime
     return true
   }
   return false
}