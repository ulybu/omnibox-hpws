/*
Author: Ulysse Prygiel
*/
var domains= {
		jira: "https://jira.hpsvcs.com",
	  fisheye: "https://fisheye.hpsvcs.com"
	}
	, paths = {
		jira: "/browse/$id",
		fisheye: "/cru/$id"
	}
	, defaultKeys = {
		jira: "CS-$NUM",
		fisheye: "CR-$NUM"
	}
	, keyRegexps = {
		jira: /^[a-zA-Z]{2,4}/,
		fisheye: /^CR/
	}
	, userMessages = {
		keyNoValid: "The key isn't valid, keep typing",
		keyValid: "Looks like a valid key, select a site or keep typing"
	}
;
function getUrl(site,text,opts){
	var baseUrl = domains[site]
		, path = paths[site]
	  , defaultKey = defaultKeys[site]
		, keyRegexp = keyRegexps[site]
		, url
	  ;
	if( ! keyRegexp.test(text) ) {
		text = defaultKey.replace('$NUM',text);
	}
	url = baseUrl + path;
	url = url.replace('$id', text);
	return url;
}
chrome.omnibox.setDefaultSuggestion({
	description: userMessages.keyNoValid
});
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
		var validRe = /^\d+$|^[a-zA-Z]{2,4}-\d+$/
			, defaultSuggestion
			;
    suggest([
      {content: getUrl('jira',text), description: "JIRA"},
      {content: getUrl('fisheye',text), description: "Review CRU"}
    ]);
		defaultSuggestion = userMessages[validRe.test(text) ? 'keyValid' : 'keyNoValid'];
		console.log(defaultSuggestion)
		chrome.omnibox.setDefaultSuggestion({
			description: defaultSuggestion
		});
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
	// user accepts
  function(text) {
		var currentIndex;
		chrome.tabs.query({active:true},function(tabs){
			// got the active tab
			currentIndex = tabs[0].index
			// create new tab next to the current one
			chrome.tabs.create({
      		url: text,
      		index: currentIndex + 1,
      		active: true
				}, function(){}
			);
		});
});
