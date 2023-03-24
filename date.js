
module.exports.getDate = getDate;
module.exports.getDay = getDay;
function getDate()
{
    let today = new Date();
    let options={
       
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    
   return today.toLocaleString("en-US",options);

    
}

function getDay()
{
    let today = new Date();
    let options={
       
        weekday: "long",
    };
    
     return today.toLocaleString("en-US",options);

   
}
