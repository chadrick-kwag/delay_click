var port = chrome.extension.connect({
    name: "Sample Communication"
});

var waitlist_div = $("#waitlist")
var viewdocument = null


var views = chrome.extension.getViews({
    type: "popup"
});

// var document2 = views[0].document
viewdocument = views[0].document



port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    chrome.extension.getBackgroundPage().console.log("message recieved")
    chrome.extension.getBackgroundPage().console.log(msg.data)


    viewdocument.getElementById("launched_count_span").textContent=msg.data.length
    var finished_count=0

    if(msg.data.length==0){
        chrome.extension.getBackgroundPage().console.log("appending")
        waitlist_div.append("blahblah")     
        
        

        // chrome.extension.getBackgroundPage().console.log(document2)

        // var para = document2.createElement("P")
        var textnode = viewdocument.createTextNode("no items to show")

        var waitlist = viewdocument.getElementById("waitlist")

        
        waitlist.appendChild(textnode)
        

        // chrome.extension.getBackgroundPage().console.log(document2)
        
    }
    else{
        chrome.extension.getBackgroundPage().console.log("inside msg.data.length not zero")
        var i=0;
        
        for(i=0;i< msg.data.length;i++){
            var data = msg.data[i]
            // chrome.extension.getBackgroundPage().console.log(data)
            if(data.finished){
                finished_count++
            }

            var node = viewdocument.createTextNode(data.tabid+","+data.click_id)

            // chrome.extension.getBackgroundPage().console.log(node)
            var waitlist = viewdocument.getElementById("waitlist")
            // chrome.extension.getBackgroundPage().console.log("added delayclick item")
            // chrome.extension.getBackgroundPage().console.log(node)
            waitlist.appendChild(node)
        }

        
        
    }

    viewdocument.getElementById("finished_count_span").textContent=finished_count
});