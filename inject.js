var clickedEl = null;
var url_element_array=[]

document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) { 
        console.log("saved target")
        console.log(event.target)
        clickedEl = event.target;

    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "getClickedEl") {
        console.log("sending response...")
        url_element_array.push(clickedEl)
        var pushed_item_id=url_element_array.length-1
        sendResponse({value: pushed_item_id});
    }

    if(request.id=="test1"){
        console.log("inside test1")
        // clickedEl.click()
        var fetch_id = request.click_id

        var fetched_element = url_element_array[fetch_id]
        fetched_element.click()
        sendResponse({click_id: fetch_id})
    }
});