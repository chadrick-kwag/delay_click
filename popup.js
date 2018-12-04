var port = chrome.extension.connect({
    name: "Sample Communication"
});

var empty_message_element = $("#empty_message")
var waitlist = $("#waitlist")
var viewdocument = null


var views = chrome.extension.getViews({
    type: "popup"
});

viewdocument = views[0].document



port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
    chrome.extension.getBackgroundPage().console.log("message recieved")
    chrome.extension.getBackgroundPage().console.log(msg.data)


    viewdocument.getElementById("launched_count_span").textContent=msg.data.length
    var finished_count=0

    if(msg.data.length==0){
        chrome.extension.getBackgroundPage().console.log("appending")
        // waitlist_div.append("blahblah")     
        
        var textnode = viewdocument.createTextNode("no items to show")
        // var waitlist = viewdocument.getElementById("waitlist")

        
        // waitlist.appendChild(textnode)
        // empty_message_element.append(textnode)
        // $("#empty_message").append()
        empty_message_element.append($('<p>no items to show</p>'))
        
    }
    else{

        empty_message_element.css("visibility", "hidden")

        waitlist.empty()

        chrome.extension.getBackgroundPage().console.log("inside msg.data.length not zero")
        var i=0;
        
        for(i=0;i< msg.data.length;i++){
            var data = msg.data[i]
            // chrome.extension.getBackgroundPage().console.log(data)
            if(data.finished){
                finished_count++
            }

            // var node = viewdocument.createTextNode(data.tabid+","+data.click_id)

            // var waitlist = viewdocument.getElementById("waitlist")
            // waitlist.appendChild(node)

            var newitem = $('<li>', {class: 'list-group-item'})

            newitem.html(data.tabid+","+data.click_id+","+data.finished)

            waitlist.append(newitem)


        }
    }

    viewdocument.getElementById("finished_count_span").textContent=finished_count
});