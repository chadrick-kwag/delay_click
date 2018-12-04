chrome.runtime.onInstalled.addListener(function() {
    // Create one test item for each context type.
    var context = "link";
    var title = "add to delayed click";
    var id = chrome.contextMenus.create({"title":title,"contexts":[context],"id":"context"+context});
  
});


chrome.contextMenus.onClicked.addListener(onClickHandler);


var last_trigger_time=-1
var global_port=null

function get_delay(){
    var next_trigger_time=0;
    var d = new Date()
    var now = d.getTime()

    if(last_trigger_time <= now){
        last_trigger_time = now
    }

    if(last_trigger_time<0){
        // first delay will occur in 2seconds
        next_trigger_time = now + 2000
    }
    else{
        // consequtive delays will occur in 11seconds
        next_trigger_time = last_trigger_time + 11000
    }

    var return_delay = next_trigger_time - now
    last_trigger_time = next_trigger_time
    return return_delay
}

var progress_queue=[]

function onClickHandler(info, tab) {
    
    chrome.tabs.sendMessage(tab.id, "getClickedEl", function(clickedEl) {

        // elt.value = clickedEl.value;
        chrome.extension.getBackgroundPage().console.log("clickedEl:")
        chrome.extension.getBackgroundPage().console.log(clickedEl)
        chrome.extension.getBackgroundPage().console.log(clickedEl);
        var tabid = tab.id
        
        var delay = get_delay()
        
        var click_id = clickedEl.value

        var dcitem = new DelayClickItem(tabid, click_id, false)
        progress_queue.push(dcitem)

        console.log("showing progress_queue")
        console.log(progress_queue)

        setTimeout(function(){
            var msg={
                "id": "test1",
                "click_id": clickedEl.value
            }
            console.log("timeout done. executing function with tabid="+tabid)
            chrome.tabs.sendMessage(tabid, msg, function(data){
                // this is the callback function.

                var dcitem = fetch_dcitem(tabid, data.click_id)

                if(dcitem==null){
                    console.log("cannot retrieve dcitem")
                }
                else{
                    dcitem.finished = true
                }

                update_progress_to_popup()
            })

        }, delay )
        
    });


};


class DelayClickItem{
    constructor(tabid, click_id, finished){
        this.tabid = tabid 
        this.click_id = click_id 
        this.finished = finished
    }
}

function fetch_dcitem(tabid, click_id){
    var i;
    for(i=0;i< progress_queue.length;i++){
        var temp_dcitem = progress_queue[i]
        if(temp_dcitem.tabid==tabid && temp_dcitem.click_id==click_id){
            return temp_dcitem
        }

    }
    return null
}


function update_progress_to_popup(){
    console.log("inside update_progress_to_popup")
    var sendmsg ={
        "data": progress_queue
    }
    
    global_port.postMessage(sendmsg)
}

chrome.extension.onConnect.addListener(function(port) {
    global_port = port
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        // this is probably triggered at the very first port connection.


        // console.log("updated views")
        // console.log("message recieved from background" + msg);

        var sendmsg ={
            "data": progress_queue
        }
        port.postMessage(sendmsg);



    });
})



