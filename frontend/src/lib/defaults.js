// Default UI labels — every visible string a user might want to rename.
// Editable via Settings page; persisted to localStorage.
export const DEFAULT_LABELS = {
  appName: "Pyydys",
  appTagline: "Online · Data is local",

  // Sidebar
  navActive: "Active",
  navArchive: "Archive",
  navSettings: "Settings",
  statusHeading: "Status",
  statusOpenSuffix: "open",
  statusDoneSuffix: "done",

  // Active page
  activeTitle: "Active Jobs",
  activeSubtitle: "Services & odd jobs that still need attention",
  searchPlaceholder: "Search by vehicle, location, notes…",

  servicesTitle: "Services",
  newServiceBtn: "New Service",
  serviceEmpty: "No services yet. Add the first one!",

  oddJobsTitle: "Odd Jobs",
  newTaskBtn: "New Task",
  oddJobEmpty: "No odd jobs yet. Add the first one!",

  viewArchive: "View archive",

  // Card actions
  actionDone: "Mark done",
  actionEdit: "Edit",
  actionDelete: "Delete",
  actionInService: "Bring IN",
  actionOutService: "Bring OUT",
  labelIn: "IN",
  labelOut: "OUT",

  // Service filter (Active page)
  filterAll: "All",
  filterIn: "IN only",
  filterOut: "OUT only",
  filterLabel: "Filter",

  // Service form
  serviceFormNew: "New Service",
  serviceFormEdit: "Edit Service",
  fieldVehicle: "Vehicle",
  fieldAction: "Action",
  fieldDate: "Date",
  fieldPlace: "Place",
  fieldNotes: "Notes",
  fieldTitle: "Title",
  fieldOptional: "(optional)",
  placeholderSelectVehicle: "Select or type vehicle…",
  placeholderSelectPlace: "Select a place…",
  placeholderNotes: "Anything worth remembering…",
  placeholderTitle: "What needs doing?",
  noPresetsHint: "Add presets in Settings.",

  // Odd job form
  oddJobFormNew: "New Odd Job",
  oddJobFormEdit: "Edit Odd Job",

  // Complete dialog
  completeTitle: "Mark as done",
  completeSubtitle: "Who worked on this job?",
  completePeoplePlaceholder: "Pick people from presets",
  completeNoPeople: "No preset people yet — add some in Settings.",
  completeConfirm: "Confirm & archive",

  // Generic
  save: "Save",
  cancel: "Cancel",
  add: "Add",
  delete: "Delete",
  reset: "Reset",
  none: "—",

  // Archive
  archiveTitle: "Archive",
  archiveSubtitle: "Completed services & odd jobs, newest first",
  archiveEmpty: "Nothing archived yet.",
  archiveServicesHeading: "Services",
  archiveOddJobsHeading: "Odd Jobs",
  restoreBtn: "Restore",

  // Settings
  settingsTitle: "Settings",
  settingsSubtitle: "Manage presets and rename any label in the app",
  settingsPlaces: "Preset Places",
  settingsPeople: "Preset People",
  settingsVehicles: "Preset Vehicles",
  settingsLabels: "Rename Labels",
  settingsAddPlaceholder: "Type and press Enter…",
  settingsResetLabels: "Reset all labels to defaults",
  settingsDangerZone: "Danger zone",
  settingsClearAll: "Erase all local data",
  settingsClearConfirm:
    "This wipes services, odd jobs and presets stored in this browser. Continue?",
};

export const DEFAULT_PRESETS = {
  places: [],
  people: [],
  vehicles: [],
};
