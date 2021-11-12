/**
 * Setup triggers and install the app for this google account
 */
function install() {
  //Delete any already existing triggers so we don't create excessive triggers
  deleteAllTriggers();
  resetHistory();

  // Schedule triggers
  ScriptApp.newTrigger("main").timeBased().everyMinutes(jsonSettings.pollingInterval).create();
  ScriptApp.newTrigger("main").timeBased().after(1000).create();
  Logger.log("Installation complete.")
}

/**
 * Reset history and run the main program.
 */
function debug() {
  resetHistory();
  main();
}

function uninstall() {
  deleteAllTriggers();
  resetHistory();
  Logger.log("Uninstallation complete.")
}

function resetHistory() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('history', '');
  Logger.log('Successfully deleted history.')
}

/**
 * Run main program.
 */
function main() {
  // load target calendar
  const targetCalendar = CalendarApp.getDefaultCalendar();
  Logger.log(`Working on calendar : ${targetCalendar.getName()} (${targetCalendar.getId()})`);

  // load script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  let history = scriptProperties.getProperty('history')
  if (!history) { // first time runnning the script, we need to initialize the property
    history = '';
    scriptProperties.setProperty('history', history)
  }
  history = history.split(jsonConst.historyValueSeparator);
  Logger.log(`History : [${history}]`)

  const events = fetchEvents();

  events.forEach((event) => {
    if (!history.includes(event.summary)) { // don't create a new event
      createOptional(targetCalendar, scriptProperties, event.summary, event.startDate, event.endDate, event.eventUrl, event.description)
      Logger.log(`✔️ - Event [${event.summary}] created`);
    } else { // update event (not implemented yet)
      Logger.log(`⚠️ - Event [${event.summary}] skipped`);
    }
  })
}

