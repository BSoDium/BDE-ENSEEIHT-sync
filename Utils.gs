/**
 * Remove all triggers for the script's 'main' and 'install' function.
 */
function deleteAllTriggers(){
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++){
    if (["main","install"].includes(triggers[i].getHandlerFunction())){
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}


/**
 * Fetch and parse events from website HTML data.
 */
function fetchEvents() {
  var options = {
    method: 'GET'
  };
  var response = UrlFetchApp.fetch(jsonConst.url.main, options);
  const rawEvents = response.getContentText().split('<div class="panel panel-primary">').slice(1); // remove the first part from the start
  rawEvents[rawEvents.length - 1] = rawEvents[rawEvents.length - 1].split('<div class="row">')[0];
  
  const events = rawEvents.map((rawHtml) => {
    const timestamps = rawHtml.match(jsonConst.parsingPatterns.timestamps)[0].trim().slice(3).split(" au ");
    const eventUrl = `${jsonConst.url.main}${rawHtml.match(jsonConst.parsingPatterns.id)[0]}/`
    
    let summary = rawHtml.match(jsonConst.parsingPatterns.summary)[0].trim();
    // replace html encoded characters
    Object.keys(jsonConst.dcodePatterns).forEach((pattern) => {
      summary = summary.replaceAll(`&${pattern};`, jsonConst.dcodePatterns[pattern])
    })
    // add icon
    
    const key = Object.keys(jsonConst.keywordEmojis).find((keyword) => containsKeyword(summary, keyword));
    if (key) {
      summary = `${jsonConst.keywordEmojis[key]} ${summary}`
    } else {
      summary = `${jsonConst.keywordEmojis['default']} ${summary}`
    }
    
    let description = rawHtml.match(jsonConst.parsingPatterns.description)[0];
    // parse description
    description = description.replaceAll(/(<p>|<\/p>)/gm, '').trim();
    description = description.replaceAll(/\n(\n)*/gm, '\n');
    if (description.length > jsonSettings.maxDescriptionLength) {
      description = `${description.substring(0, jsonSettings.maxDescriptionLength)}...\n<a href="${eventUrl}" class="menu-link" target="_blank"">Read more</a>\n`
    }

    return {
      summary,
      startDate: new Date(timestamps[0]),
      endDate: new Date(timestamps[1]),
      description,
      eventUrl
    }    
  })
  return events;
}


/**
 * Create and optional event on the target calendar.
 */
function createOptional(targetCalendar, scriptProperties, summary, startDate, endDate, eventUrl, description=null, location=null, sendInvites=true) {
  const userEmail = Session.getEffectiveUser().getEmail()
  
  targetCalendar.createEvent(summary,
    startDate,
    endDate,
    {location,
    description,
    guests: userEmail,
    sendInvites});

    // send email
    const emailBody = `<body style="text-align: center;">
    <img src="https://www.bde.enseeiht.fr/static/assets/n7/logo.png" style="width: 200px; height: fit-content; margin-bottom: 40px;"/>
    <div class="container" style="text-align: center; background-color: rgba(20, 50, 70, 0.1); border-radius: 20px; padding: 10px;" >
      <h1 style="margin: 0;">Hey ${jsonSettings.userName} 👋</h1>
      <h1 style="margin: 0;">A new event has just been added 🎉</h1>
      <div class="event" style="background-color: rgba(77, 77, 77, 0.1); padding: 15px 20px; border-radius: 10px; margin: 30px 0 15px 0; width: fit-content; display: inline-block;">
        <h2 style="margin: 0; position: relative; color: rgb(40, 40, 40)"><span style="color: white;">${summary}</span> - from <span style="color: white;">${startDate.toUTCString().slice(0, -4)}</span> to <span style="color: white;">${(startDate.toDateString() === endDate.toDateString()) ? endDate.toTimeString().slice(0, 8) : endDate.toUTCString().slice(0, -4)}</span></h2>
      </div>
      <h2 style="color: rgb(70, 70, 70); margin: 0 0 30px 0;">Mind checking it out real quick ?</h2>
      <b>
        <a href="${eventUrl}" style="border: none; background-color: rgb(57, 86, 150); color: white; padding: 10px 60px; border-radius: 10px; position: relative; display: inline-block;">🚀 Take me there</a>
      </b>
    </div>
</body>`
    MailApp.sendEmail({
      to: userEmail,
      subject: `[BDE ENSEEIHT] New event added`,
      htmlBody: emailBody
    })

    // record added event if the previous action was completed successfully
    const history = scriptProperties.getProperty('history');
    scriptProperties.setProperty('history', `${history}${history.length ? jsonConst.historyValueSeparator : ''}${summary}`)
}

function login() {
  const scriptProperties = PropertiesService.getScriptProperties();
  var payload = 
  {
    "user_session[email]" : scriptProperties.getProperty('USERNAME'),
    "user_session[password]" : "password",
  }
}

/**
 * Try to match substantially similar words
 */
function containsKeyword(expression, keyword) {
  let uexpression = '';
  let ukeyword = '';
  for (let i = 0; i < expression.length; i++) {
    let replaceChar = jsonConst.summarizeUnicode[expression[i]] || expression[i];
    uexpression = uexpression + replaceChar;

  }

  for (let i = 0; i < keyword.length; i++) {
    let replaceChar = jsonConst.summarizeUnicode[keyword[i]] || keyword[i];
    ukeyword = ukeyword + replaceChar;
  }

  ukeyword = ukeyword.toLowerCase();
  uexpression = uexpression.toLowerCase();

  return Boolean(uexpression.match(new RegExp(`.*${ukeyword}.*`, '')));
}


