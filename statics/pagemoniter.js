var pageMonitoer = {};
var options = {};
var internalConsoleError = 'HeartBeat';
var dataFn = function(data, event) { return {data: data, event: event } };

pageMonitoer.start = function(opt) {
	options.url = opt.url;
	options.
  options.hostname = typeof opt.hostname !== 'undefined' ? opt.hostname : window.location.hostname;
  options.pathname = typeof opt.pathname !== 'undefined' ? opt.pathname : window.location.pathname;
  options.hash = typeof opt.hash !== 'undefined' ? opt.hash : window.location.hash;
  options.methods = typeof opt.methods !== 'undefined' ? opt.methods : ['log', 'info', 'warn', 'error', 'assert', 'dir', 'clear', 'profile', 'profileEnd'];
  options.logConsole = typeof opt.logConsole !== 'undefined' ? opt.logConsole : true;
  options.logError = typeof opt.logError !== 'undefined' ? opt.logError : true;
  options.callback = typeof opt.callback !== 'undefined' ? opt.callback : function(){};
  options.data = typeof opt.data !== 'undefined' ? opt.data : dataFn;

  if (options.logConsole){
    this.initConsole();
  }
  if (options.logError){
    this.initErrorlog();
  }

};

pageMonitoer.initErrorlog = function(){
	window.onerror = (function(message, url, line, col, error) {
	  if (message !== internalConsoleError){
	    var data = {
	      message: message,
	      url: url,
	      line: line,
	      col: col
	    };

	    this.sendMessage(data, 'error');
	  }
	}).bind(this);
};

pageMonitoer.initConsole = function() {
  var regexp = /\/\/(.*)\:([0-9]{1,})\:([0-9]{1,})/;

  options.methods.forEach((function(method) {

    var cLog = console[method];
    console[method] = (function(message) {
      var stackArray = (new Error()).stack;
      stackArray = stackArray ? stackArray.split(/\n/) : [];
      var content;

      for (var el = stackArray.length - 1; el >= 0; el--) {
        var matches = regexp.exec(stackArray[el]);

        for (var mch in matches) {
          if (matches[mch].length > 2) {
            content = {
              message: message,
              url: matches[1],
              line: matches[2],
              col: matches[3]
            };
            break;
          }
        }

        if (content) {
          break;
        }
      }

      if (!content) {
        content = {message: message};
      }

      this.sendMessage(content, 'console.' + method);
      cLog.apply(console, arguments);
    }).bind(this);
  }).bind(this));
};

pageMonitoer.sendMessage = function(data, event) {
  options.callback(data, event);
  var newData = options.data(data, event);
  data = newData.data;
  event = newData.event;
  
  if (options.url) {
    var id = prepareId();

    var content = JSON.stringify({
      id: id,
      timestamp: (new Date()).getTime(),
      data: data,
      event: event,
      useragent: window.navigator.userAgent
    });

    xdr(options.url, content);
  }
};

var createHttpRequest = function (){
  if(window.ActiveXObject){
      return new ActiveXObject("Microsoft.XMLHTTP");  
  }
  else if(window.XMLHttpRequest){
      return new XMLHttpRequest();  
  }  
}

var xdr = function(url, data) {
	var xhr = new createHttpRequest();

	try{
    this.httpRequest_.open("GET",url,true);
  	this.httpRequest_.send(data);
  }
  catch (ex){
    if (window && window.console && typeof window.console.log === 'function') 
    {
      console.log("Failed to log to ali log service because of this exception:\n" + ex);
      console.log("Failed log data:", url);
    }
  }
}


var makeHash = function(input) {
  var hash = 0;
  if (input.length === 0) {
    return hash;
  }

  for (var i = 0; i < input.length; i++) {
   hash = hash * 31 + input.charCodeAt(i);
   hash &= hash;
  }

  return hash;
};


var prepareId = function() {
  var idString = readProperties(window.navigator) + readProperties(window.screen) + readProperties(window.history);
  return makeHash(idString);
};

var readProperties = function(obj, depth, result, info) {
	depth = depth || 1;
	result = result || '';
	info = info || {};
	if (depth < 3) {
	  for (var property in obj) {
	    if (obj[property] !== undefined) {
	      result += property;
	      switch (typeof obj[property]) {
	        case 'object':
	          result += readProperties(obj[property], ++depth, '', info);
	          break;
	        case 'number':
	        case 'string':
	        case 'boolean':
	          result += obj[property].toString();
	          break;
	      }
	    }
	  }
	}
  return result;
};

function getPerformanceTiming () {  
    var performance = window.performance;
 
    if (!performance) {
        console.log('你的浏览器不支持 performance 接口');
        return;
    }
 
    var t = performance.timing;
    var times = {};

    times.loadPage = t.loadEventEnd - t.navigationStart;
    times.domReady = t.domComplete - t.responseEnd;
    times.redirect = t.redirectEnd - t.redirectStart;    
    times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
    times.ttfb = t.responseStart - t.navigationStart;
    times.request = t.responseEnd - t.requestStart;
    times.loadEvent = t.loadEventEnd - t.loadEventStart;
    times.appcache = t.domainLookupStart - t.fetchStart;
    times.unloadEvent = t.unloadEventEnd - t.unloadEventStart;
    times.connect = t.connectEnd - t.connectStart;
 
    return times;
}

function getEntryTiming (entry) {  
  var t = entry;
  var times = {};
 
  times.redirect = t.redirectEnd - t.redirectStart;
  times.lookupDomain = t.domainLookupEnd - t.domainLookupStart;
  times.request = t.responseEnd - t.requestStart;
  times.connect = t.connectEnd - t.connectStart;
  times.name = entry.name;
  times.entryType = entry.entryType;
  times.initiatorType = entry.initiatorType;
  times.duration = entry.duration;
 
  return times;
}

function getFunctionTimeWithDate (func) {  
  var timeStart = Data.now();
  func();
  var timeEnd = Data.now();
  
  return (timeEnd - timeStart);
}
function getFunctionTimeWithPerformance (func) {  
  var timeStart = window.performance.now();
  func();
  var timeEnd = window.performance.now();

  return (timeEnd - timeStart);
}

window.onload = function (){
	setTimeout(logger,1000)
	return logger
}

function logger(){
	var logger = new window.Tracker('cn-qingdao.log.aliyuncs.com','shang-test','shang-log-store');
	var performanceTiming = getPerformanceTiming()

	this.sendMessage(data, 'performance');
}

window.pageMonitoer = pageMonitoer;