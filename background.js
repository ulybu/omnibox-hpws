// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

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
console.log("loading")
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
  function(text) {
    console.log('inputEntered: ' + text);
    //alert('You just typed "' + text + '"');
  });
