/*
Author: Ulysse Prygiel
*/
var domains= {
		jira: "https://jira.hpsvcs.com",
	  fisheye: "https://fisheye.hpsvcs.com"
	}
	, paths = {
		jira: "/browse/$id",
		fisheye: "/cru/$id",
		searchJiraOnFisjeye: "/qsearch?q=$id&t=5&project="
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
		keyNoValid: "The key isn't valid, keep typing or do a search",
		keyValid: "Looks like a valid key, select a site or keep typing"
	}
;
function getUrl(site,text,opts){
	var baseUrl = domains[site]
		, opts = opts||{}
		, path = paths[opts.path||site]
		, defaultKey = defaultKeys[opts.defaultKey||site]
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
			, isValidKey = validRe.test(text)
			, defaultSuggestion
			, suggestions = []
			;

	defaultSuggestion = userMessages[isValidKey ? 'keyValid' : 'keyNoValid'];
	console.log(defaultSuggestion)
	chrome.omnibox.setDefaultSuggestion({
		description: defaultSuggestion
	});

	suggestions.push({
      	content: getUrl('fisheye',text,
	      		{path:'searchJiraOnFisjeye',
	      		defaultKey:'jira'}
	      	),
      	description: "Search a Review"
    });
    if (isValidKey) {
    	suggestions.unshift({content: getUrl('fisheye',text), description: "Review CRU"});
    	suggestions.unshift({content: getUrl('jira',text), description: "JIRA"});
    }
    suggest(suggestions);
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
