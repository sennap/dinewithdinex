//Sets cookie for fb_id & fb_name
function setCookie(c_name,value,exdays) {
  //sets the cookie value 
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
  document.cookie=c_name + "=" + c_value;
};

if (typeof String.prototype.trimLeft !== "function") {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/, "");
    };
}
if (typeof String.prototype.trimRight !== "function") {
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/, "");
    };
}
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(callback, thisArg) {
        for (var i=0, n=this.length, a=[]; i<n; i++) {
            if (i in this) a[i] = callback.call(thisArg, this[i]);
        }
        return a;
    };
}

function getCookies() {
    var c = document.cookie, v = 0, cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
        c = RegExp.$1;
        v = 1;
    }
    if (v === 0) {
        c.split(/[,;]/).map(function(cookie) {
            var parts = cookie.split(/=/, 2),
                name = decodeURIComponent(parts[0].trimLeft()),
                value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
            cookies[name] = value;
        });
    } else {
        c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
            var name = $0,
                value = $1.charAt(0) === '"'
                          ? $1.substr(1, -1).replace(/\\(.)/g, "$1")
                          : $1;
            cookies[name] = value;
        });
    }
    return cookies;
}
function getCookie(name) {
    return getCookies()[name];
}

function directToDashboard() {
  window.location.href = "/dashboard/" + getCookie("fb_id");
}

//Dependent on URL. May need to fix later
function acceptOffer() {
  var a = document.URL.split("/")
  var id = a[a.length-1]
  var data = {
    accepted : true,
    buyer_id : getCookie("fb_id"),
    buyer_name : getCookie("fb_name")
  }

  $.ajax({
    type: "post",
    url: "/update/"+id,
    data: JSON.stringify(data),
    contentType: "application/json"
  }).done(function(){
    directToDashboard();
  });
}
 
function rejectOffer() {
  var a = document.URL.split("/")
  var id = a[a.length-1]
  var data = {
    accepted : false,
    buyer_id : null,
    buyer_name : null
  }

  $.ajax({
    type: "post",
    url: "/update/"+id,
    data: JSON.stringify(data),
    contentType: "application/json"
  }).done(function(){
    directToDashboard();
  });
} 

function completeOffer() {
  var a = document.URL.split("/")
  var id = a[a.length-1]
  var data = {
    completed : true
  }

  $.ajax({
    type: "post",
    url: "/update/"+id,
    data : JSON.stringify(data),
    contentType: "application/json"
  }).done(function(){
    directToDashboard();
  });
}


